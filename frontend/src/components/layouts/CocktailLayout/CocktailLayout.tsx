import React from 'react';
import {
    Box,
    ButtonGroup,
    Grid,
    GridItem,
    Heading,
    IconButton,
    Image,
    Stack
    } from '@chakra-ui/react';
import {
    Cocktail,
    dislikeCocktail,
    getCocktailInfo,
    getGlasswareInfo,
    getIngredientsInfo,
    getLikeDislikeStatus,
    Glassware,
    Ingredient,
    likeCocktail,
    LikeDislikeStatus,
    removeDislikedCocktail,
    removeLikedCocktail
    } from '../../../services/api';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type CocktailLayoutProps = {
    isLoggedIn: boolean,
    checkLoggedIn: () => void
}

const CocktailLayout = ({isLoggedIn, checkLoggedIn}: CocktailLayoutProps) => {
    // Get Cocktail ID from url
    const cocktailID = useParams().cocktail_id;
    const [isLoading, setIsLoading] = useState(false);
    const [cocktail, setCocktail] = useState<Cocktail | null>(null);
    const [glassware, setGlassware] = useState<Glassware | null>(null);
    const [ingredientsDict, setIngredientsDict] = useState<{[key: string]: Ingredient} | null>(null);
    const [likedStatus, setLikedStatus] = useState<LikeDislikeStatus>("None");
    const [errorCode, setErrorCode] = useState<number | null>(null);

    const getCocktail = async (cocktailID: string) => {
        const cocktailResp = await getCocktailInfo(cocktailID);
        if(cocktailResp.status === 'Success') {
            const cocktail_data = cocktailResp.cocktail;
            
            // Capitalize Info
            if(cocktail_data.directions != null) {
                cocktail_data.directions = 
                    cocktail_data.directions.charAt(0).toUpperCase() +  cocktail_data.directions.slice(1);
            }
            if(cocktail_data.garnish != null) {
                cocktail_data.garnish = 
                    cocktail_data.garnish.charAt(0).toUpperCase() +  cocktail_data.garnish.slice(1);
            }

            setCocktail(cocktail_data);

            // Get Glassware Info
            const glasswareResp = await getGlasswareInfo(cocktailResp.cocktail.glass);
            if(glasswareResp.status === 'Success') {
                setGlassware(glasswareResp.glassware);
            }

            // Get Ingredient Info
            const ingredientIDs = cocktailResp.cocktail.ingredients.map((r) => r.ingredient);
            const ingredientsResp = await getIngredientsInfo(ingredientIDs);
            if(ingredientsResp.status === 'Success') {
                const ingredientsMap = ingredientsResp.ingredients.reduce(
                    (dict: {[key: string]: Ingredient}, ingredient: Ingredient) => {
                        dict[ingredient._id] = ingredient;
                        return dict;
                    }, {}
                )
                setIngredientsDict(ingredientsMap);
            }

            // Get Like / Dislike Status
            if(isLoggedIn) {
               const likeStatusResp = await getLikeDislikeStatus(cocktailResp.cocktail._id);
            
                if(likeStatusResp.status == "Success") {
                    setLikedStatus(likeStatusResp.likeStatus);
                } 
            }
            
        } else {
            setErrorCode(null);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        setIsLoading(true);
        if(cocktailID !== undefined && cocktail == null){
            getCocktail(cocktailID); 
        } else {
            setIsLoading(false);
        }
        checkLoggedIn();
    }, [])

    // Like
    const like = async (): Promise<boolean> => {
        if(cocktail !== null) {
            const resp = await likeCocktail(cocktail._id);
            if(resp.status === "Success") {
                return true;
            }
         }         
         return false;
    }

    // Remove Like
    const removeLike = async (): Promise<boolean> => {
        if(cocktail !== null) {
            const resp = await removeLikedCocktail(cocktail._id);
            if(resp.status === "Success") {
                return true;
            }
         }         
         return false;
    }

    // Dislike
    const dislike = async (): Promise<boolean> => {
        if(cocktail !== null) {
            const resp = await dislikeCocktail(cocktail._id);
            if(resp.status === "Success") {
                return true;
            }
         }         
         return false;
    }

    // Remove Dislike
    const removeDislike = async (): Promise<boolean> => {
        if(cocktail !== null) {
            const resp = await removeDislikedCocktail(cocktail._id);
            if(resp.status === "Success") {
                return true;
            }
         }         
         return false;
    }



    const toggleLikeStatus = async (newStatus: LikeDislikeStatus) => {
        checkLoggedIn();

        let success: boolean = true;

        // Check if need to remove from lists
        if(likedStatus === "Disliked") {
            // Remove from dislike list
            success = success && await removeDislike();
        }
        if(likedStatus === "Liked") {
            // Remove from like list
            success = success && await removeLike();
        }

        // Check if need to add to lists
        if(newStatus === "Liked") {
            success = success && await like();
        } else if(newStatus === "Disliked") {
            success = success && await dislike();
        }

        // Toggle button
        if(success) {
           setLikedStatus(newStatus); 
        } else {
            checkLoggedIn();
        }
    }

    const isSubtitle = cocktail?.subtitle !== null  && cocktail?.subtitle !== '';

    return isLoading ? (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4}>Loading Cocktail...</Heading>
        </Stack> 
    ) : cocktail !== null ? (
        <Stack h='100%' w='100%'>
            <Grid templateColumns={["repeat(1,auto)","repeat(1,auto)","repeat(2,auto)","repeat(2,auto)"]}
                    w="fill" align="center" justifyContent='center' px={14} pt={10}>
                {/* Image */}
                {cocktail.img !== '' && (
                    <GridItem w='100%'>
                        <Image src={cocktail.img} alt={'Cocktail Image'}  borderRadius={12}
                            w={['30%','40%','60%','60%']} maxW={'500px'} />
                    </GridItem>
                )}
                <GridItem as={Stack} h={'100%'} w={'100%'} alignContent='center'>
                    {/* Name */}
                    <Heading size='lg' mt={{base: 10, md: 'auto'}} 
                            mb={{base: 0, md: isSubtitle ? 0 : 'auto'}} px={4}>
                        {cocktail.name}
                    </Heading>
                    {/* Subtitle (if exists) */}
                    {isSubtitle && (
                        <Heading size='md' pt={6} px={4}  style={{marginBottom: 'auto'}}>{cocktail.subtitle}</Heading>
                    )}
                </GridItem>
            </Grid>
            <Box backgroundColor='#EAF6FF' h='100%' style={{marginTop: 40}} px={10} pb={20}>
                {/* Directions */}
                {cocktail.directions !== '' && (
                    <CocktailInfoItem title={'Directions'} text={cocktail.directions} />
                )}
                {/* Glass */}
                {glassware !== null && (
                    <CocktailInfoItem title={'Glassware'} text={glassware.name} />
                )}
                {/* Garnish */}
                {cocktail.garnish !== '' && (
                    <CocktailInfoItem title={'Garnish'} text={cocktail.garnish} />
                )}
                {/* Recipe */}
                {ingredientsDict !== null && (<>
                   <Heading size='lg' pt={8} pb={4}>Recipe</Heading>
                    <Stack w='100%' spacing={4}>
                        {cocktail.ingredients.map((i) => (
                            <Heading size='md' key={i.ingredient}>{i.quantity} {i.unit} {ingredientsDict[i.ingredient].name}</Heading>
                        ))}
                    </Stack> 
                </>)}
                {/* Like / Dislike */}
                {isLoggedIn && (<>
                    <Heading size='lg' pt={8} pb={4}>Did you like this cocktail?</Heading>
                    <ButtonGroup spacing={{base: 10, md: 20}} w='100%' justifyContent='center'>
                        <LikeDislikeButton currentStatus={likedStatus} type={'Liked'} setStatus={toggleLikeStatus}
                            hoverColor='#A8E28E' pressedColor='#97cb7f' />
                        <LikeDislikeButton currentStatus={likedStatus} type={'Disliked'} setStatus={toggleLikeStatus}
                        hoverColor='#E5A5A6' pressedColor='#ce9495' />
                    </ButtonGroup>
                </>)}
            </Box>
        </Stack>
    ) : (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4}>We're having trouble finding this cocktail.</Heading>
            <Heading size='lg' mt={10} px={4}>Please try again later.</Heading>
        </Stack> 
    );
}

