import CocktailsList from '../../ui/CocktailsList/CocktailsList';
import React, { useEffect, useState } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { Cocktail, getAllCocktails } from '../../../services/api';
import {
    getSavedCocktails,
    setFavorite,
    setUnfavorite,
    sortCocktailsOnFavorites
    } from '../../../Functions/cocktails';

type MyFavoritesLayoutProps = {
    checkLoggedIn: () => void,
}

const MyFavoritesLayout = ({checkLoggedIn}: MyFavoritesLayoutProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cocktailsList, setCocktailsList] = useState<Cocktail[] | null>(null);
    const [favoriteCocktailsList, setFavoriteCocktailsList] = useState<string[]>([]);
    const [errorCode, setErrorCode] = useState<number | null>(null);

    const getCocktails = async () => {
        const resp = await getAllCocktails();
        if(resp.status == "Success") {
            setErrorCode(null);
            return resp.cocktails;
        } else {
            setErrorCode(resp.errorCode);
            return null;
        }
    }
    
    const getSortedCocktails = async() => {
        const favorites = await getSavedCocktails(checkLoggedIn, setFavoriteCocktailsList, setErrorCode);
        let cocktails = await getCocktails();
        
        if(favorites !== null && cocktails !== null) {
            cocktails = cocktails.filter(c => favorites.includes(c._id));
        }

        setCocktailsList(sortCocktailsOnFavorites(cocktails, favorites));
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        getSortedCocktails();
    }, [])

    const unfavorite = async (cocktailID: string) => {
        checkLoggedIn();
        const success = await setUnfavorite(checkLoggedIn, favoriteCocktailsList, setFavoriteCocktailsList, 
            setErrorCode, cocktailID);
        if(success && cocktailsList !== null) {
            setCocktailsList(sortCocktailsOnFavorites(cocktailsList.filter(c => c._id !== cocktailID), 
            favoriteCocktailsList.filter(id => id !== cocktailID)));
        }
    }

    return (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4}>Check out your favorite cocktails</Heading>
            {isLoading ? (
                <Stack p={8} maxW={700} w={'100%'} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
                    <Heading size='lg'>Loading Favorite Cocktails...</Heading>
                </Stack>
            ) : cocktailsList === null || cocktailsList === undefined ? (
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
                    <Heading size='lg' mt={10} px={4}></Heading>
                    <Box w='100%' h='100%'>
                        <CocktailsList cocktailsList={cocktailsList} favoritesList={favoriteCocktailsList} 
                            onFavoriteClick={unfavorite}/>
                    </Box> 
                </Stack>
            )}
        </Stack>
    );
}

export default MyFavoritesLayout;