/**
 * Offline recipe dataset used when Spoonacular API is unavailable.
 * Keep this light-weight and course-friendly (no copyrighted content).
 */

module.exports = [
  {
    id: 900001,
    title: 'One-Pan Lemon Garlic Chicken & Veggies',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=60',
    readyInMinutes: 30,
    proteinGrams: 42,
    calories: 480,
    summary: 'Juicy seared chicken breasts tossed with garlicky roasted vegetables and a bright lemon butter sauce.',
    cuisines: ['American'],
    diets: ['gluten free'],
    ingredients: [
      { name: 'chicken breast', original: '2 boneless skinless chicken breasts', amount: 2, unit: 'breasts' },
      { name: 'broccoli florets', original: '2 cups broccoli florets', amount: 2, unit: 'cups' },
      { name: 'red bell pepper', original: '1 red bell pepper, sliced', amount: 1, unit: 'pepper' },
      { name: 'olive oil', original: '2 tbsp olive oil', amount: 2, unit: 'tbsp' },
      { name: 'garlic', original: '3 cloves garlic, minced', amount: 3, unit: 'cloves' },
      { name: 'lemon', original: 'Juice and zest of 1 lemon', amount: 1, unit: 'lemon' },
      { name: 'thyme', original: '1 tsp dried thyme', amount: 1, unit: 'tsp' }
    ]
  },
  {
    id: 900002,
    title: 'Chickpea & Spinach Coconut Curry',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60',
    readyInMinutes: 35,
    proteinGrams: 21,
    calories: 410,
    summary: 'Creamy weeknight curry loaded with plant-based protein, warm spices, and silky coconut milk.',
    cuisines: ['Indian'],
    diets: ['vegan', 'gluten free'],
    ingredients: [
      { name: 'chickpeas', original: '1 can chickpeas, drained', amount: 1, unit: 'can' },
      { name: 'spinach', original: '3 cups fresh spinach', amount: 3, unit: 'cups' },
      { name: 'coconut milk', original: '1 can light coconut milk', amount: 1, unit: 'can' },
      { name: 'tomatoes', original: '1 cup crushed tomatoes', amount: 1, unit: 'cup' },
      { name: 'yellow onion', original: '1 yellow onion, diced', amount: 1, unit: 'onion' },
      { name: 'garlic', original: '3 cloves garlic, minced', amount: 3, unit: 'cloves' },
      { name: 'curry powder', original: '1 tbsp curry powder', amount: 1, unit: 'tbsp' },
      { name: 'ginger', original: '1 tbsp minced ginger', amount: 1, unit: 'tbsp' }
    ]
  },
  {
    id: 900003,
    title: 'Teriyaki Salmon Rice Bowls',
    image: 'https://images.unsplash.com/photo-1476127396013-7ad5222c15b4?auto=format&fit=crop&w=800&q=60',
    readyInMinutes: 25,
    proteinGrams: 34,
    calories: 520,
    summary: 'Flaky roasted salmon glazed with homemade teriyaki sauce served over fluffy rice and crisp veggies.',
    cuisines: ['Asian'],
    diets: ['dairy free'],
    ingredients: [
      { name: 'salmon fillets', original: '2 salmon fillets', amount: 2, unit: 'fillets' },
      { name: 'rice', original: '2 cups cooked jasmine rice', amount: 2, unit: 'cups' },
      { name: 'soy sauce', original: '3 tbsp low-sodium soy sauce', amount: 3, unit: 'tbsp' },
      { name: 'honey', original: '1 tbsp honey', amount: 1, unit: 'tbsp' },
      { name: 'ginger', original: '1 tsp grated ginger', amount: 1, unit: 'tsp' },
      { name: 'broccoli florets', original: '1 1/2 cups broccoli florets', amount: 1.5, unit: 'cups' },
      { name: 'sesame oil', original: '1 tsp toasted sesame oil', amount: 1, unit: 'tsp' },
      { name: 'green onion', original: '2 green onions, sliced', amount: 2, unit: 'stalks' }
    ]
  },
  {
    id: 900004,
    title: 'Veggie-Packed Egg Fried Rice',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60',
    readyInMinutes: 20,
    proteinGrams: 18,
    calories: 380,
    summary: 'Better-than-takeout fried rice loaded with fluffy eggs, crisp veggies, and umami soy sesame sauce.',
    cuisines: ['Asian'],
    diets: [],
    ingredients: [
      { name: 'cooked rice', original: '3 cups cold cooked rice', amount: 3, unit: 'cups' },
      { name: 'eggs', original: '3 large eggs, beaten', amount: 3, unit: 'eggs' },
      { name: 'peas', original: '1 cup frozen peas', amount: 1, unit: 'cup' },
      { name: 'carrots', original: '1 cup diced carrots', amount: 1, unit: 'cup' },
      { name: 'green onion', original: '2 green onions, sliced', amount: 2, unit: 'stalks' },
      { name: 'soy sauce', original: '2 tbsp low-sodium soy sauce', amount: 2, unit: 'tbsp' },
      { name: 'sesame oil', original: '1 tsp sesame oil', amount: 1, unit: 'tsp' },
      { name: 'garlic', original: '2 cloves garlic, minced', amount: 2, unit: 'cloves' }
    ]
  },
  {
    id: 900005,
    title: 'Creamy Tomato Basil Pasta',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=60',
    readyInMinutes: 25,
    proteinGrams: 20,
    calories: 540,
    summary: 'Comforting pasta tossed in a silky tomato cream sauce with spinach and plenty of Parmesan.',
    cuisines: ['Italian'],
    diets: ['vegetarian'],
    ingredients: [
      { name: 'pasta', original: '12 oz penne pasta', amount: 12, unit: 'oz' },
      { name: 'tomatoes', original: '1 can crushed tomatoes', amount: 1, unit: 'can' },
      { name: 'spinach', original: '2 cups baby spinach', amount: 2, unit: 'cups' },
      { name: 'garlic', original: '3 cloves garlic, minced', amount: 3, unit: 'cloves' },
      { name: 'heavy cream', original: '1/2 cup light cream', amount: 0.5, unit: 'cup' },
      { name: 'parmesan', original: '1/2 cup grated Parmesan', amount: 0.5, unit: 'cup' },
      { name: 'olive oil', original: '2 tbsp olive oil', amount: 2, unit: 'tbsp' },
      { name: 'basil', original: '1/4 cup chopped basil', amount: 0.25, unit: 'cup' }
    ]
  },
  {
    id: 900006,
    title: 'Smoky Black Bean Sweet Potato Tacos',
    image: 'https://images.unsplash.com/photo-1608039829574-89c4782b8b7e?auto=format&fit=crop&w=800&q=60',
    readyInMinutes: 35,
    proteinGrams: 17,
    calories: 360,
    summary: 'Sheet-pan roasted sweet potatoes, smoky black beans, and crunchy slaw tucked into warm tortillas.',
    cuisines: ['Mexican'],
    diets: ['vegan'],
    ingredients: [
      { name: 'sweet potato', original: '2 cups diced sweet potato', amount: 2, unit: 'cups' },
      { name: 'black beans', original: '1 can black beans, drained', amount: 1, unit: 'can' },
      { name: 'tortillas', original: '8 small corn tortillas', amount: 8, unit: 'tortillas' },
      { name: 'red cabbage', original: '1 cup shredded red cabbage', amount: 1, unit: 'cup' },
      { name: 'lime', original: 'Juice of 1 lime', amount: 1, unit: 'lime' },
      { name: 'chipotle powder', original: '1 tsp chipotle chili powder', amount: 1, unit: 'tsp' },
      { name: 'avocado', original: '1 avocado, sliced', amount: 1, unit: 'avocado' },
      { name: 'cilantro', original: '1/4 cup chopped cilantro', amount: 0.25, unit: 'cup' }
    ]
  }
];
