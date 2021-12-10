import CocktailsList from '../../ui/CocktailsList/CocktailsList';
import React, { useEffect, useState } from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { Cocktail, favoriteCocktail, getFavoritedCocktails, getPossibleCocktails, unfavoriteCocktail } from '../../../services/api';

type MyCocktailsLayoutProps = {

}

const MyCocktailsLayout = ({}: MyCocktailsLayoutProps) => {
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
            return null;
        }
    }

    const getSavedCocktails = async () => {
        const resp = await getFavoritedCocktails();
        if(resp.status == "Success") {
            setFavoriteCocktailsList(resp.cocktailIDs);
            setErrorCode(null);
            return resp.cocktailIDs;
        } else {
            setErrorCode(resp.errorCode);
            return null;
        }
    }

    const getSortedCocktails = async() => {
        const favorites = await getSavedCocktails();
        const cocktails = await getCocktails();
        sortCocktails(cocktails, favorites);
        setIsLoading(false);
    }

    const sortCocktails = (cocktails: Cocktail[] | null, favorites: string[] | null) => {
        if(cocktails == null || favorites == null) {
            return;
        }

        const sortedCocktail = [...cocktails]
        sortedCocktail.sort((c1, c2) => {
            const isC1Favorited = favorites?.includes(c1._id);
            const isC2Favorited = favorites?.includes(c2._id);

            // Both favorited or neither
            console.log(`HERE ${isC1Favorited} ${isC2Favorited}`)
            console.log(`LIST: ${favorites}`)
            if((isC1Favorited && isC2Favorited) || (!isC1Favorited && !isC2Favorited)) {
                // Sort alphabetically
                return c1.name.toLowerCase() < c2.name.toLowerCase() ? -1 : 1;
            }
            return isC1Favorited ? -1 : 1;
        })
        setCocktailsList(sortedCocktail);
    }

    useEffect(() => {
        setIsLoading(true);
        getSortedCocktails();
    }, [])

    const setFavorite = async (cocktailID: string) => {
        const resp = await favoriteCocktail(cocktailID);
        
        if(resp.status == "Success") {
            setFavoriteCocktailsList([...favoriteCocktailsList, cocktailID]);
            sortCocktails(cocktailsList, [...favoriteCocktailsList, cocktailID]);
        } else {
            setErrorCode(resp.errorCode);
        }
    }

    const setUnfavorite = async (cocktailID: string) => {
        const resp = await unfavoriteCocktail(cocktailID);
        
        if(resp.status == "Success") {
            setFavoriteCocktailsList(favoriteCocktailsList.filter(id => id !== cocktailID));
            sortCocktails(cocktailsList, favoriteCocktailsList.filter(id => id !== cocktailID));
        } else {
            setErrorCode(resp.errorCode);
        }
    }

    const toggleFavorite = (cocktailID: string) => {
        if(favoriteCocktailsList.includes(cocktailID)) {
            setUnfavorite(cocktailID);
        } else {
            setFavorite(cocktailID);
        }
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
                            onFavoriteClick={toggleFavorite}/>
                    </Box> 
                </Stack>
            )}
        </Stack>
    );
}

export default MyCocktailsLayout;