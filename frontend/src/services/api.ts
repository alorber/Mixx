// Functions to link frontend & backend

const BACKEND_URL = "http://localhost:5000";

// ERROR CODES
// ------------

export const ERROR_CODES = {
    460: 'Email Taken',
    461: 'Email Not Found',
    462: 'Incorrect Password'
}

// Types
// ------

export type Failure = {
    errorCode: number,
    status: "Failure"
}

export type LoginResponse = {
    firstName: string;
    lastName: string;
    status: "Success";
} | Failure

export type StatusResponse = {
    status: "Success";
} | Failure

export type UserInfo = {
    userID: string;
    firstName: string;
    lastName: string;
}

export type Ingredient = {
    _id: string;
    name: string;
    category: string;
    subcategory: string;
}

export type Cocktail = {
    _id: string;
    directions: string;
    garnish: string;
    glass: string;
    img: string;
    subtitle: string | null;
    name: string;
    ingredients: [Ingredient];
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

// Signup
export async function signup(email: string, password: string, firstName: string, lastName: string): Promise<LoginResponse> {
    const resp = await fetch(`${BACKEND_URL}/signup`, {
        method: 'POST',
        mode: 'cors',
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
export async function getCurrentUserIngredients(): Promise<{'Ingredients': [Ingredient]} | Failure> {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/ingredients`, {
        method: 'GET'
    });

    if(resp.ok) {
        const resp_data: {'Ingredients': [Ingredient]} = await resp.json();
        return {'Ingredients': resp_data.Ingredients}
    } else {
        return {errorCode: resp.status, status: "Failure"};
    }
}

// Add Ingredients
export async function addUserIngredients(newIngredients: [Ingredient]) {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/ingredients/add`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({newIngredients: newIngredients})
    });
}

// Remove Ingredients
export async function removeUserIngredients(removedIngredients: [Ingredient]) {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/ingredients/remove`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({removedIngredients: removedIngredients})
    });
}

// Get Possible Cocktails
export async function getPossibleCocktails() {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails`, {
        method: 'GET'
    });
}

// Get All Cocktails' Display Info
export async function getAllCocktailsInfo() {
    const resp = await fetch(`${BACKEND_URL}/cocktails`, {
        method: 'GET'
    });
}

// Get Cocktail's Info
export async function getCocktailInfo(cocktailID: string) {
    const resp = await fetch(`${BACKEND_URL}/cocktails/${cocktailID}`, {
        method: 'GET'
    });
}

// Get Cocktails Containing Ingredient
export async function getCocktailContaining(ingredientID: string) {
    const resp = await fetch(`${BACKEND_URL}/cocktails/containing/${ingredientID}`, {
        method: 'GET'
    });
}

// Get Categorized Ingredients
export async function getCategorizedIngredients() {
    const resp = await fetch(`${BACKEND_URL}/ingredients/categorized`, {
        method: 'GET'
    });
}

// Like Cocktail
export async function likeCocktail(cocktailID: string) {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/like`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/jaon'},
        body: JSON.stringify({cocktailID: cocktailID})
    });
}

// Dislike Cocktail
export async function dislikeCocktail(cocktailID: string) {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/dislike`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/jaon'},
        body: JSON.stringify({cocktailID: cocktailID})
    });
}

// Get Liked Cocktails
export async function getLikedCocktails() {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/likes`, {
        method: 'GET'
    });
}

// Get Disliked Cocktails
export async function getDislikedCocktails() {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/dislikes`, {
        method: 'GET'
    });
}

// Favorite Cocktail
export async function favoriteCocktail(cocktailID: string) {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/favorite`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/jaon'},
        body: JSON.stringify({cocktailID: cocktailID})
    });
}

// Unfavorite Cocktail
export async function unfavoriteCocktail(cocktailID: string) {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/unfavorite`, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/jaon'},
        body: JSON.stringify({cocktailID: cocktailID})
    });
}

// Get Favorited Cocktails
export async function getFavoritedCocktails() {
    const resp = await fetch(`${BACKEND_URL}/user/${getUserID()}/cocktails/favorites`, {
        method: 'GET'
    });
}