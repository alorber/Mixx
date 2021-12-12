import CocktailsList from '../../ui/CocktailsList/CocktailsList';
import React, { useEffect, useState } from 'react';
import SearchBar from '../../ui/SearchBar/SearchBar';
import { Box, Heading, Stack } from '@chakra-ui/react';
import {
    buildCocktailsSearchResults,
    getCocktails,
    getSavedCocktails,
    SearchType,
    setUnfavorite,
    sortCocktailsOnFavorites
    } from '../../../Functions/cocktails';
import { buildGlasswareDict } from '../../../Functions/glassware';
import { buildIngredientDict } from '../../../Functions/ingredients';
import { Cocktail, Glassware, Ingredient } from '../../../services/api';

type MyFavoritesLayoutProps = {
    checkLoggedIn: () => void,
}

const MyFavoritesLayout = ({checkLoggedIn}: MyFavoritesLayoutProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cocktailsList, setCocktailsList] = useState<Cocktail[] | null>(null);
    const [favoriteCocktailsList, setFavoriteCocktailsList] = useState<string[]>([]);
    const [ingredientsDict, setIngredientsDict] = useState<{[key: string]: Ingredient} | null>(null);
    const [glasswareDict, setGlasswareDict] = useState<{[key: string]: Glassware} | null>(null);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [searchString, setSearchString] = useState<string>('');
    const [searchTypes, setSearchTypes]  = useState<SearchType[]>(["CocktailName", "Ingredient", "Glassware"]);
    const [searchResults, setSearchResults] = useState<Cocktail[] | null>(null);

    // Build Search Results
    const loadSearchResults = () => {
        const cocktails = favoriteCocktailsList !== null && cocktailsList !== null
            ? cocktailsList.filter(c => favoriteCocktailsList.includes(c._id))
            : null;

        const results = buildCocktailsSearchResults(cocktails, ingredientsDict, glasswareDict,
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
        await getSavedCocktails(checkLoggedIn, setFavoriteCocktailsList, setErrorCode);
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
    }, [searchString, cocktailsList, ingredientsDict, glasswareDict, favoriteCocktailsList, searchTypes])

    const unfavorite = async (cocktailID: string) => {
        checkLoggedIn();
        const success = await setUnfavorite(checkLoggedIn, favoriteCocktailsList, setFavoriteCocktailsList, 
            setErrorCode, cocktailID);
        if(success && cocktailsList !== null) {
            setCocktailsList(sortCocktailsOnFavorites(cocktailsList.filter(c => c._id !== cocktailID), 
            favoriteCocktailsList.filter(id => id !== cocktailID)));
        }
    }

    return isLoading ? (
        <Heading pt={10}>Loading Cocktails...</Heading>
    ) : (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4} mb={4}>Check out your favorite cocktails</Heading>
            {cocktailsList === null || cocktailsList === undefined || searchResults === null ? (
                <Stack p={8} maxW={700} w={'100%'} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
                    <Heading size='lg'>Error: Unable to load favorite cocktails.</Heading>
                    <Heading size='lg'>Please try again later.</Heading>
                </Stack>
            ) : cocktailsList.length === 0 ? (
                <Stack p={8} maxW={700} w={'100%'} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
                    <Heading size='md'>Looks like we can't find any of your favorite cocktails.</Heading>
                    <Heading size='md' pt={4}>Make sure to hit the heart button next to any cocktails you want to save.</Heading>
                </Stack>
            ) : (
                <Stack w='100%' h='100%' maxW={1500} mt={12} px={10} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <SearchBar setSearch={setSearchString} searchTypes={searchTypes} 
                    setSearchTypes={setSearchTypes} placeholderText="Search Cocktails" />
                    <Box w='100%' h='100%'>
                        <CocktailsList cocktailsList={searchResults} favoritesList={favoriteCocktailsList} 
                            onFavoriteClick={unfavorite}/>
                    </Box> 
                </Stack>
            )}
        </Stack>
    );
}

export default MyFavoritesLayout;