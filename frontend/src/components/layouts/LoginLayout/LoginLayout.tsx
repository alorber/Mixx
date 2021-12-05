import React from 'react'
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import { login, signup } from '../../../services/api';
import { ChangeEvent } from 'react';

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

function SendLoginInfo(username: string, password: string){
  login(username,password);
  //signup('username', 'password','a','b');
}


const LoginLayout = () => {
    console.log("hey");
    const [username, setUsername] = React.useState("")
    //const [password, setPassword] = React.useState("");
    //const handleChange = (e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)

    const [password, setPassword] = React.useState("");
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)

    return (
        <div>
            Welcome to Mixx
            <Input placeholder='username' onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}/>

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

            <Button onClick={() => {SendLoginInfo(username, password)}}>Log in</Button>
        </div>
    );
};

export default LoginLayout;
