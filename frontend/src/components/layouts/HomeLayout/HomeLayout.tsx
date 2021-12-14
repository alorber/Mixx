import React, { useEffect } from 'react';
import ThemedButton from '../../ui/ThemedButton/ThemedButton';
import {
    Box,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Stack,
    Text
    } from '@chakra-ui/react';

type HomeLayoutProps = {
    checkLoggedIn: () => void
}

const HomeLayout = ({checkLoggedIn}: HomeLayoutProps) => {

    // Check if user auth has expired
    useEffect(() => {
        checkLoggedIn();
    });

    return (
        <Stack spacing={10} justifyContent='center'>
            {/* Intro & Sign In Button */}
            <Heading mt={6} px={6}>
                Welcome To Mixx!
            </Heading>
            <Heading size='lg' px={6}>
                Mixx is a new tool that will bring your home-bartending
                skills to a whole new level.
            </Heading>
            <Heading size='lg' px={6}>
                You bring the ingredients and we'll bring the recipes!
            </Heading>
            <Flex justifyContent='center' pt={4}>
                <ThemedButton label="See what you can make!" routeTo="/my_cocktails" width={'fit-content'}/>
            </Flex>
            <Box backgroundColor='#EAF6FF' pb={40}>
                {/* How does it work */}
                <Heading size='lg' pt={6} pb={2}>
                    How does it work?
                </Heading>
                <Stack w={'50%'} style={{marginRight: 'auto', marginLeft: 'auto', marginTop: 2}}>
                    <HomepageListItem imgSrc={'/Images/Kitchen.png'} imgWidth={300} 
                        text={"Tell us which ingredients you have in your home"}/>
                    <HomepageListItem imgSrc={'/Images/Cocktails.png'} imgWidth={300} 
                        text={"We will look through our database to find all the cocktails you can make"}/>
                    <HomepageListItem imgSrc={'/Images/Pouring_Drink.png'} imgWidth={300} 
                        text={"Select a cocktail to view the recipe and start MIXXing"}/>
                </Stack>
                {/* Additional Features */}
                <Heading size='lg' pt={6} pb={2}>
                    Additional Features
                </Heading>
                <Stack w={'50%'} style={{marginRight: 'auto', marginLeft: 'auto', marginTop: 2}}>
                    <HomepageListItem imgSrc={'/Images/Hearts_Cocktails.png'} imgWidth={200} 
                        imgHeight={200} text={"Favorite cocktails for easy access later"}/>
                    <HomepageListItem imgSrc={'/Images/Liquor_Store.png'} imgWidth={300} 
                        imgHeight={200} text={"Discover which new ingredients will add the" + 
                        " most new cocktails"}/>
                    <HomepageListItem imgSrc={'/Images/Liquor_Bottles.png'} imgWidth={300} 
                        text={"Search cocktails by ingredient"}/>
                </Stack>
            </Box>
        </Stack>
    );
};

type HomepageListItemProps = {
    text: string,
    imgSrc: string,
    imgWidth?: string | number,
    imgHeight?: string | number
}
const HomepageListItem = ({text, imgSrc, imgWidth, imgHeight}: HomepageListItemProps) => {
    return (
        <Grid templateColumns={["repeat(1,auto)","repeat(1,auto)","repeat(1,auto)","repeat(2,auto)"]}
                gap={[4, 4, 4, 14]} pt={4}>
            <GridItem  alignSelf="center" pt={4}>
                <Text textAlign={['center', 'center', 'center', 'left']} w={'fit-content'}>{text}</Text>
            </GridItem>
            <GridItem alignSelf="center">
                <Image src={imgSrc} h={imgHeight} w={imgWidth} marginLeft='auto' marginRight={['auto', 'auto', 0, 0]} />
            </GridItem>
        </Grid>
    );
}

export default HomeLayout;
