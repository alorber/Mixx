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
import { FormPasswordInput, FormSubmitButton, FormTextInput } from '../../ui/StyledFormFields/StyledFormFields';
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
                                    <FormTextInput value={formValues.firstName} onChange={(v: string) => {updateForm('firstName', v)}}
                                        label={"First Name"} type="name" placeholder='Laura' ariaLabel='First Name' />
                                    {/* Last Name Field */}
                                    <FormTextInput value={formValues.lastName} onChange={(v: string) => {updateForm('lastName', v)}}
                                        label={"Last Name"} type="name" placeholder='Sparks' ariaLabel='Last Name' />
                                </>}
                                {/* Email Field */}
                                <FormTextInput value={formValues.email} onChange={(v: string) => {updateForm('email', v)}}
                                    label="Email Address" type='email' placeholder='LauraSparks@mixx.com'
                                    ariaLabel='Email' />
                                {/* Password Field */}
                                <FormPasswordInput value={formValues.password} 
                                    onChange={(v: string) => {updateForm('password', v)}} 
                                    showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />
                                {/* Submit Button */}
                                <FormSubmitButton isLoading={isLoading} label={formType === "Signup" ? "Create Account" : "Login"} />
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
