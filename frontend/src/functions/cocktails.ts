import { Cocktail, favoriteCocktail, getAllCocktails, getFavoritedCocktails, Glassware, Ingredient, unfavoriteCocktail } from "../services/api";

// Helper Functions for Cocktails

////////////////////////////////////////////////////////////
//      Loading Cocktails
///////////////////////////////////////////////////////////

// Get All Cocktails
export const getCocktails = async (
    setErrorCode: (e: number | null) => void,
    onSuccess: (cocktails: Cocktail[]) => void
) => {
    const resp = await getAllCocktails();
    if(resp.status === "Success") {
        setErrorCode(null);
        onSuccess(resp.cocktails);
    } else {
        setErrorCode(resp.errorCode);
    }
}

////////////////////////////////////////////////////////////
//      Favoriting Cocktails
///////////////////////////////////////////////////////////

// Get Saved Cocktails
export const getSavedCocktails = async (
    checkLoggedIn: (() => void),
    setFavoriteCocktailsList: (f: string[]) => void,
    setErrorCode: (e: number | null) => void,
) => {
    checkLoggedIn();
    const resp = await getFavoritedCocktails();
    if(resp.status == "Success") {
        setFavoriteCocktailsList(resp.cocktailIDs);
        setErrorCode(null);
        return resp.cocktailIDs;
    } else {
        setErrorCode(resp.errorCode);
        checkLoggedIn();
        return null;
    }
}

// Set Favorite Cocktail
export const setFavorite = async (
    checkLoggedIn: (() => void),
    favoriteCocktailsList: string[],
    setFavoriteCocktailsList: (f: string[]) => void,
    setErrorCode: (e: number | null) => void,
    cocktailID: string
): Promise<boolean> => {
    const resp = await favoriteCocktail(cocktailID);
    
    if(resp.status == "Success") {
        setFavoriteCocktailsList([...favoriteCocktailsList, cocktailID]);
        return true;
    } else {
        setErrorCode(resp.errorCode);
        checkLoggedIn();
        return false;
    }
}

// Unfavorite Cocktail
export const setUnfavorite = async (
    checkLoggedIn: (() => void),
    favoriteCocktailsList: string[],
    setFavoriteCocktailsList: (f: string[]) => void,
    setErrorCode: (e: number | null) => void,
    cocktailID: string
): Promise<boolean> => {
    const resp = await unfavoriteCocktail(cocktailID);
    
    if(resp.status === "Success") {
        setFavoriteCocktailsList(favoriteCocktailsList.filter(id => id !== cocktailID));
        return true;
    } else {
        setErrorCode(resp.errorCode);
        checkLoggedIn();
        return false;
    }
}

// Sort List Based on Favorites
export const sortCocktailsOnFavorites = (
    cocktails: Cocktail[] | null,
    favorites: string[] | null,
): Cocktail[] | null => {
    if(cocktails === null || favorites === null) {
        return null;
    }
    const sortedCocktails = [...cocktails]
    sortedCocktails.sort((c1, c2) => {
        const isC1Favorited = favorites.includes(c1._id);
        const isC2Favorited = favorites.includes(c2._id);

        // Both favorited or neither
        if((isC1Favorited && isC2Favorited) || (!isC1Favorited && !isC2Favorited)) {
            // Sort alphabetically
            return c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1;
        }
        return isC1Favorited ? -1 : 1;
    })
    return sortedCocktails;
}

// Favorite Button Click
export const toggleFavorite = async (
    checkLoggedIn: (() => void),
    favoriteCocktailsList: string[] | null,
    setFavoriteCocktailsList: (f: string[]) => void,
    cocktailsList: Cocktail[] | null,
    setCocktailsList: (c: Cocktail[] | null) => void,
    setErrorCode: (e: number | null) => void,
    cocktailID: string
) => {
    checkLoggedIn();

    if(favoriteCocktailsList === null) {
        return;
    }

    if(favoriteCocktailsList.includes(cocktailID)) {
        const success = await setUnfavorite(checkLoggedIn, favoriteCocktailsList, setFavoriteCocktailsList,
                setErrorCode, cocktailID);
        if(success) {
            setCocktailsList(sortCocktailsOnFavorites(cocktailsList, favoriteCocktailsList.filter(id => id !== cocktailID)));
        }
    } else {
        const success = await setFavorite(checkLoggedIn, favoriteCocktailsList, setFavoriteCocktailsList,
                setErrorCode, cocktailID);
        if(success) {
            setCocktailsList(sortCocktailsOnFavorites(cocktailsList, [...favoriteCocktailsList, cocktailID]));
        }
    }
}

////////////////////////////////////////////////////////////
//      Searching Cocktails
///////////////////////////////////////////////////////////

export type SearchType = "CocktailName" | "Ingredient" | "Glassware";
export const buildCocktailsSearchResults = (
    cocktailsList: Cocktail[] | null,
    ingredientsDict: {[key: string]: Ingredient} | null,
    glasswareDict: {[key: string]: Glassware} | null,
    favoriteCocktailsList: string[] | null,
    searchString: string,
    searchTypes: SearchType[]
): Cocktail[] | null => {
    if(cocktailsList === null || ingredientsDict === null || glasswareDict === null) {
        return null;
    }

    const searchTerm = searchString.trim().toLowerCase();

    // If no search, show all
    if(searchTerm === '') {
        return sortCocktailsOnFavorites(cocktailsList, favoriteCocktailsList ?? []);
    }
    
    const results: Cocktail[] = [];

    for(const cocktail of cocktailsList) {
        let added = false;

        // Filter by cocktail name
        if(searchTypes.includes("CocktailName")) {
            if(cocktail.name.toLowerCase().includes(searchTerm)) {
                results.push(cocktail);
                added = true;
            }
        }

        // Filter by ingredient
        if(searchTypes.includes("Ingredient") && !added) {
            for(const ingredient of cocktail.ingredients) {
                if(ingredientsDict[ingredient.ingredient].name.toLowerCase().includes(searchTerm)) {
                    results.push(cocktail);
                    added = true;
                    break;
                }
            }
        }

        // Filter by glassware
        if(searchTypes.includes("Glassware") && !added) {
            if(glasswareDict[cocktail.glass].name.toLowerCase().includes(searchTerm)) {
                results.push(cocktail);
            }
        }
    }

    return sortCocktailsOnFavorites(results, favoriteCocktailsList ?? []);
}