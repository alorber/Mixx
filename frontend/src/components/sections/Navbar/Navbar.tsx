import * as React from 'react';
import NavbarLink from '../../ui/NavbarLink/NavbarLink';
import { CloseIcon, HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { NAVBAR_ITEMS } from './NavbarItems';
import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  IconButton,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import type { NavbarItem } from './NavbarItems';

type NavbarProps = {
  isLoggedIn: boolean;
};

const Navbar = ({ isLoggedIn }: NavbarProps) => {
  const { isOpen, onToggle: toggleNavbar, onClose: closeNavbar } = useDisclosure();

  return (
    <Box>
      <Flex w={'fill'} minH={'60px'} py={{ base: 2 }} px={{ base: 4 }} borderBottom={"solid #cfcdcc .5px"}
        backgroundColor={"#ffffff"} align={'center'}>
        {/* Hamburger Menu (Mobile) */}
        <Flex flex={{ base: 1, md: 'auto' }} ml={{ base: -2 }} display={{ base: 'flex', md: 'none' }}>
          <IconButton onClick={toggleNavbar} _focus={{ outline: "none" }}
            icon={isOpen ? <CloseIcon boxSize={4} /> : <HamburgerIcon boxSize={6} color={'#2395ff'} />}
            aria-label={'Navbar Toggle'} backgroundColor={'#eaf6ff'}
            _hover={{ backgroundColor: '#b7e0ff' }} />
        </Flex>
        {/* Logo & Desktop Links */}
        <Flex flex={{ base: 1 }}>
          {/* Logo / Home Button */}
          <Flex justifySelf={{ base: 'center', md: 'left' }}>
            <NavbarLink linkTo={"/"} onPageChange={closeNavbar}>
              <Image src="images/Cocktail_Shaker.png" width="3em" />
            </NavbarLink>
          </Flex>
          {/* Desktop Navbar Links */}
          <Flex display={{ base: 'none', md: 'flex' }} h='fill' ml={'auto'}>
            <DesktopNavbarItems isLoggedIn={isLoggedIn} />
          </Flex>
          {/* Sign In Button on Mobile */}
          { !isLoggedIn && (
            <Flex alignItems='center' ml='auto' display={{base: 'flex', md: 'none'}}>
              <SignInButton closeNavbar={closeNavbar} />
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* Mobile Dropdown Menu */}
      <Collapse in={isOpen} animateOpacity>
        <MobileNavbarItems closeNavbar={closeNavbar} />
      </Collapse>
    </Box>
  );
};

// Navbar Items for Desktop
const DesktopNavbarItems = ({ isLoggedIn }: NavbarProps) => {
  return (
    <Stack spacing={[4, 4, 10, 20]} align="center" justify={"flex-end"}
      direction={"row"} pr={4}>
      {NAVBAR_ITEMS.map((navbarItem: NavbarItem) => (
        <Box key={navbarItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'}>
            <PopoverTrigger>
              <div>
                <NavbarLink linkTo={navbarItem.href ?? '#'}>{navbarItem.label}</NavbarLink>
              </div>
            </PopoverTrigger>

            {navbarItem.children && (
              <PopoverContent border={0} boxShadow={'xl'} p={4} rounded={'xl'} minW={'sm'}>
                <Stack>
                  {navbarItem.children.map((child) => (
                    <NavbarLink key={child.label} linkTo={child.href ?? '#'} isSubNav={true}>{child.label}</NavbarLink>
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
      {isLoggedIn
        ? (
            <NavbarLink linkTo={"/settings"}>
              <Icon color={'#2395ff'} w={5} h={5} as={SettingsIcon} 
                  _hover={{ transform: "rotate(45deg)", transition: 'all .25s ease-in' }}
                  transform={'rotate(-45deg)'} transition={'all .25s ease'} />
            </NavbarLink>
          )
        : (
          <SignInButton />
        )
      }
    </Stack>
  );
}

// Navbar Items for Mobile
const MobileNavbarItems = ({ closeNavbar }: { closeNavbar: () => void }) => (
  <Stack p={4} display={{ md: 'none' }}>
    {NAVBAR_ITEMS.map((navbarItem: NavbarItem) => (
      <MobileNavbarItem key={navbarItem.label} navbarItem={navbarItem} closeNavbar={closeNavbar} />
    ))}
    <MobileNavbarItem navbarItem={{ label: 'Settings', href: '/settings' }} closeNavbar={closeNavbar} />
  </Stack>
)

// Seperate component for useDisclosure()
const MobileNavbarItem = ({ navbarItem, closeNavbar }: { navbarItem: NavbarItem, closeNavbar: () => void }) => {
  const { isOpen, onToggle, onClose: closeSubmenu } = useDisclosure();
  const hasChildren = (navbarItem.children ?? []).length > 0;

  return (<>
    <Stack spacing={4} onClick={navbarItem.children && onToggle}>
      <NavbarLink linkTo={navbarItem.href ?? '#'} showDropdownIcon={hasChildren}
        isDropdownOpen={isOpen} onPageChange={hasChildren ? () => { } : () => { closeNavbar(); closeSubmenu() }}>
        {navbarItem.label}
      </NavbarLink>
    </Stack>

    {/* Dropdown Menu */}
    <Collapse in={isOpen} animateOpacity>
      <Stack pl={4} borderLeft={"solid #cfcdcc .5px"} align='start'>
        {navbarItem.children && (
          navbarItem.children.map((child) => (
            <NavbarLink key={child.label} linkTo={child.href ?? '#'} isSubNav={true} 
                onPageChange={() => { closeNavbar(); closeSubmenu() }}>
              {child.label}
            </NavbarLink>
          ))
        )}
      </Stack>
    </Collapse>
  </>)
}

// Sign In Button
const SignInButton = ({closeNavbar}: {closeNavbar?: () => void}) => {
  return (
    <Button as={RouterLink} to={'/login'} onClick={closeNavbar} boxShadow='sm' backgroundColor={"#b7e0ff"} 
        _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} _focus={{outline: "none"}}>
      Sign In
    </Button>
  );
}

export default Navbar;
