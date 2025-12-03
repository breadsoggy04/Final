# Design Decisions and Heuristic Evaluation

## CS 409 Web Programming - UIUC Final Project
### ReciPeasy: Smart Recipe Finder

---

## 1. Target Users & Problem

### Primary User Profile
**College Students** who:
- Have limited cooking experience
- Possess random/leftover ingredients
- Face time constraints between classes
- Want to eat healthier without excessive spending
- Often jump between multiple recipe websites

### Core Problems Addressed

| User Problem | Impact | Our Solution |
|-------------|--------|--------------|
| Random ingredients in fridge/pantry | Food waste, frustration | Ingredient-first search that shows what you can make |
| Unknown what to cook | Decision paralysis | Smart ranking by ingredient match |
| Health/nutrition goals | Hard to track protein intake | Visible protein filtering and display |
| Limited time | Skip meals or eat unhealthy | Time-based filtering |
| Recipe site-hopping | Wasted time, cognitive overload | Unified dashboard with all filters |

---

## 2. Initial Design Decisions

### 2.1 Centralized Search Dashboard

**Decision**: Single-page dashboard with search, filters, and results.

**Rationale**: 
- Reduces cognitive load by keeping all functionality visible
- Follows Fitts's Law - related controls are close together
- Matches mental model of a "search engine" that students are familiar with

**Implementation**:
- Large, prominent search bar at top (primary action)
- Filter sidebar always visible (desktop)
- Results grid immediately below

### 2.2 Card-Based Recipe Layout

**Decision**: Use cards with image, title, and key metrics.

**Rationale**:
- Cards are scannable - users can quickly compare options
- Visual hierarchy: image → title → stats
- Consistent pattern from lecture materials (card-based UI)
- Touch-friendly for mobile devices

**Key Card Elements**:
1. Recipe image (visual recognition)
2. Match percentage badge (primary differentiator)
3. Title (identification)
4. Time, protein, calories (decision factors)
5. Favorite button (quick action)

### 2.3 Ranking Algorithm (Ingredient Match → Protein → Time)

**Decision**: Multi-factor ranking with ingredient match as primary.

**Rationale**:
- Directly addresses "what can I make?" question
- Protein secondary because health-conscious users prioritize it
- Time tertiary as a tiebreaker

### 2.4 Progressive Disclosure

**Decision**: Show summary on cards, full details on recipe page.

**Rationale**:
- Prevents information overload during browsing
- Full nutrition/instructions available when user commits
- Supports different stages of decision-making

---

## 3. Heuristic Evaluation (Nielsen's 10 Heuristics)

We performed a heuristic evaluation of the initial design mockups, identifying issues and implementing revisions.

### 3.1 Visibility of System Status

#### Issue Identified
In the first version, when users clicked "Find Recipes," there was no loading indicator. Users couldn't tell if the search was processing or if the system had frozen.

#### User Struggle
Test users clicked the search button multiple times, thinking it hadn't registered their input.

#### Revision
- Added loading spinner inside the search button
- Button text changes to "Searching..."
- Added skeleton loading cards in the results area
- Results header shows "Found X recipes" count

**Why This Improves UX**: Users now have continuous feedback about system state, reducing anxiety and preventing duplicate submissions.

### 3.2 Match Between System and Real World

#### Issue Identified
Originally, we showed "usedIngredientCount: 4" and "missedIngredientCount: 2" in raw API format.

#### User Struggle
Users didn't understand what "missed" meant in the context of cooking.

#### Revision
- Changed to "✓ Have 4" and "+ Need 2" with clear icons
- Added percentage badge "67% match" 
- Color coding: green for have, muted for need

**Why This Improves UX**: Language now matches how users think about ingredients ("what do I have?" vs "what do I need to buy?").

### 3.3 User Control and Freedom

#### Issue Identified
No way to clear the search or reset filters quickly. Users felt "stuck" after searching.

#### User Struggle
After an unsuccessful search, users had to manually delete text and reset each filter slider.

#### Revision
- Added "✕" clear button inside search input
- Added "Reset" button in filter section
- Quick-add suggestion chips for common ingredients
- Easy navigation back from recipe detail page

**Why This Improves UX**: Users can easily recover from mistakes or change direction without tedious manual clearing.

### 3.4 Consistency and Standards

#### Issue Identified
Favorite heart icon was a different style on cards vs. recipe detail page. Button styles varied across pages.

#### User Struggle
Users weren't sure if the actions were the same functionality.

#### Revision
- Unified heart emoji (❤️/🤍) across all contexts
- Created consistent button component classes (btn-primary, btn-secondary, btn-ghost)
- Same color palette and spacing throughout
- Consistent card hover effects

**Why This Improves UX**: Predictable interface reduces learning curve and builds confidence.

### 3.5 Error Prevention

