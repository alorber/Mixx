import CocktailsList from '../../ui/CocktailsList/CocktailsList';
import React, { useEffect, useState } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { Cocktail, getPossibleCocktails } from '../../../services/api';
import {
    getSavedCocktails,
    sortCocktailsOnFavorites,
    toggleFavorite
    } from '../../../Functions/cocktails';

type MyCocktailsLayoutProps = {
    checkLoggedIn: () => void,
}

const MyCocktailsLayout = ({checkLoggedIn}: MyCocktailsLayoutProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [cocktailsList, setCocktailsList] = useState<Cocktail[] | null>(null);
    const [favoriteCocktailsList, setFavoriteCocktailsList] = useState<string[]>([]);
    const [errorCode, setErrorCode] = useState<number | null>(null);

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

    const getSortedCocktails = async() => {
        const favorites = await getSavedCocktails(checkLoggedIn, setFavoriteCocktailsList, setErrorCode);
        const cocktails = await getCocktails();
        setCocktailsList(sortCocktailsOnFavorites(cocktails, favorites));
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        getSortedCocktails();
    }, [])

    const onClickFavorite = async (cocktailID: string) => {
        toggleFavorite(checkLoggedIn, favoriteCocktailsList, setFavoriteCocktailsList,
            cocktailsList, setCocktailsList, setErrorCode, cocktailID);
    }

    return (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4}>Here are some cocktails that you can make</Heading>
            {isLoading ? (
                <Stack p={8} maxW={700} w={'100%'} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
                    <Heading size='lg'>Loading Cocktails...</Heading>
                </Stack>
            ) : cocktailsList === null || cocktailsList === undefined ? (
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
                    <Heading size='lg' mt={10} px={4}></Heading>
                    <Box w='100%' h='100%'>
                        <CocktailsList cocktailsList={cocktailsList} favoritesList={favoriteCocktailsList} 
                            onFavoriteClick={onClickFavorite}/>
                    </Box> 
                </Stack>
            )}
        </Stack>
    );
}

export default MyCocktailsLayout;