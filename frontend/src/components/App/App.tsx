import { Stack } from '@chakra-ui/layout';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { isLoggedIn } from '../../services/api';
import Navbar from '../sections/Navbar/Navbar';
import './App.css';
import HomeLayout from '../layouts/HomeLayout/HomeLayout';
import LoginLayout from '../layouts/LoginLayout/LoginLayout';


const App = () => {
  const [loggedIn, updateLoggedIn] = useState(false);

  useEffect(() => {
    updateLoggedIn(isLoggedIn())
  }, [updateLoggedIn]);

  return loggedIn ? (
   <BrowserRouter>
    <div className="App" style={{'height': '100%'}}>
      <Stack h={'100%'}>
        <Routes>
          <Navbar isLoggedIn={loggedIn}/>
          <Route path='/' element={<HomeLayout />}/>
          <Route path='/login' element={<LoginLayout />}/>
          <Route path='/my_ingredients' element={<></>}/>
          <Route path='/my_cocktails' element={<></>}/>
          <Route path='/my_favorites' element={<></>}/>
          <Route path='/ingredients/:ingredient_id' element={<></>}/>
          <Route path='/ingredients' element={<></>}/>
          <Route path='/cocktails/:cocktail_id' element={<></>}/>
          <Route path='/cocktails' element={<></>}/>
          <Route path='/search' element={<></>}/>
          <Route path='/settings' element={<></>}/>
        </Routes>
      </Stack>
    </div>
   </BrowserRouter>
  ) : (
    <BrowserRouter>
      <div className="App" style={{"height": "100%"}}>
        <Stack h={"100%"}>
          <Navbar isLoggedIn={loggedIn}/>
          <LoginLayout />
        </Stack>
      </div>
    </BrowserRouter>
  );
}

export default App;
