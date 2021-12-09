import React from 'react';
import StyledListItem from '../../ui/StyledListItem/StyledListItem';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import {
    Collapse,
    Link,
    Stack,
    useDisclosure
    } from '@chakra-ui/react';
import {
    CategorizedIngredients,
    } from '../../../services/api';

type IngredientsListProps = {
    ingredientsList: CategorizedIngredients,
}

const IngredientsList = ({ingredientsList}: IngredientsListProps) => {
    return (
        <Stack p={8} maxW={700} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                overflowY={'scroll'} ml='auto' mr='auto'>
            {Object.keys(ingredientsList).map((category: string) => (
                <CategoryListItem key={category} categoryIngredientsList={ingredientsList[category]} 
                    category={category} />
            ))}
        </Stack>
    );
}

// Category List Item
type CategoryListItemProps = {
    categoryIngredientsList: {[key: string]: [{name: string, id: string, owned?: boolean}]},
    category: string,
    subcategory?: string | null
}

const CategoryListItem = ({categoryIngredientsList, category, subcategory = null}: CategoryListItemProps) => {
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
                            category={category} subcategory={subcategory} />
                    ))
                ) : (
                    categoryIngredientsList[subcategory].map((ingredient: {name: string, id: string}) => (
                        <IngredientsListItem ingredient={ingredient} key={ingredient.id}
                            category={category} subcategory={subcategory} />
                    ))
                )}
            </Stack>
        </Collapse>
    </>);
}

type IngredientsListItemProps = {
    ingredient: {name: string, id: string, owned?: boolean},
    category: string,
    subcategory: string
}

const IngredientsListItem = (
    {ingredient, category, subcategory}: IngredientsListItemProps
) => {
    return (
        <Stack spacing={4}>
            <Link _focus={{outline: "none"}} role={'group'} display={'block'} p={2} rounded={'md'} w={'100%'}
                    _hover={{textDecoration: "none", bg: "#eaf6ff"}}>
                <StyledListItem hoverIconType={
                    ingredient.hasOwnProperty('owned') ? (ingredient.owned ? AddIcon : MinusIcon) : undefined}>
                    {ingredient.name}
                </StyledListItem>
            </Link>
        </Stack>
    );
}

export default IngredientsList;