export default CocktailLayout;

// Info Item for Cocktail Page
type CocktailInfoItemProps = {
    title: string,
    text: string
}

const CocktailInfoItem = ({title, text}: CocktailInfoItemProps) => {
    return (
        <Stack direction='row' w='100%' justifyContent='center' alignContent='center' pt={8}>
            <Heading size={'md'} textAlign='left'>{title}:</Heading>
            <Heading size={'sm'} textAlign='left'>{text}</Heading> 
        </Stack>
    );
}

// Liked & Dislike Buttons
type LikeDislikeButtonProps = {
    currentStatus:  LikeDislikeStatus,
    type: "Liked" | "Disliked",
    setStatus: (newStatus: LikeDislikeStatus) => void,
    hoverColor: string,
    pressedColor: string
}

const LikeDislikeButton = ({currentStatus, type, setStatus, hoverColor, pressedColor}: LikeDislikeButtonProps) => {
    const newStatus = type === currentStatus ? 'None' : type;
    const ariaLabel = type === "Liked" ? "Thumbs Up" : "Thumbs Down"
    return (
        <IconButton onClick={() => {setStatus(newStatus)}} _focus={{ outline: "none"}} borderRadius={20}
            icon={<LikeDislikeIcon type={type} size={50} color='#EAF6FF' />} aria-label={ariaLabel}
            boxSize={'100px'} backgroundColor={currentStatus === type ? hoverColor : '#2395FF'} 
            _hover={{backgroundColor: hoverColor}} _active={{backgroundColor: pressedColor}} />
    );
}

const LikeDislikeIcon = ({type, size, color}: {type: "Liked" | "Disliked", size: number, color: string}) => {
    return type === "Liked" ? (
        <FaThumbsUp size={size} color={color} />
    ) : (
        <FaThumbsDown size={size} color={color} />
    );
}