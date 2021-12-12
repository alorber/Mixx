import React from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement } from '@chakra-ui/react';

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