#### Issue Identified
Users could submit empty searches, leading to confusing "no results" state.

#### User Struggle
Unclear why no recipes showed up with empty input.

#### Revision
- Search button disabled until valid input
- Placeholder text shows expected format ("chicken, rice, spinach...")
- Input validation with helpful error messages
- Filter sliders have reasonable min/max bounds

**Why This Improves UX**: Prevents users from making errors rather than just reporting them after the fact.

### 3.6 Recognition Rather Than Recall

#### Issue Identified
After viewing a recipe detail, users had to remember what they searched for.

#### User Struggle
Users forgot their original ingredients when returning from detail view.

#### Revision
- Search query persists when navigating back
- "Back to recipes" link returns to previous results
- Favorites page shows saved recipes without re-searching

**Why This Improves UX**: Reduces memory burden; the interface shows context.

### 3.7 Flexibility and Efficiency of Use

#### Issue Identified
Power users had no shortcuts; everyone followed the same path.

#### User Struggle
Experienced users wanted faster ways to search.

#### Revision
- Quick-add ingredient chips for common items
- Enter key submits search
- Saved preferences for protein/time defaults (logged-in users)
- Direct URLs to recipes enable bookmarking

**Why This Improves UX**: Accelerators for experienced users without confusing novices.

### 3.8 Aesthetic and Minimalist Design

#### Issue Identified
Initial design had too much text explanation around the search.

#### User Struggle
Users felt overwhelmed and didn't know where to focus.

#### Revision
- Reduced explanatory text
- Moved ranking explanation to collapsible sidebar
- Used icons + short labels instead of sentences
- White space to separate functional areas

**Why This Improves UX**: Every extra element competes for attention; minimalism highlights what matters.

### 3.9 Help Users Recognize, Diagnose, and Recover from Errors

#### Issue Identified
API errors showed generic "Something went wrong" with no guidance.

#### User Struggle
Users didn't know what to do next.

#### Revision
- Specific error messages ("Recipe not found", "API limit reached")
- Suggested actions ("Try different ingredients", "Try again later")
- Retry buttons where applicable
- Graceful degradation (show cached results if available)

**Why This Improves UX**: Actionable error messages turn frustration into a clear path forward.

### 3.10 Help and Documentation

#### Issue Identified
No guidance for first-time users on how the ranking works.

#### User Struggle
Users didn't understand why recipes appeared in a certain order.

#### Revision
- Added "How we rank recipes" explanation in sidebar
- Tooltip on match percentage badge
- Welcome state for first-time users explains the flow
- Search tip ("Separate ingredients with commas")

**Why This Improves UX**: Contextual help at point of need, not buried in FAQs.

---

## 4. Connection to Course Materials

### Referenced Patterns from CS 409 Lectures

| Concept | Application in ReciPeasy |
|---------|-------------------------|
| **Responsive Design** | Mobile-first CSS, grid layouts that collapse |
| **Component Architecture** | Reusable RecipeCard, FilterControls components |
| **State Management** | React Context for auth, local state for UI |
| **REST API Design** | Standard HTTP methods, meaningful endpoints |
| **JWT Authentication** | Stateless auth with protected routes |
| **Error Handling** | Try-catch with user-friendly messages |
| **Loading States** | Spinners, skeleton screens for perceived performance |
| **Progressive Enhancement** | Core functionality works without JS features |

### UX Principles Applied

1. **Visibility**: System status always clear through loading states
2. **Feedback**: Immediate response to all user actions
3. **Constraints**: Prevent errors through disabled states and validation
4. **Mapping**: Natural correspondence between controls and outcomes
5. **Consistency**: Same patterns repeated throughout app
6. **Affordance**: Buttons look clickable, inputs look typeable

---

## 5. Summary of Key Revisions

| Area | Before | After | Heuristic |
|------|--------|-------|-----------|
| Search button | Static | Loading state with spinner | Visibility |
| Ingredient counts | API terminology | User-friendly "Have/Need" | Real World Match |
| Filter reset | None | Clear button | User Control |
| Error messages | Generic | Specific + actionable | Error Recovery |
| Empty search | Allowed | Prevented with disabled button | Error Prevention |
| Navigation | No breadcrumbs | Back links + persistent state | Recognition |
| Welcome screen | None | Explains features | Help & Documentation |

---

## 6. Future Improvements

Based on the evaluation, potential future enhancements include:

1. **Onboarding Tour**: Step-by-step guide for first-time users
2. **Recent Searches**: History of past ingredient combinations
3. **Ingredient Recognition**: Photo-based ingredient detection
4. **Meal Planning**: Save recipes to weekly calendar
5. **Shopping List**: Auto-generate list from "missing" ingredients

---

*Document created for CS 409 Web Programming - UIUC*
*satisfies: heuristic evaluation and design documentation requirement*

