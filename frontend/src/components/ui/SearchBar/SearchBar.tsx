import { CloseIcon } from "@chakra-ui/icons";
import { Input, Stack, Button, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import React from "react";
import { useState } from 'react';

type SearchBarProps = {
    setSearch: (s: string) => void,
};

const SearchBar = ({setSearch}: SearchBarProps) => {
    const [searchString, setSearchString] = useState<string>('');

    const submitSearch = () => {
        setSearch(searchString);
    }

    return (
        <Stack direction='row' w='100%' maxW={700} style={{marginRight: 'auto', marginLeft: 'auto'}}>
            <InputGroup>
                <Input placeholder="Search For Ingredients" aria-label="Search" borderColor="#b7e0ff" 
                    _hover={{borderColor: "#2395FF"}} value={searchString} w='100%'
                    onChange={e => setSearchString(e.currentTarget.value)} 
                    onKeyDown={(e) => {if(e.key == 'Enter') {submitSearch();}}} /> 
                {searchString.length > 0 && (
                    <InputRightElement>
                    <IconButton _hover={{boxShadow: 'md', backgroundColor: "#FFFFFF", color: "#2395FF", 
                        border: "1px solid #2395FF"}} backgroundColor={"#b7e0ff"} focusBorderColor="#b7e0ff"
                        _focus={{outline: "none"}} aria-label="Clear Search" 
                        icon={<CloseIcon />} size='sm' onClick={() => {setSearchString(''); setSearch('');}} >
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
    );
}

export default SearchBar;