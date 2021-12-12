import { CategorizedIngredients, getAllIngredients, getCategorizedIngredients, Ingredient } from '../services/api';

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