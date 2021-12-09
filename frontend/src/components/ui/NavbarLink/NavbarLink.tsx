import * as React from 'react';
import StyledListItem from '../StyledListItem/StyledListItem';
import { Link } from '@chakra-ui/react';
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
            <StyledListItem >
                {children}
            </StyledListItem> 
        </Link>
    ) : (
        <Link as={RouterLink} to={linkTo} onClick={onPageChange} _focus={{outline: "none"}}
                _hover={{textDecoration: "none", color: "#2395ff"}} fontWeight={500}>
            <StyledListItem isItemDropdown={true} showDropdownIcon={showDropdownIcon}
                    isDropdownOpen={isDropdownOpen}>
                {children}
            </StyledListItem>
        </Link>
    );
};

export default NavbarLink;
