import CocktailsList from '../../ui/CocktailsList/CocktailsList';
import React, { useEffect, useState } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { Cocktail, getPossibleCocktails, Glassware, Ingredient } from '../../../services/api';
import {
    buildSearchResults,
    getSavedCocktails,
    SearchType,
    sortCocktailsOnFavorites,
    toggleFavorite
    } from '../../../Functions/cocktails';
import { buildIngredientDict, getIngredients } from '../../../Functions/ingredients';
import { buildGlasswareDict } from '../../../Functions/glassware';
import SearchBar from '../../ui/SearchBar/SearchBar';

type MyCocktailsLayoutProps = {
    checkLoggedIn: () => void,
}

const MyCocktailsLayout = ({checkLoggedIn}: MyCocktailsLayoutProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cocktailsList, setCocktailsList] = useState<Cocktail[] | null>(null);
    const [ingredientsDict, setIngredientsDict] = useState<{[key: string]: Ingredient} | null>(null);
    const [glasswareDict, setGlasswareDict] = useState<{[key: string]: Glassware} | null>(null);
    const [favoriteCocktailsList, setFavoriteCocktailsList] = useState<string[]>([]);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [searchString, setSearchString] = useState<string>('');
    const [searchTypes, setSearchTypes]  = useState<SearchType[]>(["CocktailName", "Ingredient", "Glassware"]);
    const [searchResults, setSearchResults] = useState<Cocktail[] | null>(null);

    const getCocktails = async () => {
        const resp = await getPossibleCocktails();
        if(resp.status == "Success") {
            setCocktailsList(resp.cocktails);
            setErrorCode(null);
            return resp.cocktails;
        } else {
            setErrorCode(resp.errorCode);
            checkLoggedIn();
            return null;
        }
    }

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
        await getCocktails();
        await buildIngredientDict(setErrorCode, setIngredientsDict);
        await buildGlasswareDict(setErrorCode, setGlasswareDict);
        await getSavedCocktails(checkLoggedIn, setFavoriteCocktailsList, setErrorCode); 
        loadSearchResults();
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        loadLists();
    }, [])

    useEffect(() => {
        loadSearchResults();
    }, [searchString, cocktailsList, ingredientsDict, glasswareDict, favoriteCocktailsList, searchTypes]);

    const onClickFavorite = async (cocktailID: string) => {
        toggleFavorite(checkLoggedIn, favoriteCocktailsList, setFavoriteCocktailsList,
            cocktailsList, setCocktailsList, setErrorCode, cocktailID);
    }

    return isLoading ? (
        <Heading pt={10}>Loading Cocktails...</Heading>
    ) : (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4}>Here are some cocktails that you can make</Heading>
            {searchResults === null || cocktailsList === null || cocktailsList === undefined ? (
                <Stack p={8} maxW={700} w={'100%'} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
                    <Heading size='lg'>Error: Unable to load cocktails.</Heading>
                    <Heading size='lg'>Please try again later.</Heading>
                </Stack>
            ) : cocktailsList.length === 0 ? (
                <Stack p={8} maxW={700} w={'100%'} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
                    <Heading size='lg'>Looks like we can't find any cocktails you can make.</Heading>
                    <Heading size='lg' pt={4}>When you get some more ingredients, please let us know.</Heading>
                </Stack>
            ) : (
                <Stack w='100%' h='100%' maxW={1500} mt={12} px={10} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    <SearchBar setSearch={setSearchString} searchTypes={searchTypes} 
                        setSearchTypes={setSearchTypes} placeholderText="Search Cocktails" />
                    <Box w='100%' h='100%'>
                        <CocktailsList cocktailsList={searchResults} favoritesList={favoriteCocktailsList} 
                            onFavoriteClick={onClickFavorite}/>
                    </Box> 
                </Stack>
            )}
        </Stack>
    );
}

export default MyCocktailsLayout;