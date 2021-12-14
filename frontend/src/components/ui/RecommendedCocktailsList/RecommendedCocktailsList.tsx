import React, { useState } from 'react';
import {
    Button,
    Flex,
    Heading,
    Stack
    } from '@chakra-ui/react';
import { CocktailBasicInfo } from '../../../services/api';
import { CocktailsListItem } from '../CocktailsList/CocktailsList';

// Number of recommendations to show
const RECOMMENDATION_LENGTH = 3;

type RecommendedCocktailsListProps = {
    recommendationsList: CocktailBasicInfo[],
    favoritesList: string[],
    toggleFavorite: (id: string) => void
}
const RecommendedCocktailsList = ({recommendationsList, favoritesList, toggleFavorite}: RecommendedCocktailsListProps) => {
    const [shownRecommendations, setShownRecommendations] = useState<CocktailBasicInfo[]>([]);
    const [showList, setShowList] = useState(false);

    const onButtonClick = () => {
        if(!showList) {
            setShowList(true);
        }

        setShownRecommendations(recommendationsList.sort(
            (a: CocktailBasicInfo, b: CocktailBasicInfo) => 0.5 - Math.random()
        ).slice(0,RECOMMENDATION_LENGTH));
    }

    return (<>
        <Flex w='100%' justifyContent='center'pb={showList ? 0 : 60}>
            <Button type='submit' w='100%' maxW={700} onClick={onButtonClick} boxShadow='sm' 
                    backgroundColor={"#b7e0ff"} _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                    _focus={{outline: "none"}}>
                {showList ? 'Get New Recommendations' : 'Show Recommendations'}
            </Button>
        </Flex>
        {showList && (
            <Stack spacing={4} pb={40}>
                <Heading size='md'>Here are some cocktail that we think you will like</Heading>
                <Stack p={8} w='100%' maxW={700} minH={200} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff"
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    {shownRecommendations.map((cocktail: CocktailBasicInfo) => (
                        <CocktailsListItem cocktailID={cocktail.id} cocktailName={cocktail.name}
                            favoritesList={favoritesList} onFavoriteClick={toggleFavorite} />
                    ))}
                </Stack>
            </Stack>
        )}
    </>);
}

export default RecommendedCocktailsList;