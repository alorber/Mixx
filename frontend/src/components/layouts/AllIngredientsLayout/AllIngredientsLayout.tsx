import IngredientsList from '../../ui/IngredientsList/IngredientsList';
import React from 'react';
import SearchBar from '../../ui/SearchBar/SearchBar';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { buildIngredientsSearchResults, getIngredientsCategorized } from '../../../functions/ingredients';
import { CategorizedIngredients } from '../../../services/api';
import { useEffect, useState } from 'react';
        
type AllIngredientsLayoutProps = {

}

const AllIngredientsLayout = ({}: AllIngredientsLayoutProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [ingredientsList, setIngredientsList] = useState<CategorizedIngredients | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [searchString, setSearchString] = useState<string>('');
    const [searchResults, setSearchResults] = useState<CategorizedIngredients | null>(null);

    // Get List of Ingredients
    const getAllIngredients = async () => {
        setIsLoading(true);
        await getIngredientsCategorized(setErrorCode, (ingredients: CategorizedIngredients) => {
            setIngredientsList(ingredients);
            setSearchResults(ingredients);
        })
        setIsLoading(false);
    }

    // Build Search Results
    const loadSearchResults = () => {
        const results = buildIngredientsSearchResults(ingredientsList, searchString)

        if(results !== null) {
            setSearchResults(results);  
        }
    }

    // Load list on pageload
    useEffect(() => {
        setIsLoading(true);
        getAllIngredients();
    }, []);

    useEffect(() => {
        loadSearchResults();
    }, [searchString]);

    return isLoading ? (
        <Heading pt={10}>Loading Ingredients...</Heading>
    ) : ingredientsList !== null && searchResults !== null && errorCode === null ? (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4}>All Ingredients</Heading>
            <Stack h='85%' w='100%' maxW={1500} spacing={4} px={10} 
                    style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 40}}>
                <Heading size='md'>
                    Select an ingredient to view cocktails containing it
                </Heading>
                <SearchBar setSearch={setSearchString} placeholderText="Search For Ingredients" />
                <Box w='100%' h='100%'>
                    <IngredientsList ingredientsList={searchResults} />
                </Box> 
            </Stack>
        </Stack>
    ) : (
        <Stack p={8} maxW={700} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
            <Heading size='lg'>Error: Unable to load ingredients.</Heading>
            <Heading size='lg'>Please try again later.</Heading>
        </Stack>
    );
}

export default AllIngredientsLayout;