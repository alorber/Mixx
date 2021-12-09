import React from 'react';
import StyledListItem from '../../ui/StyledListItem/StyledListItem';
import {
    CATEGORIES,
    CategorizedIngredients,
    getCategorizedIngredients,
    getCurrentUserIngredients,
    Ingredient
    } from '../../../services/api';
import {
    Collapse,
    Link,
    Stack,
    Text,
    useDisclosure
    } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

const MyIngredientsLayout = () => {
    const [isLoading, setIsloading] = useState(false);
    const [ingredientsList, setIngredientsList] = useState<CategorizedIngredients | null>(null);
    const [userIngredientsList, setUserIngredientsList] = useState<[Ingredient] | null>(null);
    const [allIngredientsErrorCode, setAllIngredientsErrorCode] = useState<number | null>(null)
    const [userIngredientsErrorCode, setUserIngredientsErrorCode] = useState<number | null>(null)


    // Get List of Ingredients
    const getAllIngredients = async () => {
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

    useEffect(() => {
        setIsloading(true);
        getAllIngredients()
        getUserIngredients()
        setIsloading(false);
    }, []);

    return isLoading ? (
        <Text>Loading...</Text>
    ) : ingredientsList !== null && userIngredientsList !== null && userIngredientsErrorCode === null && allIngredientsErrorCode === null ? (
        <Stack p={4}>
            {Object.keys(ingredientsList).map((category: string) => (
                <CategoryListItem key={category} categoryIngredientsList={ingredientsList[category]} 
                userIngredientsList={userIngredientsList} category={category} />
            ))}
        </Stack>
    ) : (
        <Text>Error</Text>
    );
}

// Category List Item
type CategoryListItemProps = {
    categoryIngredientsList: {[key: string]: [{name: string, id: string}]},
    userIngredientsList: [Ingredient],
    category: string,
    subcategory?: string | null
}

const CategoryListItem = ({categoryIngredientsList, userIngredientsList, category, subcategory = null}: CategoryListItemProps) => {
    const { isOpen, onToggle } = useDisclosure();
    
    return (<>
        <Stack spacing={4} onClick={onToggle}>
            <Link _focus={{outline: "none"}} _hover={{textDecoration: "none", color: "#2395ff"}} 
                    fontWeight={500}>
                <StyledListItem isItemDropdown={true} showDropdownIcon={true} isDropdownOpen={isOpen}>
                    {subcategory ?? category}
                </StyledListItem> 
            </Link>
        </Stack> 

        {/* Dropdown Menu */}
        <Collapse in={isOpen} animateOpacity>
            <Stack pl={4} borderLeft={"solid #cfcdcc .5px"} align='start'>
                {subcategory === null ? (
                    Object.keys(categoryIngredientsList).map((subcategory: string) => (
                        <CategoryListItem key={subcategory} categoryIngredientsList={categoryIngredientsList}
                        userIngredientsList={userIngredientsList} category={category} subcategory={subcategory} />
                    ))
                ) : (
                    categoryIngredientsList[subcategory].map((ingredient: {name: string, id: string}) => (
                        <IngredientsListItem ingredient={ingredient} key={ingredient.id}
                            userIngredientsList={userIngredientsList} category={category} subcategory={subcategory} />
                    ))
                )}
            </Stack>
        </Collapse>
    </>);
}

type IngredientsListItemProps = {
    ingredient: {name: string, id: string},
    userIngredientsList: [Ingredient],
    category: string,
    subcategory: string
}

const IngredientsListItem = (
    {ingredient, userIngredientsList, category, subcategory}: IngredientsListItemProps
) => {
    return (
        <Stack spacing={4}>
            <Link _focus={{outline: "none"}} role={'group'} display={'block'} p={2} rounded={'md'} w={'100%'}
                    _hover={{textDecoration: "none", bg: "#eaf6ff"}}>
                <StyledListItem>
                    {ingredient.name}
                </StyledListItem>
            </Link>
        </Stack>
    );
}

export default MyIngredientsLayout;