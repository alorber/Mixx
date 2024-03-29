import React from 'react';
import { Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';


type ThemedButtonProps = {
    label: string,
    routeTo: string,
    onClick?: () => void
    width?: string | number
};

const ThemedButton = ({label, routeTo, onClick, width}:  ThemedButtonProps) => {

    return (
        <Button as={RouterLink} to={routeTo} onClick={onClick} boxShadow='sm' backgroundColor={"#b7e0ff"} 
                _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} _focus={{outline: "none"}}
                width={width}>
            {label}
        </Button>
    );
}

export default ThemedButton;