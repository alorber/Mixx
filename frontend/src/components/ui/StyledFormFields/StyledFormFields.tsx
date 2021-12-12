import React from 'react';
import { Alert, AlertDescription, AlertIcon, Box, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { isLoggedIn } from '../../../services/api';

// Text Input
export type FormTextInputProps = {
    value: string,
    onChange: (v: string) => void,
    label: string,
    type: string,
    placeholder: string,
    ariaLabel: string
}

export const FormTextInput = ({value, onChange, label, type, placeholder, ariaLabel}: FormTextInputProps) => {
    return (
        <FormControl isRequired>
            <FormLabel>{label}</FormLabel>
            <Input type={type} placeholder={placeholder} value={value}
                aria-label={ariaLabel}  borderColor="#b7e0ff" _hover={{borderColor: "#2395FF"}}
                onChange={e => onChange(e.currentTarget.value)} focusBorderColor="#2395ff"/>
        </FormControl>
    );
}

// Password Input
export type FormPasswordInputProps = {
    value: string,
    onChange: (v: string) => void,
    showPassword: boolean,
    togglePasswordVisibility: () => void,
    label?: string
}

export const FormPasswordInput = (
    {value, onChange, showPassword, togglePasswordVisibility, label="Password"}: FormPasswordInputProps
) => {
    return (
        <FormControl isRequired>
            <FormLabel>{label}</FormLabel>
            <InputGroup>
                <Input type={showPassword ? "text" : "password"}
                    placeholder="*******" value={value}
                    aria-label="Password" borderColor="#b7e0ff" _hover={{borderColor: "#2395FF"}}
                    onChange={e => onChange(e.currentTarget.value)}/>
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={togglePasswordVisibility}
                            _hover={{boxShadow: 'md', backgroundColor: "#FFFFFF",
                            color: "#2395FF", border: "1px solid #2395FF"}}
                            backgroundColor={"#b7e0ff"} focusBorderColor="#b7e0ff"
                            _focus={{outline: "none"}}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
    );
}

// Submit Button
export type FormSubmitButtonProps = {
    isLoading: boolean,
    label: string,
    isLogout?: boolean,
    onClick?: () => void
}

export const FormSubmitButton = ({isLoading, label, isLogout= false, onClick}: FormSubmitButtonProps) => {
    return (
        <Button width="full" type="submit" boxShadow='sm' 
                backgroundColor={isLogout ? "#E5A5A6" : "#b7e0ff"}
                _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                _focus={{outline: "none"}} isLoading={isLoading} 
                onClick={onClick} >
            {label}
        </Button>
    );
}

// Error Message
export type FormErrorMessageProps = {
    errorCode: number,
    isLoggedIn?: boolean
}
export const FormErrorMessage = ({errorCode, isLoggedIn = false}: FormErrorMessageProps) => {
    const errorCodeToMessage: {[code: number]: string} = {
        460: "It looks like you already have an account.",
        461: "Please enter a valid email & password.",
        462: isLoggedIn ? "Incorrect Password." : "Please enter a valid email & password.",
        500: "We seem to be having some trouble right now."
    }
  
    return (
      <Box my={4}>
        <Alert status={'error'} borderRadius={4}>
          <AlertIcon />
          <AlertDescription>{errorCodeToMessage[errorCode]}</AlertDescription>
        </Alert>
      </Box>
    );
}

// Success Message
export type FormSuccessMessageProps = {
    message: string,
}

export const FormSuccessMessage = ({message}: FormSuccessMessageProps) => {

    return (
        <Box my={4}>
        <Alert status={'success'} borderRadius={4}>
          <AlertIcon />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </Box>
    );
}
