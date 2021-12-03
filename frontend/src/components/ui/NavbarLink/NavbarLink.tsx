import * as React from 'react';
import {
    Box,
    Flex,
    Icon,
    Link,
    Stack,
    Text
    } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';

type NavbarLinkProps = {
    linkTo: string;  // URL to link to
    onPageChange?: () => void;
    isSubNav?: boolean;  // Nav in sub-menu
    showDropdownIcon?: boolean;  // For mobile nav items
    isDropdownOpen?: boolean  // Used if showDropdownIcon is used
    children: React.ReactNode;
}

const NavbarLink = ({linkTo, onPageChange = () => {}, isSubNav = false, showDropdownIcon = false, 
                    isDropdownOpen = false, children}: NavbarLinkProps) => {
    return isSubNav ? (
        <Link as={RouterLink} to={linkTo} onClick={onPageChange} _focus={{outline: "none"}}
            role={'group'} display={'block'} p={2} rounded={'md'} w={'100%'}
            _hover={{textDecoration: "none", bg: "#eaf6ff"}}>
            <Stack direction={'row'} align={'center'}>
                {/* Link Label */}
                <Box>
                    <Text transition={'all .3s ease'} _groupHover={{color: '#2395ff'}} fontWeight={500}>
                        {children}
                    </Text>
                </Box>
                {/* Arrow Icon */}
                <Flex transition={'all .3s ease'} transform={'translateX(-10px)'} opacity={0}
                        _groupHover={{opacity: '100%', transform: "translateX(0)"}} justify={'flex-end'}
                        align={'center'} flex={1}>
                    <Icon color={'#2395ff'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    ) : (
        <Link as={RouterLink} to={linkTo} onClick={onPageChange} _focus={{outline: "none"}}
                _hover={{textDecoration: "none", color: "#2395ff"}} fontWeight={500}>
            <Stack direction='row'>
                {/* Link Label */}
                <Text display="block" mr='auto'>
                    {children}
                </Text>
                {/* Arrow Icon for Dropdown Menu */}
                {showDropdownIcon && (
                    <Icon as={ChevronDownIcon} transition={'transform .25s ease-in-out'}
                        transform={isDropdownOpen ? 'rotate(180deg)' : ''} w={6} h={6} />
                )}
            </Stack>   
        </Link>
    );
};

export default NavbarLink;
