import { Cocktail, favoriteCocktail, getAllCocktails, getFavoritedCocktails, unfavoriteCocktail } from "../services/api";

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
    
    if(resp.status == "Success") {
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
    if(cocktails == null || favorites == null) {
        return null;
    }

    const sortedCocktails = [...cocktails]
    sortedCocktails.sort((c1, c2) => {
        const isC1Favorited = favorites?.includes(c1._id);
        const isC2Favorited = favorites?.includes(c2._id);

        // Both favorited or neither
        if((isC1Favorited && isC2Favorited) || (!isC1Favorited && !isC2Favorited)) {
            // Sort alphabetically
            return c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1;
        }
        return isC1Favorited ? -1 : 1;
    })
    return sortedCocktails;
}