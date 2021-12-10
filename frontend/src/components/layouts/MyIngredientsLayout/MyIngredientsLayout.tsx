import IngredientsList from '../../ui/IngredientsList/IngredientsList';
import React from 'react';
import {
    CATEGORIES_LIST,
    CategorizedIngredients,
    getCategorizedIngredients,
    getCurrentUserIngredients,
    updateUserIngredients
    } from '../../../services/api';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Heading,
    Stack,
    } from '@chakra-ui/react';

const MyIngredientsLayout = () => {
    const [isLoading, setIsloading] = useState(false);
    const [isSaving, setIsSaving] = useState(false); 
    const [ingredientsList, setIngredientsList] = useState<CategorizedIngredients | null>(null);
    const [userIngredientIDs, setUserIngredientIDs] = useState<string[] | null>(null);
    const [categorizedUserIngredientsList, setCategorizedUserIngredientsList] = useState<CategorizedIngredients | null>(null);
    const [addedIngredientIDs, setAddedIngredientIDs] = useState<string[]>([]);
    const [removedIngredientIDs, setRemovedIngredientIDs] = useState<string[]>([]);
    const [allIngredientsErrorCode, setAllIngredientsErrorCode] = useState<number | null>(null);
    const [userIngredientsErrorCode, setUserIngredientsErrorCode] = useState<number | null>(null);
    const [selectedList, setSelectedList] = useState<'All' | 'Owned'>('All');

    // Marks user ingredients in master list
    const markUserIngredients = () => {
        if(ingredientsList == null || userIngredientIDs == null) {
            return
        }

        for(const category in ingredientsList) {
            for(const subcategory in ingredientsList[category]) {
                for(const ingredient of ingredientsList[category][subcategory]) {
                    ingredient['owned'] = userIngredientIDs.includes(ingredient.id);
                }
            }
        }
    }

    // Restructures user ingredients to be compatible with list component
    const restructureUserList = () => {
        if(userIngredientIDs == null) {
            return;
        }
        if(userIngredientIDs.length === 0) {
            setCategorizedUserIngredientsList({});
        }

        // Adds categories in order
        const userIngredientsList = CATEGORIES_LIST.reduce(
            (ingredients:CategorizedIngredients, category:string) => {ingredients[category] = {}; return ingredients;}, {}
        );
        
        // Adds owned ingredients
        for(const category in ingredientsList) {
            for(const subcategory in ingredientsList[category]) {
                for(const ingredient of ingredientsList[category][subcategory]) {
                    if(ingredient.owned) {
                        if(!userIngredientsList[category].hasOwnProperty(subcategory)) {
                            userIngredientsList[category][subcategory] = [ingredient];
                        } else {
                            userIngredientsList[category][subcategory].push(ingredient);
                        }
                    }
                }
            }
        }

        // Removes empty categories
        for(const category in userIngredientsList) {
            if(Object.keys(userIngredientsList[category]).length === 0) {
                delete userIngredientsList[category];
            }
        }

        setCategorizedUserIngredientsList(userIngredientsList);
    }

    // Get List of Ingredients
    const getAllIngredients = async () => {
        setIsloading(true);
        const resp = await getCategorizedIngredients()
        if(resp.status === "Success") {
            setIngredientsList(resp.ingredients);
            setAllIngredientsErrorCode(null);
        }
        // Error
        else {
            setAllIngredientsErrorCode(resp.errorCode);
        }
    }

    // Get User's Ingredients
    const getUserIngredients = async () => {
        const resp = await getCurrentUserIngredients()
        if(resp.status === "Success") {
            setUserIngredientIDs(resp.ingredientIDs);
            setUserIngredientsErrorCode(null);
        }
        // Error
        else {
            setUserIngredientsErrorCode(resp.errorCode);
        }
    }

    // Load list on pageload
    useEffect(() => {
        setIsloading(true);
        getAllIngredients();
        getUserIngredients();
    }, []);

    // Check if received lists
    useEffect(() => {
        if(ingredientsList != null && userIngredientIDs != null) {
            markUserIngredients();
            restructureUserList();
            setIsloading(false);
        }
    }, [ingredientsList, userIngredientIDs])

    // Add ingredient to user's list
    const addIngredient = (ingredientID: string) => {
        // Check if in removed list
        if(removedIngredientIDs.includes(ingredientID)) {
            setRemovedIngredientIDs(removedIngredientIDs.filter(id => id !== ingredientID));
        } else {
            // Add to added list
            setAddedIngredientIDs([...addedIngredientIDs, ingredientID]);
        }

        if(userIngredientIDs != null) {
            setUserIngredientIDs([...userIngredientIDs, ingredientID]);
        }
    }

    // Remove ingredient from user's list
    const removeIngredient = (ingredientID: string) => {
        // Check if in added list
        if(addedIngredientIDs.includes(ingredientID)) {
            setAddedIngredientIDs(addedIngredientIDs.filter(id => id !== ingredientID));
        } else {
            // Add to removed list
            setRemovedIngredientIDs([...removedIngredientIDs, ingredientID]);
        }

        if(userIngredientIDs != null) {
            setUserIngredientIDs(userIngredientIDs.filter((id: string) => id !== ingredientID));
        }
    }

    // Save ingredient list changes
    const saveIngredients = async () => {
        if(addedIngredientIDs.length === 0 && removedIngredientIDs.length === 0) {
            return;
        }

        setIsSaving(true);
        setIsloading(true);
        const resp = await updateUserIngredients(addedIngredientIDs, removedIngredientIDs);
        if(resp.status === 'Success') {
            setAddedIngredientIDs([]);
            setRemovedIngredientIDs([]);
            setUserIngredientIDs(resp.ingredientIDs);
        } else {
            setUserIngredientsErrorCode(resp.errorCode);
        }
        setIsSaving(false);
    }

    return isSaving ? (
        <Heading pt={10}>Saving Ingredients...</Heading>
    ) : isLoading ? (
        <Heading pt={10}>Loading Ingredients...</Heading>
    ) : ingredientsList !== null && categorizedUserIngredientsList !== null && userIngredientsErrorCode === null && allIngredientsErrorCode === null ? (
        <Stack h='100%' w='100%'>
            <Heading size='lg' mt={10} px={4}>Let us know what you have in your kitchen</Heading>
            <Flex w='100%' justifyContent='center' pt={6}>
                <Button type='submit' w='60%' maxW={1000} onClick={saveIngredients} boxShadow='sm' 
                        backgroundColor={"#b7e0ff"} _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                        _focus={{outline: "none"}}>
                    Save Ingredients
                </Button>
            </Flex>
            <Stack direction={'row'} h='85%' w='100%' maxW={1500} spacing={4} px={10} 
                    display={['none', 'none', 'flex', 'flex']} style={{marginLeft: 'auto', marginRight: 'auto'}}>
                <Stack w='100%' h='100%' mt={12}>
                    <Heading size='md'>All Ingredients</Heading>
                    <Box w='100%' h='100%'>
                        <IngredientsList ingredientsList={ingredientsList} addIngredient={addIngredient} removeIngredient={removeIngredient}/>
                    </Box> 
                </Stack>
                <Stack w='100%' h='100%' style={{marginTop: '3em'}}>
                    <Heading size='md'>My Ingredients</Heading>
                    <Box w='100%' h='100%'>
                        <IngredientsList ingredientsList={categorizedUserIngredientsList} addIngredient={addIngredient} removeIngredient={removeIngredient}/>
                    </Box>
                </Stack>
            </Stack>
            <Stack h='85%' w={'100%'} spacing={4} px={10} display={['flex', 'flex', 'none', 'none']} pt={8}>
                <ButtonGroup isAttached w='100%'>
                    <Button w='50%' onClick={(e) => {e.preventDefault(); setSelectedList('All')}}
                    boxShadow='sm' backgroundColor={selectedList === 'All' ? '#2395FF' : '#EAF6FF'} _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                    _focus={{outline: "none"}}>
                        All Ingredients
                    </Button>
                    <Button w='50%' onClick={(e) => {e.preventDefault(); setSelectedList('Owned')}}
                    boxShadow='sm' backgroundColor={selectedList === 'Owned' ? '#2395FF' : '#EAF6FF'} _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                    _focus={{outline: "none"}}>
                        My Ingredients
                    </Button>
                </ButtonGroup>
                {selectedList === 'All' ? (
                    <Box w='100%' h='100%'>
                        <IngredientsList ingredientsList={ingredientsList} addIngredient={addIngredient} removeIngredient={removeIngredient}/>
                    </Box>
                ) : (
                    <Box w='100%' h='100%'>
                        <IngredientsList ingredientsList={categorizedUserIngredientsList} addIngredient={addIngredient} removeIngredient={removeIngredient}/>
                    </Box>
                )}
            </Stack>
        </Stack>
    ) : (
        <Stack p={8} maxW={700} h={'70%'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff "
                overflowY={'auto'} style={{marginLeft: 'auto', marginRight: 'auto', marginTop: 60}}>
            <Heading size='lg'>Error: Unable to load ingredients.</Heading>
            <Heading size='lg'>Please try again later.</Heading>
        </Stack>
    );
}

export default MyIngredientsLayout;