import { CATEGORIES_LIST, CategorizedIngredients, getAllIngredients, getCategorizedIngredients, getCurrentUserIngredients, getIngredientsInfo, Ingredient, updateUserIngredients } from '../services/api';

// Helper Functions for Ingredients

////////////////////////////////////////////////////////////
//      Loading Ingredients
///////////////////////////////////////////////////////////

// Load All Ingredients
export const getIngredients = async (
    setErrorCode: (e: number | null) => void,
    onSuccess: (ingredients: Ingredient[]) => void
) => {
    const resp = await getAllIngredients();
    if(resp.status === "Success") {
        setErrorCode(null);
        onSuccess(resp.ingredients);
    } else {
        setErrorCode(resp.errorCode);
    }
}

// Load All Ingredient Categorized
export const getIngredientsCategorized = async (
    setErrorCode: (e: number | null) => void,
    onSuccess: (ingredients: CategorizedIngredients) => void
) => {
    const resp = await getCategorizedIngredients()
    if(resp.status === "Success") {
        setErrorCode(null);
        onSuccess(resp.ingredients);
    }
    // Error
    else {
        setErrorCode(resp.errorCode);
    }
}

// Build Ingredients Dict: ID -> Ingredient
export const buildIngredientDict = async (
    setErrorCode: (e: number | null) => void,
    setIngredientsDict: (d: {[key: string]: Ingredient}) => void
) => {
    await getIngredients(setErrorCode, (ingredients: Ingredient[]) => {
        // Build dict
        const idToIngredient: {[key: string]: Ingredient} = {};
        for(const ingredient of ingredients) {
            idToIngredient[ingredient._id] = ingredient;
        }
        setIngredientsDict(idToIngredient);
    });
}

// Build Ingredients Dict for Selected Ingredients: ID -> Ingredient
export const buildSelectedIngredientDict = async (
    ingredientIDs: string[]
) => {
    const ingredientsResp = await getIngredientsInfo(ingredientIDs);
    if(ingredientsResp.status === 'Success') {
        const ingredientsMap = ingredientsResp.ingredients.reduce(
            (dict: {[key: string]: Ingredient}, ingredient: Ingredient) => {
                dict[ingredient._id] = ingredient;
                return dict;
            }, {}
        )
        return ingredientsMap;
    } else {
        return null;
    }
}

////////////////////////////////////////////////////////////
//      User Ingredients List
///////////////////////////////////////////////////////////

// Get User's Ingredients
export const getUserIngredients = async (
    setErrorCode: (e: number | null) => void,
    onSuccess: (ingredients: string[]) => void,
    checkLoggedIn: () => void
) => {
    const resp = await getCurrentUserIngredients()
    if(resp.status === "Success") {
            onSuccess(resp.ingredientIDs);
            setErrorCode(null);
        }
        // Error
        else {
            setErrorCode(resp.errorCode);
            checkLoggedIn();
        }
}

// Restructures user ingredients to be compatible with list component
export const restructureUserList = (
    userIngredientIDs: string[] | null,
    ingredientsList: CategorizedIngredients | null
) => {
    if(userIngredientIDs == null) {
        return null;
    }
    if(userIngredientIDs.length === 0) {
        return {};
    }

    // Adds categories in order
    const userIngredientsList = CATEGORIES_LIST.reduce(
        (ingredients:CategorizedIngredients, category:string) => {ingredients[category] = {}; return ingredients;}, {}
    );
    
    // Adds owned ingredients
    for(const category in ingredientsList) {
        for(const subcategory in ingredientsList[category]) {
            for(const ingredient of ingredientsList[category][subcategory]) {
                if(ingredient.owned) {
                    if(!userIngredientsList[category].hasOwnProperty(subcategory)) {
                        userIngredientsList[category][subcategory] = [ingredient];
                    } else {
                        userIngredientsList[category][subcategory].push(ingredient);
                    }
                }
            }
        }
    }

    // Removes empty categories
    for(const category in userIngredientsList) {
        if(Object.keys(userIngredientsList[category]).length === 0) {
            delete userIngredientsList[category];
        }
    }

    return userIngredientsList;
}
// Add Ingredient to User's List
export const addIngredient = (
    ingredientID: string,
    removedIngredientIDs: string[],
    setRemovedIngredientIDs: (r: string[]) => void,
    addedIngredientIDs: string[],
    setAddedIngredientIDs: (a: string[]) => void,
    userIngredientIDs: string[] | null,
    setUserIngredientIDs: (u: string[]) => void,
) => {
    // Check if in removed list
    if(removedIngredientIDs.includes(ingredientID)) {
        setRemovedIngredientIDs(removedIngredientIDs.filter(id => id !== ingredientID));
    } else {
        // Add to added list
        setAddedIngredientIDs([...addedIngredientIDs, ingredientID]);
    }

    if(userIngredientIDs != null) {
        setUserIngredientIDs([...userIngredientIDs, ingredientID]);
    }
}

