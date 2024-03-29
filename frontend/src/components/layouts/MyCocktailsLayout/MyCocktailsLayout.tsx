import CocktailsList from '../../ui/CocktailsList/CocktailsList';
import React, { useEffect, useState } from 'react';
import RecommendedCocktailsList from '../../ui/RecommendedCocktailsList/RecommendedCocktailsList';
import SearchBar from '../../ui/SearchBar/SearchBar';
import { Box, Heading, Stack } from '@chakra-ui/react';
import {
    buildCocktailsSearchResults,
    getSavedCocktails,
    SearchType,
    sortCocktailsOnFavorites,
    toggleFavorite
    } from '../../../functions/cocktails';
import { buildGlasswareDict } from '../../../functions/glassware';
import { buildIngredientDict } from '../../../functions/ingredients';
import {
    Cocktail,
    CocktailBasicInfo,
    getCocktailRecommendations,
    getPossibleCocktails,
    Glassware,
    Ingredient
    } from '../../../services/api';

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
    const [recommendedCocktails, setRecommendedCocktails] = useState<CocktailBasicInfo[] | null>(null);

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
        const results = buildCocktailsSearchResults(cocktailsList, ingredientsDict, glasswareDict,
            favoriteCocktailsList, searchString, searchTypes);
        
        if(results !== null) {
            setSearchResults(sortCocktailsOnFavorites(results, favoriteCocktailsList ?? []));
        }
    }

    // Loads Cocktail Recommendations
    const loadRecommendations = async () => {
        const resp = await getCocktailRecommendations();
        if(resp.status === "Success") {
            setRecommendedCocktails(resp.recommendations);
        }
    }

    // Load everything
    const loadLists = async () => {
        await getCocktails();
        await buildIngredientDict(setErrorCode, setIngredientsDict);
        await buildGlasswareDict(setErrorCode, setGlasswareDict);
        await getSavedCocktails(checkLoggedIn, setFavoriteCocktailsList, setErrorCode); 
        await loadRecommendations();
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
            <Heading size='lg' mt={10} px={4} mb={4}>Here are some cocktails that you can make</Heading>
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
            {recommendedCocktails !== null && (
                <Stack h='100%' w='100%'>
                    <RecommendedCocktailsList recommendationsList={recommendedCocktails} favoritesList={favoriteCocktailsList}
                        toggleFavorite={onClickFavorite} />
                </Stack>  
            )}
        </Stack>
    );
}

export default MyCocktailsLayout;