// Functions to link frontend & backend

const BACKEND_URL = "http://localhost:5000";

// ERROR CODES
// ------------

export const ERROR_CODES = {
    460: 'Email Taken',
    461: 'Email Not Found',
    462: 'Incorrect Password'
};

// Types
// ------

export type Failure = {
    errorCode: number,
    status: "Failure"
};

export type LoginResponse = {
    firstName: string;
    lastName: string;
    status: "Success";
} | Failure;

export type StatusResponse = {
    status: "Success";
} | Failure;

export type UserInfo = {
    userID: string;
    firstName: string;
    lastName: string;
};

export type Ingredient = {
    _id: string;
    name: string;
    category: string;
    subcategory: string;
};

export type CATEGORIES = 'Spirits' | 'Liqueurs' | 'Wines and Champagnes' | 'Beers and Ciders' | 'Mixers' | 'Other';
export const CATEGORIES_LIST = ['Spirits', 'Liqueurs', 'Wines and Champagnes', 'Beers and Ciders', 'Mixers', 'Other'];
export type CategorizedIngredients = {
   [key in string]: {
       [key: string]: [{
           name: string,
           id: string,
           owned?: boolean
       }]
   }
};

export type Cocktail = {
    _id: string;
    directions: string;
    garnish: string;
    glass: string;
    img: string;
    subtitle: string | null;
    name: string;
    ingredients: Ingredient[];
}

// Functions
// ----------

// Store User ID
export function setUserID(userID: string): void {
    localStorage.setItem('user_id', userID);
}

// Get User ID
export function getUserID(): string {
    return localStorage.getItem("user_id") || "";
}

// Checks if user is logged in
export function isLoggedIn(): boolean {
    return getUserID() !== '';
}

// Signup
export async function signup(email: string, password: string, firstName: string, lastName: string): Promise<LoginResponse> {
    const resp = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email, password: password, firstName: firstName, lastName: lastName})
    });

    if(resp.ok) {
        const resp_data: {userID: string} = await resp.json();
        setUserID(resp_data.userID)
        return {firstName: firstName, lastName: lastName, status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Login
export async function login(email: string, password: string): Promise<LoginResponse> {
    const resp = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email, password: password})
    });

    if(resp.ok) {
        const resp_data: UserInfo = await resp.json();
        setUserID(resp_data.userID);
        return {firstName: resp_data.firstName, lastName: resp_data.lastName, status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Logout
export async function logout(): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/logout`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userID: getUserID()})
    });

    if(resp.ok) {
        setUserID("");
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Delete Account
export async function deleteAccount(password: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/delete`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({password: password})
    });

    if(resp.ok) {
        setUserID("");
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Update Email
export async function updateEmail(newEmail: string, password: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/updateEmail`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({newEmail: newEmail, password: password})
    });

    if(resp.ok) {
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Update Password
export async function updatePassword(oldPassword: string, newPassword: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/updatePassword`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({oldPassword: oldPassword, newPassword: newPassword})
    });

    if(resp.ok) {
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get Current User Ingredients
export async function getCurrentUserIngredients(): Promise<{ingredientIDs: string[], status: "Success"} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/ingredients`, {
        method: 'GET',
        mode: 'cors',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {ingredientIDs: string[]} = await resp.json();
        return {ingredientIDs: resp_data.ingredientIDs, status: "Success"}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Update User Ingredients
export async function updateUserIngredients(newIngredients: string[], removedIngredients: string[]): Promise<{ingredientIDs: string[], status: 'Success'} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/ingredients/update`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({newIngredients: newIngredients, removedIngredients: removedIngredients})
    });

    if(resp.ok) {
        const resp_data: {ingredientIDs: string[]} = await resp.json();
        return {ingredientIDs: resp_data.ingredientIDs, status: "Success"}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get Possible Cocktails
export async function getPossibleCocktails(): Promise<{cocktails: Cocktail[], status: "Success"} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails`, {
        method: 'GET',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {cocktails: [Cocktail]} = await resp.json();
        return {cocktails: resp_data.cocktails, status: "Success"}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get All Cocktails
export async function getAllCocktails(): Promise<{cocktails: Cocktail[], status: "Success"} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/cocktails`, {
        method: 'GET',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {cocktails: [Cocktail]} = await resp.json();
        return {cocktails: resp_data.cocktails, status: "Success"}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get Cocktail's Info
export async function getCocktailInfo(cocktailID: string): Promise<{cocktail: Cocktail, status: "Success"} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/cocktails/${cocktailID}`, {
        method: 'GET',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {cocktail: Cocktail} = await resp.json();
        return {cocktail: resp_data.cocktail, status: "Success"}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get Cocktails Containing Ingredient
export async function getCocktailContaining(ingredientID: string): Promise<{cocktails: [Cocktail], status: "Success"} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/cocktails/containing/${ingredientID}`, {
        method: 'GET',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {cocktails: [Cocktail]} = await resp.json();
        return {cocktails: resp_data.cocktails, status: "Success"}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get Categorized Ingredients
export async function getCategorizedIngredients(): Promise<{ingredients: CategorizedIngredients, status: 'Success'} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/ingredients/categorized`, {
        method: 'GET',
        mode: 'cors',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {ingredients: CategorizedIngredients} = await resp.json();
        return {ingredients: resp_data.ingredients, status: "Success"}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Like Cocktail
export async function likeCocktail(cocktailID: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/like`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cocktailID: cocktailID})
    });

    if(resp.ok) {
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Unlike Cocktail
export async function removeLikedCocktail(cocktailID: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/remove_like`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cocktailID: cocktailID})
    });

    if(resp.ok) {
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Dislike Cocktail
export async function dislikeCocktail(cocktailID: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/dislike`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cocktailID: cocktailID})
    });

    if(resp.ok) {
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Undislike Cocktail
export async function removeDislikedCocktail(cocktailID: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/remove_dislike`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cocktailID: cocktailID})
    });

    if(resp.ok) {
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get Liked Cocktails
export async function getLikedCocktails(): Promise<{cocktails: Cocktail[]} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/likes`, {
        method: 'GET',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {cocktails: [Cocktail]} = await resp.json();
        return {cocktails: resp_data.cocktails}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get Disliked Cocktails
export async function getDislikedCocktails(): Promise<{cocktails: Cocktail[]} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/dislikes`, {
        method: 'GET',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {cocktails: [Cocktail]} = await resp.json();
        return {cocktails: resp_data.cocktails}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Favorite Cocktail
export async function favoriteCocktail(cocktailID: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/favorite`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cocktailID: cocktailID})
    });

    if(resp.ok) {
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Unfavorite Cocktail
export async function unfavoriteCocktail(cocktailID: string): Promise<StatusResponse> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/unfavorite`, {
        method: 'POST',
        mode: 'cors',
        credentials: "include",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cocktailID: cocktailID})
    });

    if(resp.ok) {
        return {status: "Success"};
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Get Favorited Cocktails
export async function getFavoritedCocktails(): Promise<{cocktailIDs: string[], status: "Success"} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/favorites`, {
        method: 'GET',
        credentials: "include"
    });

    if(resp.ok) {
        const resp_data: {cocktails: [string]} = await resp.json();
        return {cocktailIDs: resp_data.cocktails, status: "Success"}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}