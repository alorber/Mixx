import React from 'react';
import StyledListItem from '../StyledListItem/StyledListItem';
import { buildSelectedIngredientDict } from '../../../functions/ingredients';
import { Ingredient, IngredientRecommendations } from '../../../services/api';
import {
    Button,
    Collapse,
    Flex,
    Heading,
    Link,
    Stack,
    useDisclosure
    } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Number of recommendations to show
const RECOMMENDATION_LENGTH = 3;

type RecommendedIngredientsListProps = {
    recommendedIngredients: IngredientRecommendations
}

const RecommendedIngredientsList = ({recommendedIngredients}: RecommendedIngredientsListProps) => {
    const [ingredientsDict, setIngredientsDict] = useState<{[key: string]: Ingredient} | null>(null);
    const [shownRecommendations, setShownRecommendations] = useState<string[]>([]);
    const [showList, setShowList] = useState(false);

    const buildIngredientsDict = async () => {
        const ingredientsMap = await buildSelectedIngredientDict(Object.keys(recommendedIngredients));
        setIngredientsDict(ingredientsMap);
    }

    useEffect(() => {
        buildIngredientsDict()
    }, [recommendedIngredients]);

    const onButtonClick = () => {
        const randomSort = (a: string, b: string) => 0.5 - Math.random();
        const lengthSort = (a: string, b: string) => recommendedIngredients[b].length - recommendedIngredients[a].length;

        if(!showList) {
            setShowList(true);
        }

        // Shows ingredients that will add most on startup. Click button to shuffle.
        setShownRecommendations(Object.keys(recommendedIngredients).sort(
            showList ? randomSort : lengthSort 
        ).slice(0,RECOMMENDATION_LENGTH));
    }

    return ingredientsDict !== null ? (<>
        <Flex w='100%' justifyContent='center'pb={showList ? 0 : 60}>
            <Button type='submit' w='100%' maxW={700} onClick={onButtonClick} boxShadow='sm' 
                    backgroundColor={"#b7e0ff"} _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                    _focus={{outline: "none"}}>
                {showList ? 'Get New Recommendations' : 'Show Recommendations'}
            </Button>
        </Flex>
        {showList && (
            <Stack spacing={4} pb={40}>
                <Heading size='md'>Here are some ingredients that will let you make more cocktails</Heading>
                <Heading size='sm'>Click on an ingredient to view the new cocktails it will allow you to make</Heading>
                <Stack p={8} w='100%' maxW={700} minH={200} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff"
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    {shownRecommendations.map((ingredientID: string) => (
                        <RecommendedIngredientsListItem ingredientName={ingredientsDict[ingredientID].name} 
                            cocktails={recommendedIngredients[ingredientID]} key={ingredientID} />
                    ))}
                </Stack>
            </Stack>
        )}
    </>) : null;
}

export default RecommendedIngredientsList;

// Recommended Ingredient List Item
type RecommendedIngredientsListItemProps = {
    ingredientName: string,
    cocktails: {id: string, name: string}[]
}
const RecommendedIngredientsListItem = ({ingredientName, cocktails}: RecommendedIngredientsListItemProps) => {
    const { isOpen, onToggle } = useDisclosure();
    
    return (<>
        <Stack spacing={4} onClick={onToggle} w={'100%'}>
            <Link _focus={{outline: "none"}} _hover={{textDecoration: "none", color: "#2395ff"}} 
                    fontWeight={500} w={'100%'}>
                <StyledListItem isItemDropdown={true} showDropdownIcon={true} isDropdownOpen={isOpen}>
                    {ingredientName}
                </StyledListItem> 
            </Link>
        </Stack> 

        {/* Dropdown Menu */}
        <Collapse in={isOpen} animateOpacity style={{width: '100%'}}>
            <Stack pl={4} borderLeft={"solid #cfcdcc .5px"} align='start' w='100%'>
                {cocktails.map((cocktail) => (
                    <Link as={RouterLink} to={`/cocktails/${cocktail.id}`}  _focus={{outline: "none"}} 
                            role={'group'} display={'block'} p={2} rounded={'md'} w={'90%'}
                            _hover={{textDecoration: "none", bg: '#eaf6ff'}} key={cocktail.id}>
                        <StyledListItem>
                            {cocktail.name}
                        </StyledListItem>
                    </Link>
                ))}
            </Stack>
        </Collapse>
    </>);
}