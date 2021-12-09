import IngredientsList from '../../ui/IngredientsList/IngredientsList';
import React from 'react';
import {
    CATEGORIES_LIST,
    CategorizedIngredients,
    getCategorizedIngredients,
    getCurrentUserIngredients,
    Ingredient
    } from '../../../services/api';
import { useEffect, useState } from 'react';
import {
    Box,
    Heading,
    Text,
    } from '@chakra-ui/react';

const MyIngredientsLayout = () => {
    const [isLoading, setIsloading] = useState(false);
    const [ingredientsList, setIngredientsList] = useState<CategorizedIngredients | null>(null);
    const [userIngredientsList, setUserIngredientsList] = useState<[Ingredient] | null>(null);
    const [categorizedUserIngredientsList, setCategorizedUserIngredientsList] = useState<CategorizedIngredients | null>(null);
    const [addedIngredients, setAddedIngredients] = useState<[Ingredient] | []>([]);
    const [removedIngredients, setRemovedIngredients] = useState<[Ingredient] | []>([]);
    const [allIngredientsErrorCode, setAllIngredientsErrorCode] = useState<number | null>(null);
    const [userIngredientsErrorCode, setUserIngredientsErrorCode] = useState<number | null>(null);

    // Marks user ingredients in master list
    const markUserIngredients = () => {
        if(ingredientsList === null || userIngredientsList === null) {
            return
        }

        const userIngredientsIDs = userIngredientsList.map(userIngredient => userIngredient['_id'])

        for(const category in ingredientsList) {
            for(const subcategory in ingredientsList[category]) {
                for(const ingredient of ingredientsList[category][subcategory]) {
                    ingredient['owned'] = userIngredientsIDs.includes(ingredient.id);
                }
            }
        }
    }

    // Restructures user ingredients to be compatible with list coponent
    const restructureUserList = () => {
        if(userIngredientsList === null) {
            return;
        }

        // Adds categories in order
        const restructuredUserList = CATEGORIES_LIST.reduce(
            (ingredients:CategorizedIngredients, category:string) => {ingredients[category] = {}; return ingredients;}, {}
        );
        
        // Adds restructured ingredients
        for(const ingredient of userIngredientsList) {
            const restructuredIngredient = {id: ingredient._id, name: ingredient.name, owned: true};
            if(!restructuredUserList[ingredient.category].hasOwnProperty(ingredient.subcategory)) {
                restructuredUserList[ingredient.category][ingredient.subcategory] = [restructuredIngredient];
            } else {
                restructuredUserList[ingredient.category][ingredient.subcategory].push(restructuredIngredient);
            }
        }

        // Removes empty categories
        for(const category in restructuredUserList) {
            if(Object.keys(restructuredUserList[category]).length === 0) {
                delete restructuredUserList[category];
            }
        }

        setCategorizedUserIngredientsList(restructuredUserList);
    }

    // Get List of Ingredients
    const getAllIngredients = async () => {
        setIsloading(true);
        const resp = await getCategorizedIngredients()
        if(resp.status === "Success") {
            setIngredientsList(resp.ingredients);
            setAllIngredientsErrorCode(null);
        }
        // Error
        else {
            setAllIngredientsErrorCode(resp.errorCode);
        }
    }

    // Get User's Ingredients
    const getUserIngredients = async () => {
        const resp = await getCurrentUserIngredients()
        if(resp.status === "Success") {
            setUserIngredientsList(resp.ingredients);
            setUserIngredientsErrorCode(null);
        }
        // Error
        else {
            setUserIngredientsErrorCode(resp.errorCode);
        }
    }

    // Load list on pageload
    useEffect(() => {
        setIsloading(true);
        getAllIngredients();
        getUserIngredients();
    }, []);

    // Check if received lists
    useEffect(() => {
        if(ingredientsList !== null && userIngredientsList !== null) {
            markUserIngredients();
            restructureUserList();
            setIsloading(false);
        }
    }, [ingredientsList, userIngredientsList])

    return isLoading ? (
        <Heading pt={10}>Loading...</Heading>
    ) : ingredientsList !== null && userIngredientsErrorCode === null && allIngredientsErrorCode === null ? (
        <Box pt={10} w='100%' h='100%' justifyContent='center'>
            <IngredientsList ingredientsList={ingredientsList} />
        </Box>
    ) : (
        <Text>Error</Text>
    );
}

export default MyIngredientsLayout;