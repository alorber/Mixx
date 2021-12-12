import React from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FormErrorMessage, FormPasswordInput, FormSubmitButton, FormSuccessMessage, FormTextInput } from '../../ui/StyledFormFields/StyledFormFields';
import { deleteAccount, getName, logout, updateEmail, updateName, updatePassword } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

type SettingsLayoutProps = {
    checkLoggedIn: () => void
}
const SettingsLayout = ({checkLoggedIn}: SettingsLayoutProps) => {

    useEffect(() => {
        checkLoggedIn();
    }, [])

    return (
        <Stack mx={8} pt={10} px={6} pb={14}>
            <Box textAlign="center" mb={6}>
                <Heading>Settings</Heading>
            </Box>
            <Stack spacing={6}>
                <LogoutButton checkLoggedIn={checkLoggedIn} />
                <UpdateNameForm />
                <UpdateEmailForm />
                <UpdatePasswordForm />
                <DeleteAccountForm checkLoggedIn={checkLoggedIn} />
            </Stack>
        </Stack>
    );
}

export default SettingsLayout;

// Settings Layout Form Template
type SettingsLayoutFormProps = {
    title: string,
    onSubmit: () => void,
    errorCode: number | null,
    successMessage?: string | null,
    children: React.ReactNode
}
const SettingsLayoutForm = (
    {title, onSubmit, errorCode, successMessage = null, children}: SettingsLayoutFormProps
) => {
    return (
        <Stack p={8} w='100%' maxW={1000} h={'fit-content'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff"
                style={{marginLeft: 'auto', marginRight: 'auto'}} >
            <Heading size={'lg'}>{title}</Heading>
            <form onSubmit={e => {e.preventDefault(); onSubmit()}}>
                <Stack spacing={4}>
                    {/* Error / Success Message */}
                    {successMessage !== null ? <FormSuccessMessage message={successMessage} />
                        : errorCode !== null ? <FormErrorMessage errorCode={errorCode} isLoggedIn /> 
                        : null}
                    {children}
                </Stack>
            </form>
        </Stack>
    );
}

const updateForm = (formValues: {[key: string]: string}, newValue: string, fieldToChange: string) => {
    const newForm = {...formValues};
    newForm[fieldToChange] = newValue;
    return newForm;
};

// Update Name
const UpdateNameForm = () => {
    const [formValues, setFormValues] = useState<{[key: string]: string}>({firstName: '', lastName: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [oldName, setOldName] = useState<{[key: string]: string}>({firstName: '', lastName: ''});
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [wasSuccess, setWasSuccess] = useState(false);

    const getOldName = async () => {
        const resp = await getName();
        if(resp.status === "Success") {
            setOldName({firstName: resp.firstName, lastName: resp.lastName});
            setFormValues({firstName: resp.firstName, lastName: resp.lastName})
        }
    }

    useEffect(() => {
        getOldName();
    }, []);

    const onSubmit = async () => {
        const resp = await updateName(formValues.firstName, formValues.lastName);
        if(resp.status === "Success") {
            setErrorCode(null);
            setWasSuccess(true);
            setOldName(JSON.parse(JSON.stringify(formValues)))
        } else {
            setErrorCode(resp.errorCode);
            setWasSuccess(false);
            setFormValues(JSON.parse(JSON.stringify(oldName)));
        }
    }

    const successMessage = "Name was successfully changed";

    return (
        <SettingsLayoutForm title="Update Name" onSubmit={onSubmit} errorCode={errorCode}
                successMessage={wasSuccess ? successMessage : null} >
            {/* First Name Field */}
            <FormTextInput value={formValues.firstName} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'firstName'))}}
                label={"First Name"} type="name" placeholder='Laura' ariaLabel='First Name' />
            {/* Last Name Field */}
            <FormTextInput value={formValues.lastName} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'lastName'))}}
                label={"Last Name"} type="name" placeholder='Sparks' ariaLabel='Last Name' />
            <FormSubmitButton isLoading={isLoading} label="Update Name" />
        </SettingsLayoutForm>
    );
}

// Update Email
const UpdateEmailForm = () => {
    const [formValues, setFormValues] = useState<{[key: string]: string}>({newEmail: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [wasSuccess, setWasSuccess] = useState(false);

    const onSubmit = async () => {
        setIsLoading(true);

        const resp = await updateEmail(formValues.newEmail, formValues.password);

        if(resp.status === "Success") {
            setErrorCode(null);
            setWasSuccess(true);
            setFormValues({newEmail: '', password: ''});
        } else {
            setErrorCode(resp.errorCode);
            setWasSuccess(false);
        }
        setIsLoading(false);
    }

    const successMessage = "Email was successfully changed";

    return (
        <SettingsLayoutForm title="Update Email" onSubmit={onSubmit} errorCode={errorCode} 
                successMessage={wasSuccess ? successMessage : null}>
            {/* Email Field */}
            <FormTextInput value={formValues.newEmail} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'newEmail'))}}
                label={"New Email Address"} type="email" placeholder='LauraSpark@Mixx.com' ariaLabel='Email' />
            {/* Password Field */}
            <FormPasswordInput value={formValues.password} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'password'))}} 
                showPassword={showPassword} togglePasswordVisibility={() => {setShowPassword(!showPassword)}} />
            <FormSubmitButton isLoading={isLoading} label="Update Email" />
        </SettingsLayoutForm>
    );
}


