import React from 'react';
import {
    Button,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Tooltip
    } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { FaCocktail, FaGlassMartini } from 'react-icons/fa';
import { GiBrandyBottle } from 'react-icons/gi';
import { useState } from 'react';

type SearchType = "CocktailName" | "Ingredient" | "Glassware";

type SearchBarProps = {
    setSearch: (s: string) => void,
    searchTypes?: SearchType[],
    setSearchTypes?: (s: SearchType[]) => void,
    placeholderText: string
};

const SearchBar = ({setSearch, searchTypes, setSearchTypes, placeholderText}: SearchBarProps) => {
    const [searchString, setSearchString] = useState<string>('');

    const submitSearch = () => {
        setSearch(searchString);
    }

    const clearSearch = () => {
        setSearchString(''); 
        setSearch('');
    }

    const toggleSearchType = (searchType: SearchType) => {
        if(setSearchTypes === undefined || searchTypes === undefined) {
            return;
        }
        
        if(searchTypes.includes(searchType)) {
            // If none selected, reselect all
            if(searchTypes.length === 1) {
                setSearchTypes(["CocktailName", "Glassware", "Ingredient"]);
            } else {
               setSearchTypes(searchTypes.filter(s => s !== searchType)); 
            }
        }
        else {
            setSearchTypes([...searchTypes, searchType]);
        }
    }

    return (
        <Stack w='100%' maxW={700} style={{marginRight: 'auto', marginLeft: 'auto'}}>
            {/* Search Bar */}
            <Stack direction='row' w='100%'>
                <InputGroup>
                    <Input placeholder={placeholderText} aria-label="Search" borderColor="#b7e0ff" 
                        _hover={{borderColor: "#2395FF"}} value={searchString} w='100%'
                        onChange={e => setSearchString(e.currentTarget.value)} 
                        onKeyDown={(e) => {if(e.key == 'Enter') {submitSearch();}}} /> 
                    {searchString.length > 0 && (
                        <InputRightElement>
                        <IconButton _hover={{boxShadow: 'md', backgroundColor: "#FFFFFF", color: "#2395FF", 
                            border: "1px solid #2395FF"}} backgroundColor={"#b7e0ff"} focusBorderColor="#b7e0ff"
                            _focus={{outline: "none"}} aria-label="Clear Search" 
                            icon={<CloseIcon />} size='sm' onClick={clearSearch} >
                        </IconButton>
                    </InputRightElement>
                    )}
                </InputGroup>
                <Button _hover={{boxShadow: 'md', backgroundColor: "#FFFFFF",
                        color: "#2395FF", border: "1px solid #2395FF"}}
                        backgroundColor={"#b7e0ff"} focusBorderColor="#b7e0ff"
                        _focus={{outline: "none"}} onClick={submitSearch} >
                    Search
                </Button>
            </Stack>
            {/* Search Types */}
            {setSearchTypes !== undefined && searchTypes !== undefined && (
                <Stack w='100%' direction='row' borderWidth={1} borderRadius={8} borderColor="#b7e0ff" p={2}>
                    <Heading size='sm' textAlign='left' alignSelf='center' pl={2}>Search: (click to toggle)</Heading>
                    {/* Desktop */}
                    <Stack display={{base: 'None', md: 'flex'}} direction='row' pl={4} spacing={2}>
                        <DesktopButton searchType={"CocktailName"} searchTypes={searchTypes} toggleType={toggleSearchType}
                            searchText={"Cocktail Name"} />
                        <DesktopButton searchType={"Ingredient"} searchTypes={searchTypes} toggleType={toggleSearchType}
                        searchText={"Ingredients"} />
                        <DesktopButton searchType={"Glassware"} searchTypes={searchTypes} toggleType={toggleSearchType}
                        searchText={"Glassware"} />
                    </Stack>
                    
                    {/* Mobile */}
                    <Stack display={{base: 'flex', md: 'None'}} direction='row' pl={4} spacing={2}>
                        <MobileButton searchType={"CocktailName"} searchTypes={searchTypes} toggleType={toggleSearchType}
                            searchText={"Cocktail Name"} />
                        <MobileButton searchType={"Ingredient"} searchTypes={searchTypes} toggleType={toggleSearchType}
                        searchText={"Ingredients"} />
                        <MobileButton searchType={"Glassware"} searchTypes={searchTypes} toggleType={toggleSearchType}
                        searchText={"Glassware"} />
                    </Stack>
                </Stack>
            )}
        </Stack>
    );
}

type SearchTypeButtonProps = {
    searchType: SearchType, 
    searchTypes: SearchType[],
    toggleType: (type: SearchType) => void,
    searchText: string
}
const getSearchTypeIcon = (searchType: SearchType) => {
    const iconSize = 20;
    const icon = searchType === "CocktailName" ? <FaCocktail size={iconSize}/> 
        : searchType === "Glassware" ? <FaGlassMartini size={iconSize}/>
        : <GiBrandyBottle size={iconSize}/>;
    return icon;
}
const DesktopButton = ({searchType, searchTypes, toggleType, searchText}: SearchTypeButtonProps) => {
    return (
        <Button _focus={{ outline: "none" }} borderRadius={10} borderColor={"#b7e0ff"}
            borderWidth={1} backgroundColor={searchTypes.includes(searchType) ? "#b7e0ff" : '#FFFFFF'}
            aria-label={searchType} leftIcon={getSearchTypeIcon(searchType)} 
            onClick={() => {toggleType(searchType)}} >
           {searchText}
       </Button>
    );
}
const MobileButton = ({searchType, searchTypes, toggleType, searchText}: SearchTypeButtonProps) => {
    return (
        <Tooltip label={searchText}>
            <IconButton _focus={{ outline: "none" }} borderRadius={10} borderColor={"#b7e0ff"} 
                borderWidth={1} backgroundColor={searchTypes.includes(searchType) ? "#b7e0ff" : '#FFFFFF'}
                aria-label={searchType} icon={getSearchTypeIcon(searchType)} 
                onClick={() => {toggleType(searchType)}} />     
        </Tooltip>
    );
}

export default SearchBar;