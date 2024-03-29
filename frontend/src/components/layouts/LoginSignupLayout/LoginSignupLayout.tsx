import LoginSignupForm from '../../ui/LoginSignupForm/LoginSignupForm';
import {
    Grid,
    GridItem,
    Heading,
    Image,
    Stack,
    Text
    } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type LoginSignupLayoutProps = {
    isLoggedIn: boolean, 
    updateLoggedIn: (l: boolean) => void,
    checkLoggedIn: () => void
}

const LoginSignupLayout = ({isLoggedIn, updateLoggedIn, checkLoggedIn}: LoginSignupLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation()
    
    // Redirect to home from signup page
    useEffect(() => {
        if(isLoggedIn && location.pathname === '/login') {
            navigate('/')
        }
    })

    // Check if auth expired
    useEffect(() => {
        checkLoggedIn();
    });

    return (
        <Stack>
            {!isLoggedIn && <LoginSignupForm updateLoggedIn={updateLoggedIn} />}
            <Stack>
                <Heading size='lg' my={10}>Why Sign Up?</Heading>
                <Grid templateColumns={["repeat(1,auto)","repeat(1,auto)","repeat(2,auto)","repeat(2,auto)"]}
                          w="fill" align="center" justifyContent='center' pl={14}>
                    <FeatureItem imgSource='/Icons/Ingredients.png' imgSize={'300px'} featureText="Save your ingredients to your account" />
                    <FeatureItem imgSource='/Icons/Cocktail.png' imgSize={'300px'} featureText="Quickly view all the cocktails you can make" />
                    <FeatureItem imgSource='/Icons/Heart_Cocktail.png' imgSize={'300px'} featureText="Favorite cocktails for easy access" />
                    <FeatureItem imgSource='/Icons/Groceries.png' imgSize={'300px'} featureText="Get recommendations on your next ingredient purchase" />
                </Grid>
            </Stack>
        </Stack>
    );
};

export default LoginSignupLayout;

// Items for feature list
const FeatureItem = ({featureText, imgSource, imgSize}:{featureText: string, imgSource: string, imgSize: string}) => {
    return (
        <GridItem pb={6} pt={4}>
            <Grid templateColumns="repeat(2,auto)" w={"80%"}>
                <GridItem align="left" mr={6}>
                    <Image src={imgSource} bgSize={imgSize}/>
                </GridItem>
                <GridItem align="left" pl={4} pt={4}>
                    <Text>{featureText}</Text>
                </GridItem>
            </Grid>
        </GridItem>
    );
}