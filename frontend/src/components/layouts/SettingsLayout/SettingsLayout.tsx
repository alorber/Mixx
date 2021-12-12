import React from 'react';
import { Box, Heading, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FormPasswordInput, FormSubmitButton, FormTextInput } from '../../ui/StyledFormFields/StyledFormFields';

type SettingsLayoutProps = {

}
const SettingsLayout = ({}: SettingsLayoutProps) => {

    return (
        <Stack mx={8} pt={10} px={6} pb={14}>
            <Box textAlign="center" mb={6}>
                <Heading>Settings</Heading>
            </Box>
            <Stack spacing={6}>
                <LogoutButton />
                <UpdateNameForm />
                <UpdateEmailForm />
                <UpdatePasswordForm />
                <DeleteAccountForm />
            </Stack>
        </Stack>
    );
}

export default SettingsLayout;

// Settings Layout Form Template
type SettingsLayoutFormProps = {
    title: string,
    onSubmit: () => void,
    children: React.ReactNode
}
const SettingsLayoutForm = ({title, onSubmit, children}: SettingsLayoutFormProps) => {
    return (
        <Stack p={8} w='100%' maxW={1000} h={'fit-content'} borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#b7e0ff"
                style={{marginLeft: 'auto', marginRight: 'auto'}} >
            <Heading size={'lg'}>{title}</Heading>
            <form onSubmit={e => {e.preventDefault(); onSubmit()}}>
                {children}
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
    const [formValues, setFormValues] = useState<{[key: string]: string}>({firstName: '', lastName: '', password: ''});
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {

    }

    return (
        <SettingsLayoutForm title="Update Name" onSubmit={onSubmit}>
            <Stack spacing={4}>
                {/* First Name Field */}
                <FormTextInput value={formValues.firstName} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'firstName'))}}
                    label={"First Name"} type="name" placeholder='Laura' ariaLabel='First Name' />
                {/* Last Name Field */}
                <FormTextInput value={formValues.lastName} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'lastName'))}}
                    label={"Last Name"} type="name" placeholder='Sparks' ariaLabel='Last Name' />
                <FormSubmitButton isLoading={isLoading} label="Update Name" />
            </Stack>
        </SettingsLayoutForm>
    );
}

// Update Email
const UpdateEmailForm = () => {
    const [formValues, setFormValues] = useState<{[key: string]: string}>({newEmail: '', password: ''});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        
    }

    return (
        <SettingsLayoutForm title="Update Email" onSubmit={onSubmit}>
            <Stack spacing={4}>
                {/* Email Field */}
                <FormTextInput value={formValues.newEmail} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'newEmail'))}}
                    label={"New Email Address"} type="email" placeholder='LauraSpark@Mixx.com' ariaLabel='Email' />
                {/* Password Field */}
                <FormPasswordInput value={formValues.password} onChange={(v: string) => {setFormValues(updateForm(formValues, v, 'password'))}} 
                    showPassword={showPassword} togglePasswordVisibility={() => {setShowPassword(!showPassword)}} />
                <FormSubmitButton isLoading={isLoading} label="Update Email" />
            </Stack>
        </SettingsLayoutForm>
    );
}


// Update Password
const UpdatePasswordForm = () => {
    const [formValues, setFormValues] = useState<{[key: string]: string}>({oldPassword: '', newPassword1: '', newPassword2: ''});
    const [showPasswords, setShowPassword] = useState<{[key: string]: boolean}>({oldPassword: false, newPassword1: false, newPassword2: false})
    const [isLoading, setIsLoading] = useState(false);

    const togglePasswordVisibility = (field: string) => {
        const passwords = {...showPasswords};
        passwords[field] = !passwords[field];
        setShowPassword(passwords);
    }

    const onSubmit = () => {
        
    }

    return (
        <SettingsLayoutForm title="Update Password" onSubmit={onSubmit}>
            <Stack spacing={4}>
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
            </Stack>
        </SettingsLayoutForm>
    );
}


// Delete Account
const DeleteAccountForm = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        
    }

    return (
        <SettingsLayoutForm title="Delete Account" onSubmit={onSubmit}>
            <Stack spacing={4}>
                {/* Password Field */}
                <FormPasswordInput value={password} onChange={(v: string) => {setPassword(v);}} 
                    showPassword={showPassword} togglePasswordVisibility={() => {setShowPassword(!showPassword)}} />
                <FormSubmitButton isLoading={isLoading} label="Delete Account" isLogout />
            </Stack>
        </SettingsLayoutForm>
    );
}


// Logout
const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const onClick = () => {

    }

    return (
        <Stack p={2} w='100%' maxW={1000} h={'fit-content'} style={{marginLeft: 'auto', marginRight: 'auto'}} >
            <FormSubmitButton isLoading={isLoading} label="Logout" isLogout onClick={onClick} />
        </Stack>
    );
}