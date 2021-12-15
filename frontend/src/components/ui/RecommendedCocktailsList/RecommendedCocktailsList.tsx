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
    const [showCanMake, setShowCanMake] = useState(false);

    const onButtonClick = (canMake: boolean | null = null) => {
        if(canMake === null) {
            canMake = showCanMake;
        }

        if(!showList) {
            setShowList(true);
        }

        let recommendations = recommendationsList.sort(
            (a: CocktailBasicInfo, b: CocktailBasicInfo) => 0.5 - Math.random()
        )

        if(canMake) {
            recommendations = recommendations.filter(cocktail => favoritesList.includes(cocktail.id));
        }

        setShownRecommendations(recommendations.slice(0,RECOMMENDATION_LENGTH));
    }

    const onCanMakeButtonToggle = () => {
        const canMake = !showCanMake;
        setShowCanMake(canMake)
        onButtonClick(canMake);
    }

    return (<>
        {showList ? (
            <Stack spacing={4} pb={40}>
                <Heading size='md'>Here are some cocktail that we think you will like</Heading>
                <Stack direction={'row'} w='100%' maxW={700} spacing={2} px={8} 
                            style={{marginLeft: 'auto', marginRight: 'auto'}} >
                    <ShowRecommendationsButton showList={showList} onButtonClick={onButtonClick} />
                    <Button _focus={{ outline: "none" }} borderRadius={10} borderColor={"#b7e0ff"}
                            borderWidth={1} backgroundColor={showCanMake ? "#b7e0ff" : '#FFFFFF'}
                            aria-label={'Can Make'} onClick={onCanMakeButtonToggle} w='100%' >
                        Cocktails I can make
                    </Button>
                </Stack>
                <Stack p={8} w='100%' maxW={700} minH={200} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff"
                        overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                    {shownRecommendations.map((cocktail: CocktailBasicInfo) => (
                        <CocktailsListItem cocktailID={cocktail.id} cocktailName={cocktail.name}
                            favoritesList={favoritesList} onFavoriteClick={toggleFavorite} key={cocktail.id} />
                    ))}
                </Stack>
            </Stack>
        ) : (
            <Flex w='100%' justifyContent='center'pb={showList ? 0 : 60}>
                <ShowRecommendationsButton showList={showList} onButtonClick={onButtonClick} />
            </Flex>
        )}
    </>);
}

export default RecommendedCocktailsList;

type ShowRecommendationsButtonProps = {
    showList: boolean,
    onButtonClick: (canMake: boolean | null) => void
}
const ShowRecommendationsButton = ({showList, onButtonClick}: ShowRecommendationsButtonProps) => {
    return (
            <Button type='submit' w='100%' maxW={700} onClick={() => {onButtonClick(null)}} boxShadow='sm' 
                    backgroundColor={"#b7e0ff"} _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                    _focus={{outline: "none"}}>
                {showList ? 'Get New Recommendations' : 'Show Recommendations'}
            </Button>
    )
}