// Remove Ingredient from User's List
export const removeIngredient = (
    ingredientID: string,
    removedIngredientIDs: string[],
    setRemovedIngredientIDs: (r: string[]) => void,
    addedIngredientIDs: string[],
    setAddedIngredientIDs: (a: string[]) => void,
    userIngredientIDs: string[] | null,
    setUserIngredientIDs: (u: string[]) => void,
) => {
    // Check if in added list
    if(addedIngredientIDs.includes(ingredientID)) {
        setAddedIngredientIDs(addedIngredientIDs.filter(id => id !== ingredientID));
    } else {
        // Add to removed list
        setRemovedIngredientIDs([...removedIngredientIDs, ingredientID]);
    }

    if(userIngredientIDs != null) {
        setUserIngredientIDs(userIngredientIDs.filter((id: string) => id !== ingredientID));
    }
}

// Save ingredient list changes
export const saveIngredients = async (
    checkLoggedIn: () => void,
    removedIngredientIDs: string[],
    setRemovedIngredientIDs: (r: string[]) => void,
    addedIngredientIDs: string[],
    setAddedIngredientIDs: (a: string[]) => void,
    setUserIngredientIDs: (u: string[]) => void,
    setIsSaving: (b: boolean) => void,
    setIsLoading: (b: boolean) => void,
    setError: (e: number | null) => void
) => {
    checkLoggedIn();

    if(addedIngredientIDs.length === 0 && removedIngredientIDs.length === 0) {
        return;
    }

    setIsSaving(true);
    setIsLoading(true);
    const resp = await updateUserIngredients(addedIngredientIDs, removedIngredientIDs);
    if(resp.status === 'Success') {
        setAddedIngredientIDs([]);
        setRemovedIngredientIDs([]);
        setUserIngredientIDs(resp.ingredientIDs);
        setError(null);
    } else {
        setError(resp.errorCode);
        checkLoggedIn();
    }
    setIsSaving(false);
}

////////////////////////////////////////////////////////////
//      Searching Ingredients
///////////////////////////////////////////////////////////

// Search Ingredients List
export const buildIngredientsSearchResults = (
    ingredientsList: CategorizedIngredients | null,
    searchString: string,
    
): CategorizedIngredients | null => {
    if(ingredientsList === null) {
        return null
    }

    const searchTerm = searchString.trim().toLowerCase();
    const results: CategorizedIngredients = JSON.parse(JSON.stringify(ingredientsList));

    // If no search, show all
    if(searchTerm === '') {
        return results;
    }

    for(const category in results) {
        for(const subcategory in results[category]) {
            // List of passing ingredients in subcategory
            const passingIngredients = [];

            // Add passing ingredients
            for(const ingredient of results[category][subcategory]) {
                if(ingredient.name.toLowerCase().includes(searchTerm)) {
                    passingIngredients.push(ingredient);
                }
            }

            // Remove empty subcategories
            if(passingIngredients.length === 0) {
                delete results[category][subcategory];
            } else {
                results[category][subcategory] = passingIngredients;
            }
        }

        // Removes empty categories
        if(Object.keys(results[category]).length === 0) {
            delete results[category];
        }
    }

    return results;
}

