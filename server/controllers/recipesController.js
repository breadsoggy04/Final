/**
 * Recipes Controller - Spoonacular API Integration
 * CS 409 Web Programming - UIUC Final Project
 * 
 * satisfies: external API integration requirement
 * satisfies: recipe search & ranking requirement
 * satisfies: caching requirement (in-memory cache)
 */

const axios = require('axios');
const sampleRecipes = require('../data/sampleRecipes');

// Simple in-memory cache to reduce API calls
// satisfies: caching layer requirement
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

/**
 * Get cached data or null if expired/missing
 */
const getFromCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
};

/**
 * Store data in cache
 */
const setCache = (key, data) => {
  // Limit cache size to prevent memory issues
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Check if a Spoonacular API key is configured
 */
const hasConfiguredApiKey = () => Boolean(process.env.SPOONACULAR_API_KEY || process.env.RECIPE_API_KEY);

/**
 * Normalize a comma-separated ingredient list into searchable tokens
 */
const normalizeIngredientTokens = (ingredients) => ingredients
  .split(',')
  .map(item => item.trim().toLowerCase())
  .filter(Boolean);

/**
 * Determine if an ingredient name matches any user-provided token
 */
const matchesToken = (value = '', tokens = []) => {
  const normalizedValue = value.toLowerCase();
  return tokens.some(token => 
    normalizedValue.includes(token) || token.includes(normalizedValue)
  );
};

/**
 * Clone ingredient data to avoid mutating sample dataset
 */
const cloneIngredient = (ingredient = {}) => ({
  name: ingredient.name,
  original: ingredient.original || ingredient.name || '',
  amount: ingredient.amount ?? null,
  unit: ingredient.unit || '',
  image: ingredient.image || null
});

/**
 * Project a sample recipe into the same response shape as Spoonacular
 */
const projectSampleRecipe = (recipe, tokens) => {
  const ingredients = recipe.ingredients || [];
  const usedIngredients = ingredients
    .filter(ingredient => matchesToken(ingredient.name || '', tokens))
    .map(cloneIngredient);

  if (usedIngredients.length === 0) {
    return null;
  }

  const missedIngredients = ingredients
    .filter(ingredient => !matchesToken(ingredient.name || '', tokens))
    .map(cloneIngredient);

  const totalIngredients = ingredients.length || 1;
  const matchPercentage = Math.round(
    (usedIngredients.length / totalIngredients) * 100
  );

  return {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes || 0,
    proteinGrams: recipe.proteinGrams || 0,
    calories: recipe.calories || 0,
    summary: recipe.summary || '',
    cuisines: recipe.cuisines || [],
    diets: recipe.diets || [],
    usedIngredientCount: usedIngredients.length,
    missedIngredientCount: missedIngredients.length,
    usedIngredients,
    missedIngredients,
    matchPercentage
  };
};

/**
 * Build a ranked response using the offline sample dataset
 */
const buildSampleSearchResults = (ingredientList, minProtein, maxTime) => {
  const tokens = normalizeIngredientTokens(ingredientList);
  const numericMinProtein = Number(minProtein) || 0;
  const numericMaxTime = Number(maxTime) || 999;

  const enrichedRecipes = sampleRecipes
    .map(recipe => projectSampleRecipe(recipe, tokens))
    .filter(Boolean)
    .filter(recipe => recipe.proteinGrams >= numericMinProtein)
    .filter(recipe => numericMaxTime >= 999 ? true : recipe.readyInMinutes <= numericMaxTime);

  const rankedRecipes = rankRecipes(enrichedRecipes);

  return {
    recipes: rankedRecipes,
    total: rankedRecipes.length,
    filters: {
      ingredients: ingredientList,
      minProtein: numericMinProtein,
      maxTime: numericMaxTime
    },
    source: 'sample'
  };
};

/**
 * Build Spoonacular API URL
 */
const buildSpoonacularUrl = (endpoint) => {
  return `https://api.spoonacular.com${endpoint}`;
};

/**
 * Get API key from environment
 */
const getApiKey = () => {
  const apiKey = process.env.SPOONACULAR_API_KEY || process.env.RECIPE_API_KEY;
  if (!apiKey) {
    throw new Error('SPOONACULAR_API_KEY not configured');
  }
  return apiKey;
};

/**
 * Extract protein from nutrition data
 */
const extractProtein = (nutrition) => {
  if (!nutrition || !nutrition.nutrients) return 0;
  
  const protein = nutrition.nutrients.find(n => 
    n.name.toLowerCase() === 'protein'
  );
  
  return protein ? Math.round(protein.amount) : 0;
};

/**
 * Extract calories from nutrition data
 */
const extractCalories = (nutrition) => {
  if (!nutrition || !nutrition.nutrients) return 0;
  
  const calories = nutrition.nutrients.find(n => 
    n.name.toLowerCase() === 'calories'
  );
  
  return calories ? Math.round(calories.amount) : 0;
};

/**
 * Rank recipes by: ingredient match, protein, cooking time
 * satisfies: recipe ranking requirement
 */
const rankRecipes = (recipes) => {
  return recipes.sort((a, b) => {
    // Primary: Highest ingredient match percentage
    const matchA = a.usedIngredientCount / (a.usedIngredientCount + a.missedIngredientCount) || 0;
    const matchB = b.usedIngredientCount / (b.usedIngredientCount + b.missedIngredientCount) || 0;
    
    if (matchB !== matchA) {
      return matchB - matchA;
    }
    
    // Secondary: Higher protein content
    if (b.proteinGrams !== a.proteinGrams) {
      return b.proteinGrams - a.proteinGrams;
    }
    
    // Tertiary: Lower cooking time
    return a.readyInMinutes - b.readyInMinutes;
  });
};

/**
 * @desc    Search for recipes based on ingredients and filters
 * @route   POST /api/recipes/search
 * @access  Public
 */
const searchRecipes = async (req, res) => {
  const { ingredients, minProtein = 0, maxTime = 999 } = req.body;
  let ingredientList = '';
  let cacheKey = '';
  let respondWithSampleResults = null;

  try {
    // Validate ingredients
    if (!ingredients) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please provide at least one ingredient'
      });
    }

    // Normalize ingredients to string
    ingredientList = Array.isArray(ingredients) 
      ? ingredients.join(',')
      : ingredients;

    if (!ingredientList.trim()) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Please provide at least one ingredient'
      });
    }

    // Create cache key
    cacheKey = `search:${ingredientList}:${minProtein}:${maxTime}`;
    
    // Check cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      console.log('Returning cached search results');
      return res.json(cachedResult);
    }

    const useSampleEnvFlag = process.env.USE_SAMPLE_RECIPES;
    const forceSampleData = useSampleEnvFlag === 'true';
    const allowSampleFallback = useSampleEnvFlag !== 'false';
    const apiKeyConfigured = hasConfiguredApiKey();

    respondWithSampleResults = () => {
      if (!ingredientList) {
        return res.status(500).json({
          error: 'Search failed',
          message: 'Unable to build sample data without ingredients'
        });
      }
      const sampleResult = buildSampleSearchResults(ingredientList, minProtein, maxTime);
      if (cacheKey) {
        setCache(cacheKey, sampleResult);
      }
      return res.json(sampleResult);
    };

    if (forceSampleData) {
      console.log('Recipe search: forcing offline dataset due to USE_SAMPLE_RECIPES flag');
      return respondWithSampleResults();
    }

    if (!apiKeyConfigured && allowSampleFallback) {
      console.warn('Recipe search: no API key configured, serving offline dataset');
      return respondWithSampleResults();
    }

    const apiKey = getApiKey();

    // First, search by ingredients
    // Using findByIngredients endpoint for ingredient-based search
    const searchUrl = buildSpoonacularUrl('/recipes/findByIngredients');
    
    const searchResponse = await axios.get(searchUrl, {
      params: {
        apiKey,
        ingredients: ingredientList,
        number: 20, // Get more results to filter
        ranking: 1, // Maximize used ingredients
        ignorePantry: false
      }
    });

    if (!searchResponse.data || searchResponse.data.length === 0) {
      const emptyResult = { recipes: [], total: 0 };
      setCache(cacheKey, emptyResult);
      return res.json(emptyResult);
    }

    // Get IDs for bulk nutrition/info request
    const recipeIds = searchResponse.data.map(r => r.id).join(',');
    
    // Get detailed info with nutrition for all recipes
    const bulkUrl = buildSpoonacularUrl('/recipes/informationBulk');
    
    const bulkResponse = await axios.get(bulkUrl, {
      params: {
        apiKey,
        ids: recipeIds,
        includeNutrition: true
      }
    });

    // Merge data and apply filters
    const recipes = searchResponse.data
      .map(searchResult => {
        const detailInfo = bulkResponse.data.find(d => d.id === searchResult.id) || {};
        
        const proteinGrams = extractProtein(detailInfo.nutrition);
        const calories = extractCalories(detailInfo.nutrition);
        const readyInMinutes = detailInfo.readyInMinutes || 0;
        
        return {
          id: searchResult.id,
          title: searchResult.title,
          image: searchResult.image,
          usedIngredientCount: searchResult.usedIngredientCount || 0,
          missedIngredientCount: searchResult.missedIngredientCount || 0,
          usedIngredients: searchResult.usedIngredients || [],
          missedIngredients: searchResult.missedIngredients || [],
          readyInMinutes,
          proteinGrams,
          calories,
          summary: detailInfo.summary ? 
            detailInfo.summary.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : '',
          matchPercentage: Math.round(
            (searchResult.usedIngredientCount / 
            (searchResult.usedIngredientCount + searchResult.missedIngredientCount)) * 100
          ) || 0
        };
      })
      // Apply filters
      .filter(recipe => {
        if (minProtein > 0 && recipe.proteinGrams < minProtein) {
          return false;
        }
        if (maxTime < 999 && recipe.readyInMinutes > maxTime) {
          return false;
        }
        return true;
      });

    // Rank the filtered recipes
    const rankedRecipes = rankRecipes(recipes);

    const result = {
      recipes: rankedRecipes,
      total: rankedRecipes.length,
      filters: {
        ingredients: ingredientList,
        minProtein,
        maxTime
      }
    };

    // Cache the result
    setCache(cacheKey, result);

    res.json(result);

  } catch (error) {
    console.error('Recipe search error:', error.response?.data || error.message);

    const allowSampleFallback = process.env.USE_SAMPLE_RECIPES !== 'false';
    if (allowSampleFallback && respondWithSampleResults) {
      console.warn('Recipe search failed, falling back to offline dataset.');
      return respondWithSampleResults();
    }
    
    if (error.message === 'SPOONACULAR_API_KEY not configured') {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Recipe API is not configured. Please set SPOONACULAR_API_KEY.'
      });
    }
    
    if (error.response?.status === 402) {
      return res.status(503).json({
        error: 'API limit reached',
        message: 'Recipe search is temporarily unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      error: 'Search failed',
      message: 'An error occurred while searching for recipes'
    });
  }
};

