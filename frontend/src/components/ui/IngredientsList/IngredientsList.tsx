import React from 'react';
import StyledListItem from '../../ui/StyledListItem/StyledListItem';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
    Collapse,
    Heading,
    Link,
    Stack,
    useDisclosure
    } from '@chakra-ui/react';
import {
    CategorizedIngredients, Ingredient,
    } from '../../../services/api';

type IngredientsListProps = {
    ingredientsList: CategorizedIngredients,
    addIngredient: (ingredientID: string) => void,
    removeIngredient: (ingredientID: string) => void,
}

const IngredientsList = ({ingredientsList, addIngredient, removeIngredient}: IngredientsListProps) => {
    return (
        <Stack p={8} maxW={700} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                overflowY={'auto'} ml='auto' mr='auto'>
            {Object.keys(ingredientsList).length === 0 ? (
                <Heading size='lg'>No Ingredients to Display</Heading>
            ) : (
                Object.keys(ingredientsList).map((category: string) => (
                    <CategoryListItem key={category} categoryIngredientsList={ingredientsList[category]} 
                        category={category} addIngredient={addIngredient} removeIngredient={removeIngredient}/>
                ))
            )}
        </Stack>
    );
}

// Category List Item
type CategoryListItemProps = {
    categoryIngredientsList: {[key: string]: [{name: string, id: string, owned?: boolean}]},
    category: string,
    subcategory?: string | null,
    addIngredient: (ingredientID: string) => void,
    removeIngredient: (ingredientID: string) => void,
}

const CategoryListItem = ({categoryIngredientsList, category, subcategory = null, addIngredient, removeIngredient}: CategoryListItemProps) => {
    const { isOpen, onToggle } = useDisclosure();
    
    return (<>
        <Stack spacing={4} onClick={onToggle} w={'100%'}>
            <Link _focus={{outline: "none"}} _hover={{textDecoration: "none", color: "#2395ff"}} 
                    fontWeight={500} w={subcategory ? '95%' : '100%'}>
                <StyledListItem isItemDropdown={true} showDropdownIcon={true} isDropdownOpen={isOpen}>
                    {subcategory ?? category}
                </StyledListItem> 
            </Link>
        </Stack> 

        {/* Dropdown Menu */}
        <Collapse in={isOpen} animateOpacity style={{width: '100%'}}>
            <Stack pl={4} borderLeft={"solid #cfcdcc .5px"} align='start' w='100%'>
                {subcategory === null ? (
                    Object.keys(categoryIngredientsList).map((subcategory: string) => (
                        <CategoryListItem key={subcategory} categoryIngredientsList={categoryIngredientsList}
                            category={category} subcategory={subcategory} addIngredient={addIngredient} removeIngredient={removeIngredient}/>
                    ))
                ) : (
                    categoryIngredientsList[subcategory].map((ingredient: {name: string, id: string, owned?: boolean}) => (
                        <IngredientsListItem ingredient={ingredient} key={ingredient.id}
                            onClick={ingredient.owned ? removeIngredient : addIngredient}/>
                    ))
                )}
            </Stack>
        </Collapse>
    </>);
}

type IngredientsListItemProps = {
    ingredient: {name: string, id: string, owned?: boolean},
    onClick: (ingredientID: string) => void,
}

const IngredientsListItem = (
    {ingredient, onClick}: IngredientsListItemProps
) => {
    return (
        <Stack spacing={4} w='100%'>
            <Link _focus={{outline: "none"}} role={'group'} display={'block'} p={2} rounded={'md'} w={'90%'}
                    _hover={{textDecoration: "none", bg: "#eaf6ff"}} onClick={(e) => {e.preventDefault(); 
                    onClick(ingredient.id)}}>
                <StyledListItem hoverIconType={
                    ingredient.hasOwnProperty('owned') ? (ingredient.owned ? MinusIcon : AddIcon) : undefined}>
                    {ingredient.name}
                </StyledListItem>
            </Link>
        </Stack>
    );
}

export default IngredientsList;