import IngredientsList from '../../ui/IngredientsList/IngredientsList';
import React from 'react';
import SearchBar from '../../ui/SearchBar/SearchBar';
import {
    addIngredient,
    buildIngredientsSearchResults,
    getIngredientsCategorized,
    getUserIngredients,
    removeIngredient,
    restructureUserList,
    saveIngredients
    } from '../../../Functions/ingredients';
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Heading,
    Stack
    } from '@chakra-ui/react';
import { CategorizedIngredients } from '../../../services/api';
import { useEffect, useState } from 'react';

type MyIngredientsLayoutProps = {
    checkLoggedIn: () => void,
}


const MyIngredientsLayout = ({checkLoggedIn}: MyIngredientsLayoutProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false); 
    const [ingredientsList, setIngredientsList] = useState<CategorizedIngredients | null>(null);
    const [userIngredientIDs, setUserIngredientIDs] = useState<string[] | null>(null);
    const [categorizedUserIngredientsList, setCategorizedUserIngredientsList] = useState<CategorizedIngredients | null>(null);
    const [addedIngredientIDs, setAddedIngredientIDs] = useState<string[]>([]);
    const [removedIngredientIDs, setRemovedIngredientIDs] = useState<string[]>([]);
    const [allIngredientsErrorCode, setAllIngredientsErrorCode] = useState<number | null>(null);
    const [userIngredientsErrorCode, setUserIngredientsErrorCode] = useState<number | null>(null);
    const [selectedList, setSelectedList] = useState<'All' | 'Owned'>('All');
    const [searchString, setSearchString] = useState<string>('');
    const [allIngredientsSearchResults, setAllIngredientsSearchResults] = useState<CategorizedIngredients | null>(null);
    const [userIngredientsSearchResults, setUserIngredientsSearchResults] = useState<CategorizedIngredients | null>(null);

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

    // Build Search Results
    const loadSearchResults = (userIngredients?: CategorizedIngredients | null) => {
        if(userIngredients === null || userIngredients === undefined) {
            userIngredients = categorizedUserIngredientsList;
        }

        // All Ingredients Search Results
        const allResults = buildIngredientsSearchResults(ingredientsList, searchString)

        if(allResults !== null) {
            setAllIngredientsSearchResults(allResults);  
        }

        // User Ingredients Search Results
        const userResults = buildIngredientsSearchResults(userIngredients, searchString)

        if(userResults !== null) {
            setUserIngredientsSearchResults(userResults);  
        }
    }

    const loadIngredientsLists = async () => {
        checkLoggedIn();
        getIngredientsCategorized(setAllIngredientsErrorCode, 
            (ingredients: CategorizedIngredients) => {
                setIngredientsList(ingredients);
                setAllIngredientsSearchResults(ingredients);
            });
        getUserIngredients(setUserIngredientsErrorCode, 
            (ingredients: string[]) => {setUserIngredientIDs(ingredients)},
            checkLoggedIn);
    }

    // Load list on pageload
    useEffect(() => {
        setIsLoading(true);
        loadIngredientsLists();
    }, []);

    // Check if received lists
    useEffect(() => {
        if(ingredientsList != null && userIngredientIDs != null) {
            markUserIngredients();
            const restructuredUserList = restructureUserList(userIngredientIDs, ingredientsList);
            setCategorizedUserIngredientsList(restructuredUserList);
            if(userIngredientsSearchResults === null) {
               setUserIngredientsSearchResults(restructuredUserList); 
            } else {
              loadSearchResults(restructuredUserList);  
            }
            setIsLoading(false);
        }
    }, [ingredientsList, userIngredientIDs])

    useEffect(() => {
        loadSearchResults();
    }, [searchString]);

    // Add ingredient to user's list
    const addUserIngredient = (ingredientID: string) => {
        addIngredient(ingredientID, removedIngredientIDs, setRemovedIngredientIDs, 
            addedIngredientIDs, setAddedIngredientIDs, userIngredientIDs, 
            setUserIngredientIDs);
    }

    // Remove ingredient from user's list
    const removeUserIngredient = (ingredientID: string) => {
        removeIngredient(ingredientID, removedIngredientIDs, setRemovedIngredientIDs, 
            addedIngredientIDs, setAddedIngredientIDs, userIngredientIDs, 
            setUserIngredientIDs);
    }

    // Save ingredient list changes
    const saveUserIngredients = async () => {
        await saveIngredients(checkLoggedIn, removedIngredientIDs, setRemovedIngredientIDs, 
            addedIngredientIDs, setAddedIngredientIDs, setUserIngredientIDs, 
            setIsSaving, setIsLoading, setUserIngredientsErrorCode);
    }

    return isSaving ? (
        <Heading pt={10}>Saving Ingredients...</Heading>
    ) : isLoading ? (
        <Heading pt={10}>Loading Ingredients...</Heading>
    ) : allIngredientsSearchResults !== null && userIngredientsSearchResults !== null && userIngredientsErrorCode === null && allIngredientsErrorCode === null ? (
        <Stack h='100%' w='100%'  px={10}>
            <Heading size='lg' mt={10} px={4}>Let us know what you have in your kitchen</Heading>
            <Flex w='100%' justifyContent='center' pt={6} pb={6}>
                <Button type='submit' w='100%' maxW={700} onClick={saveUserIngredients} boxShadow='sm' 
                        backgroundColor={"#b7e0ff"} _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                        _focus={{outline: "none"}}>
                    Save Ingredients
                </Button>
            </Flex>
            <SearchBar setSearch={setSearchString} placeholderText="Search For Ingredients" />
            <Stack direction={'row'} h='85%' w='100%' maxW={1500} spacing={4} px={10} 
                    display={['none', 'none', 'flex', 'flex']} 
                    style={{marginLeft: 'auto', marginRight: 'auto', marginTop: -10}}>
                <Stack w='100%' h='100%' mt={12}>
                    <Heading size='md'>All Ingredients</Heading>
                    <Box w='100%' h='100%'>
                        <IngredientsList ingredientsList={allIngredientsSearchResults} addIngredient={addUserIngredient} removeIngredient={removeUserIngredient}/>
                    </Box> 
                </Stack>
                <Stack w='100%' h='100%' style={{marginTop: '3em'}}>
                    <Heading size='md'>My Ingredients</Heading>
                    <Box w='100%' h='100%'>
                        <IngredientsList ingredientsList={userIngredientsSearchResults} addIngredient={addUserIngredient} removeIngredient={removeUserIngredient}/>
                    </Box>
                </Stack>
            </Stack>
            <Stack h='85%' w={'100%'} spacing={4} display={['flex', 'flex', 'none', 'none']} pt={6}>
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
                        <IngredientsList ingredientsList={allIngredientsSearchResults} addIngredient={addUserIngredient} removeIngredient={removeUserIngredient}/>
                    </Box>
                ) : (
                    <Box w='100%' h='100%'>
                        <IngredientsList ingredientsList={userIngredientsSearchResults} addIngredient={addUserIngredient} removeIngredient={removeUserIngredient}/>
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