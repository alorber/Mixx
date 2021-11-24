// Functions to link frontend & backend

const BACKEND_URL = "http://localhost:5000";

// Types
// ------

export type loginResponse = {
    userID: string;
    status: "Success";
} | {
    error: string;
    status: "Failure"
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
    localStorage.setItem('user_id', userID)
}

// Get User ID
export function getUserID(): string {
    return localStorage.getItem("userID") || "";
}

// Signup
export async function signup(username: string, password: string) {
    
}

// Login
export async function login(username: string, password: string) {

}

// Logout
export async function logout() {

}

// Delete Account
export async function deleteAccount(password: string) {

}

// Update Email
export async function updateEmail(email: string, password: string) {

}

// Update Password
export async function updatePassword(oldPassword: string, newPassword: string) {

}

// Get Current User Ingredients
export async function getCurrentUserIngredients() {

}

// Add Ingredients
export async function addUserIngredients(newIngredients: [Ingredient]) {

}

// Remove Ingredients
export async function removeUserIngredients(removedIngredients: [Ingredient]) {

}

// Get Possible Cocktails
export async function getPossibleCocktails() {

}

// Get All Cocktails' Display Info
export async function getAllCocktailsInfo() {

}

// Get Cocktail's Info
export async function getCocktailInfo(cocktailID: string) {

}

// Get Cocktails Containing Ingredient
export async function getCocktailContaining(ingredientID: string) {

}

// Get Categorized Ingredients
export async function getCategorizedIngredients() {

}

// Like Cocktail
export async function likeCocktail(cocktailID: string) {

}

// Dislike Cocktail
export async function dislikeCocktail(cocktailID: string) {

}

// Favorite Cocktail
export async function favoriteCocktail(cocktailID: string) {

}

// Unfavorite Cocktail
export async function unfavoriteCocktail(cocktailID: string) {

}

// Get Favorited Cocktails
export async function getFavoritedCocktails() {

}