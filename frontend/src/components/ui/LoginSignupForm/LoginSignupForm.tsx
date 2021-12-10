import {
    Alert,
    AlertDescription,
    AlertIcon,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Link,
    Stack
    } from '@chakra-ui/react';
import { login, signup } from '../../../services/api';
import { useState } from 'react';

type FormTypes = "Login" | "Signup";

const LoginSignupForm = ({updateLoggedIn}: {updateLoggedIn: (l: boolean) => void}) => {
    const [formValues, setFormValues] = useState({firstName: '', lastName: '', email: '', password: ''})
    const [showPassword, setShowPassword] = useState(false);
    const [formType, setFormType] = useState<FormTypes>("Login");
    const [isLoading, setIsLoading] = useState(false);
    const [errorCode, setErrorCode] = useState<number | null>(null)
    
    const clearForm = () => {setFormValues({firstName: '', lastName: '', email: '', password: ''})}
    const updateForm = (field: keyof typeof formValues, value: string) => {
      const newForm = {...formValues};
      newForm[field] = value;
      setFormValues(newForm);
    };
    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    // Makes API Call on button click
    const onSubmit = async () => {
      setIsLoading(true);

      const resp = formType === "Signup" 
        ? await signup(formValues.email, formValues.password, formValues.firstName, formValues.lastName)
        : await login(formValues.email, formValues.password);

        if(resp.status === "Success") {
            // Updates page
            setErrorCode(null);
            setIsLoading(false);
            updateLoggedIn(true);
        }
        // Error
        else {
            // Clears saved values
            clearForm()
            setErrorCode(resp.errorCode)
        }
        setIsLoading(false);
    }

    const headerText = formType === "Signup" ? "Sign Up" : "Welcome Back";

    return (
        <Stack mx={8} mt={10}>
            <Box textAlign="center" mb={6}>
                <Heading>{headerText}</Heading>
            </Box>
            <Flex width="full" style={{margin: '0'}} h={'100%'} justifyContent="center">
                <Box p={8} w={1000} h={'fit-content'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff ">
                    <Box textAlign="left">
                        <form onSubmit={e => {e.preventDefault(); onSubmit()}}>
                            <Stack spacing={4}>
                                {/* Error Message */}
                                {errorCode !== null && <FormErrorMessage errorCode={errorCode} /> }
                                {formType === 'Signup' && <>
                                    {/* First Name Field */}
                                    <FormControl isRequired>
                                        <FormLabel>First Name</FormLabel>
                                        <Input type="name" placeholder="Laura" value={formValues.firstName}
                                            aria-label="Email"  borderColor="#b7e0ff" _hover={{borderColor: "#2395FF"}}
                                            onChange={e => updateForm('firstName', e.currentTarget.value)}
                                            focusBorderColor="#2395ff"/>
                                    </FormControl>
                                    {/* Last Name Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input type="name" placeholder="Sparks" value={formValues.lastName}
                                            aria-label="Email"  borderColor="#b7e0ff" _hover={{borderColor: "#2395FF"}}
                                            onChange={e => updateForm('lastName', e.currentTarget.value)}
                                            focusBorderColor="#2395ff"/>
                                    </FormControl>
                                </>}
                                {/* Email Field */}
                                <FormControl isRequired>
                                    <FormLabel>Email Address</FormLabel>
                                    <Input type="email" placeholder="LauraSparks@mixx.com" value={formValues.email}
                                        aria-label="Email"  borderColor="#b7e0ff" _hover={{borderColor: "#2395FF"}}
                                        onChange={e => updateForm('email', e.currentTarget.value)}
                                        focusBorderColor="#2395ff"/>
                                </FormControl>
                                {/* Password Field */}
                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup>
                                        <Input type={showPassword ? "text" : "password"}
                                            placeholder="*******" value={formValues.password}
                                            aria-label="Password" borderColor="#b7e0ff" _hover={{borderColor: "#2395FF"}}
                                            onChange={e => updateForm('password', e.currentTarget.value)}/>
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
                                {/* Submit Button */}
                                <Button width="full"
                                        type="submit" boxShadow='sm' backgroundColor={"#b7e0ff"}
                                        _hover={{boxShadow: 'md'}} _active={{boxShadow: 'lg'}} 
                                        _focus={{outline: "none"}} isLoading={isLoading}>
                                    {formType === "Signup" ? "Create Account" : "Login"}
                                </Button>
                                {/* Switch Form Type (Between login & signup) */}
                                <FormSwitchText formType={formType} setFormType={setFormType} setErrorCode={setErrorCode}/>
                            </Stack>
                        </form>
                    </Box>
                </Box>
            </Flex>
        </Stack>
    );
};

// Error Message
const FormErrorMessage = ({errorCode}: {errorCode: number}) => {
  const errorCodeToMessage: {[code: number]: string} = {
    460: "It looks like you already have an account.",
    461: "Please enter a valid email & password.",
    462: "Please enter a valid email & password."
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

// Button to switch forms (login <--> signup)
type FormSwitchTextProps = {
  formType: FormTypes, 
  setFormType: (f: FormTypes) => void, 
  setErrorCode: (e: number | null) => void
}
  
const FormSwitchText = ({formType, setFormType, setErrorCode}: FormSwitchTextProps) => {
  const formSwitchText = formType === "Signup" ? "Already have an account?"
                                                : "Don't have an account?";

  const newFormType = formType === "Signup" ? "Login" : "Signup";
  const onFormSwitchTextClick = () => {setFormType(newFormType); setErrorCode(null)};
  return (
    <Link textAlign="center" _hover={{textDecoration: 'None'}}
        onClick={e => {e.preventDefault(); onFormSwitchTextClick();}}>
      {formSwitchText}
    </Link>
  );
}

export default LoginSignupForm;
