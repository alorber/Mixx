import React from 'react';
import StyledListItem from '../StyledListItem/StyledListItem';
import { Cocktail } from '../../../services/api';
import { FaHeart } from 'react-icons/fa';
import { IconButton, Link, Stack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

type CocktailsListProps = {
    cocktailsList: Cocktail[],
    favoritesList?: string[] | null,
    onFavoriteClick: (cocktailID: string) => void
}

const CocktailsList = ({cocktailsList, favoritesList = null, onFavoriteClick}: CocktailsListProps) => {

    return (
        <Stack p={8} maxW={700} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff"
                overflowY={'auto'} ml='auto' mr='auto'>
            {cocktailsList.map((cocktail: Cocktail) => (
                <CocktailsListItem cocktailID={cocktail._id} cocktailName={cocktail.name}
                    favoritesList={favoritesList} key={cocktail._id} onFavoriteClick={onFavoriteClick} />
            ))}
        </Stack>
    );
}

export default CocktailsList;

// Cocktail List Item
type CocktailsListItemProps = {
    cocktailID: string,
    cocktailName: string,
    favoritesList: string[] | null,
    onFavoriteClick: (cocktailID: string) => void
}

const CocktailsListItem = ({cocktailID, cocktailName, favoritesList, onFavoriteClick}: CocktailsListItemProps) => {
    return (
        <Stack direction='row'>
            {favoritesList !== null && (
                <IconButton onClick={() => {onFavoriteClick(cocktailID)}} _focus={{ outline: "none" }}
                icon={<FaHeart color={favoritesList.includes(cocktailID) ? '#E5A5A6' : '#FFFFFF'} />} 
                aria-label={'Favorite Toggle'} backgroundColor={'#eaf6ff'}
                _hover={{ backgroundColor: '#b7e0ff' }} />
            )}
            <Link as={RouterLink} to={`/cocktails/${cocktailID}`} _focus={{outline: "none"}}
                    role={'group'} display={'block'} p={2} rounded={'md'} w={'100%'}
                    _hover={{textDecoration: "none", bg: "#eaf6ff"}}>
                <StyledListItem >
                    {cocktailName}
                </StyledListItem> 
            </Link>
        </Stack>
        
    );
}