// Update Password
const UpdatePasswordForm = () => {
    const [formValues, setFormValues] = useState<{[key: string]: string}>({oldPassword: '', newPassword1: '', newPassword2: ''});
    const [showPasswords, setShowPassword] = useState<{[key: string]: boolean}>({oldPassword: false, newPassword1: false, newPassword2: false})
    const [isLoading, setIsLoading] = useState(false);
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const [wasSuccess, setWasSuccess] = useState(false);

    const togglePasswordVisibility = (field: string) => {
        const passwords = {...showPasswords};
        passwords[field] = !passwords[field];
        setShowPassword(passwords);
    }

    const onSubmit = async () => {
        setIsLoading(true);

        // Passwords don't match
        if(formValues.newPassword1 !== formValues.newPassword2) {
            setErrorCode(480);
            setWasSuccess(false);
        } 
        else {
            const resp = await updatePassword(formValues.oldPassword, formValues.newPassword1);
            if(resp.status === "Success") {
                // New password is same as old
                if(formValues.newPassword1 === formValues.oldPassword) {
                    setErrorCode(481);
                    setWasSuccess(false);
                } else {
                    setErrorCode(null);
                    setWasSuccess(true);
                    setFormValues({oldPassword: '', newPassword1: '', newPassword2: ''});
                }
            } else {
                setErrorCode(resp.errorCode);
                setWasSuccess(false);
            }
        }

        setIsLoading(false);
    }

    const successMessage = "Password successfully changed";

    return (
        <SettingsLayoutForm title="Update Password" onSubmit={onSubmit} errorCode={errorCode}
                successMessage={wasSuccess ? successMessage : null}>
            {/* Old Password Field */}
            <FormPasswordInput value={formValues.oldPassword} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'oldPassword'))}} 
                showPassword={showPasswords.oldPassword} label='Old Password'
                togglePasswordVisibility={() => {togglePasswordVisibility("oldPassword")}} />
            {/* New Password Password Field */}
            <FormPasswordInput value={formValues.newPassword1} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'newPassword1'))}} 
                showPassword={showPasswords.newPassword1} togglePasswordVisibility={() => {togglePasswordVisibility("newPassword1")}} 
                label='New Password' />
            {/* Confirm New Password Password Field */}
            <FormPasswordInput value={formValues.newPassword2} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'newPassword2'))}} 
                showPassword={showPasswords.newPassword2} togglePasswordVisibility={() => {togglePasswordVisibility("newPassword2")}} 
                label='Confirm New Password' />
            <FormSubmitButton isLoading={isLoading} label="Update Password" />
        </SettingsLayoutForm>
    );
}


// Delete Account
const DeleteAccountForm = ({checkLoggedIn}: {checkLoggedIn: () => void}) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorCode, setErrorCode] = useState<number | null>(null);

    const onSubmit = async () => {
        setIsLoading(true);

        const resp = await deleteAccount(password);
        if(resp.status === "Success") {
            checkLoggedIn();
        } else {
            setErrorCode(resp.errorCode);
        }

        setIsLoading(false);
    }

    return (
        <SettingsLayoutForm title="Delete Account" onSubmit={onSubmit} errorCode={errorCode}>
            {/* Password Field */}
            <FormPasswordInput value={password} onChange={(v: string) => {setPassword(v);}} 
                showPassword={showPassword} togglePasswordVisibility={() => {setShowPassword(!showPassword)}} />
            <FormSubmitButton isLoading={isLoading} label="Delete Account" isLogout />
        </SettingsLayoutForm>
    );
}


// Logout
const LogoutButton = ({checkLoggedIn}: {checkLoggedIn: () => void}) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onClick = async () => {
        setIsLoading(true);

        const resp = await logout();
        if(resp.status === "Success") {
            checkLoggedIn();
            navigate('/');
        }

        setIsLoading(false);
    }

    return (
        <Stack p={2} w='100%' maxW={1000} h={'fit-content'} style={{marginLeft: 'auto', marginRight: 'auto'}} >
            <FormSubmitButton isLoading={isLoading} label="Logout" isLogout onClick={onClick} />
        </Stack>
    );
}