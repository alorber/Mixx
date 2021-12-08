import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {Button} from '@chakra-ui/react';


type ThemedButtonProps = {
    label: string,
    routeTo: string,
    onClick?: () => void
};

const ThemedButton = ({label, routeTo, onClick}:  ThemedButtonProps) => {

    return (
        <Button as={RouterLink} to={routeTo} onClick={onClick} boxShadow='sm' backgroundColor={"#b7e0ff"} 
                _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} _focus={{outline: "none"}}>
            {label}
        </Button>
    );
}

export default ThemedButton;