/**
 * @desc    Get detailed recipe information
 * @route   GET /api/recipes/:id
 * @access  Public
 */
const getRecipeDetail = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Invalid recipe ID'
      });
    }

    // Check cache first
    const cacheKey = `recipe:${id}`;
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      console.log('Returning cached recipe detail');
      return res.json(cachedResult);
    }

    const apiKey = getApiKey();

    // Get detailed recipe info with nutrition
    const url = buildSpoonacularUrl(`/recipes/${id}/information`);
    
    const response = await axios.get(url, {
      params: {
        apiKey,
        includeNutrition: true
      }
    });

    const recipe = response.data;

    // Format the response
    const result = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes || 0,
      servings: recipe.servings || 1,
      sourceUrl: recipe.sourceUrl,
      summary: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '') : '',
      
      // Ingredients
      ingredients: (recipe.extendedIngredients || []).map(ing => ({
        id: ing.id,
        name: ing.name,
        original: ing.original,
        amount: ing.amount,
        unit: ing.unit,
        image: ing.image ? `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}` : null
      })),
      
      // Instructions
      instructions: recipe.instructions ? recipe.instructions.replace(/<[^>]*>/g, '') : '',
      analyzedInstructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => ({
        number: step.number,
        step: step.step
      })) || [],
      
      // Nutrition
      nutrition: {
        calories: extractCalories(recipe.nutrition),
        protein: extractProtein(recipe.nutrition),
        nutrients: (recipe.nutrition?.nutrients || [])
          .filter(n => ['Calories', 'Protein', 'Fat', 'Carbohydrates', 'Fiber', 'Sugar', 'Sodium'].includes(n.name))
          .map(n => ({
            name: n.name,
            amount: Math.round(n.amount),
            unit: n.unit,
            percentOfDailyNeeds: Math.round(n.percentOfDailyNeeds || 0)
          }))
      },
      
      // Additional info
      diets: recipe.diets || [],
      dishTypes: recipe.dishTypes || [],
      cuisines: recipe.cuisines || [],
      vegetarian: recipe.vegetarian || false,
      vegan: recipe.vegan || false,
      glutenFree: recipe.glutenFree || false,
      dairyFree: recipe.dairyFree || false
    };

    // Cache the result
    setCache(cacheKey, result);

    res.json(result);

  } catch (error) {
    console.error('Recipe detail error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Recipe not found'
      });
    }
    
    res.status(500).json({
      error: 'Failed to fetch recipe',
      message: 'An error occurred while fetching recipe details'
    });
  }
};

module.exports = {
  searchRecipes,
  getRecipeDetail
};

