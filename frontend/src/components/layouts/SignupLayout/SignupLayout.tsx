import React from 'react'
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { login, signup } from '../../../services/api';
import { ChangeEvent } from 'react';
import { Link } from "react-router-dom";

/*function PasswordInput() {

  const [password, setPassword] = React.useState("");
  //onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup size='md'>
      <Input
        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        placeholder='Enter password'
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}*/

function SendSignupInfo(username: string, password: string, firstname:string, lastname:string){
  signup(username, password, firstname, lastname);
}


const HomeLayout = () => {
    console.log("hey");
    const [username, setUsername] = React.useState("")
    //const [password, setPassword] = React.useState("");
    //const handleChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)

    const [password, setPassword] = React.useState("");
    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");

    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
        <div>
            Welcome to Mixx
            <Input placeholder='First Name' onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstname(e.target.value)}/>
            <Input placeholder='Last Name' onChange={(e: ChangeEvent<HTMLInputElement>) => setLastname(e.target.value)}/>

            <Input placeholder='Email' onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>

            <InputGroup size='md'>
              <Input
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                placeholder='Enter password'
              />
              <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                  {show ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>

            <Button onClick={() => {SendSignupInfo(username, password, firstname, lastname)}}>Sign up</Button>
            <Link to="/login" className="signupLink">login</Link>

        </div>
    );
};

export default HomeLayout;
