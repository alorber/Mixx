import IngredientsList from '../../ui/IngredientsList/IngredientsList';
import React from 'react';
import SearchBar from '../../ui/SearchBar/SearchBar';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { CATEGORIES_LIST, CategorizedIngredients, getCategorizedIngredients } from '../../../services/api';
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
        const resp = await getCategorizedIngredients()
        if(resp.status === "Success") {
            setIngredientsList(resp.ingredients);
            setSearchResults(resp.ingredients);
            setErrorCode(null);
        }
        // Error
        else {
            setErrorCode(resp.errorCode);
        }
        setIsLoading(false);
    }

    // Build Search Results
    const loadSearchResults = () => {
        if(ingredientsList === null) {
            return
        }

        const searchTerm = searchString.trim().toLowerCase();
        const results: CategorizedIngredients = JSON.parse(JSON.stringify(ingredientsList));

        // If no search, show all
        if(searchTerm === '') {
            setSearchResults(results);
        }

        for(const category in results) {
            for(const subcategory in results[category]) {
                // List of passing ingredients in subcategory
                const passingIngredients = [];

                // Add passing ingredients
                for(const ingredient of results[category][subcategory]) {
                    if(ingredient.name.toLowerCase().includes(searchTerm)) {
                        passingIngredients.push(ingredient);
                    }
                }

                // Remove empty subcategories
                if(passingIngredients.length === 0) {
                    delete results[category][subcategory];
                } else {
                    results[category][subcategory] = passingIngredients;
                }
            }

            // Removes empty categories
            if(Object.keys(results[category]).length === 0) {
                delete results[category];
            }
        }

        setSearchResults(results);
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
                <SearchBar setSearch={setSearchString} />
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