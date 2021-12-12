import CocktailsList from '../../ui/CocktailsList/CocktailsList';
import React from 'react';
import SearchBar from '../../ui/SearchBar/SearchBar';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { buildGlasswareDict } from '../../../Functions/glassware';
import { buildIngredientDict, getIngredients } from '../../../Functions/ingredients';
import {
    buildSearchResults,
    getCocktails,
    getSavedCocktails,
    SearchType,
    setFavorite,
    setUnfavorite,
    sortCocktailsOnFavorites,
    toggleFavorite
    } from '../../../Functions/cocktails';
import {
    Cocktail,
    getAllGlassware,
    Glassware,
    Ingredient
    } from '../../../services/api';
import { useEffect, useState } from 'react';

type AllCocktailsLayoutProps = {
    isLoggedIn: boolean,
    checkLoggedIn: () => void
};

const AllCocktailsLayout = ({isLoggedIn, checkLoggedIn}: AllCocktailsLayoutProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cocktailsList, setCocktailsList] = useState<Cocktail[] | null>(null);
    const [favoriteCocktailsList, setFavoriteCocktailsList] = useState<string[] | null>(null);
    const [ingredientsDict, setIngredientsDict] = useState<{[key: string]: Ingredient} | null>(null);
    const [glasswareDict, setGlasswareDict] = useState<{[key: string]: Glassware} | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [searchString, setSearchString] = useState<string>('');
    const [searchTypes, setSearchTypes]  = useState<SearchType[]>(["CocktailName", "Ingredient", "Glassware"]);
    const [searchResults, setSearchResults] = useState<Cocktail[] | null>(null);

    // Build Search Results
    const loadSearchResults = () => {
        const results = buildSearchResults(cocktailsList, ingredientsDict, glasswareDict,
            favoriteCocktailsList, searchString, searchTypes);
        
        if(results !== null) {
            setSearchResults(sortCocktailsOnFavorites(results, favoriteCocktailsList ?? []));
        }
    }

    // Load everything
    const loadLists = async () => {
        await getCocktails(setErrorCode, (cocktails: Cocktail[]) => {
            setCocktailsList(cocktails);
            setSearchResults(cocktails);
        });
        await buildIngredientDict(setErrorCode, setIngredientsDict);
        await buildGlasswareDict(setErrorCode, setGlasswareDict);
        if(isLoggedIn) {
           await getSavedCocktails(checkLoggedIn, setFavoriteCocktailsList, setErrorCode); 
        }
        loadSearchResults();
        setIsLoading(false);
    }

    // Load list on pageload
    useEffect(() => {
        setIsLoading(true);
        loadLists();
    }, []);

    useEffect(() => {
        loadSearchResults();
    }, [searchString, cocktailsList, ingredientsDict, glasswareDict, favoriteCocktailsList, searchTypes]);

    const onClickFavorite = async (cocktailID: string) => {
        toggleFavorite(checkLoggedIn, favoriteCocktailsList, setFavoriteCocktailsList,
            cocktailsList, setCocktailsList, setErrorCode, cocktailID);
    }

    return isLoading ? (
        <Heading pt={10}>Loading Cocktails...</Heading>
    ) : searchResults !== null && ingredientsDict !== null && glasswareDict !== null ? (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4}>All Cocktails</Heading>
            <Stack h='85%' w='100%' maxW={1500} spacing={4} px={10} 
                    style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 40}}>
                <Heading size='md'>
                    Select a cocktail to view its page
                </Heading>
                <SearchBar setSearch={setSearchString} searchTypes={searchTypes} 
                    setSearchTypes={setSearchTypes} placeholderText="Search Cocktails" />
                <Box w='100%' h='100%'>
                    <CocktailsList cocktailsList={searchResults} favoritesList={favoriteCocktailsList} 
                        onFavoriteClick={onClickFavorite} />
                </Box> 
            </Stack>
        </Stack>
    ) : (
        <Stack p={8} maxW={700} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
            <Heading size='lg'>Error: Unable to load Cocktails.</Heading>
            <Heading size='lg'>Please try again later.</Heading>
        </Stack>
    );
}

export default AllCocktailsLayout;