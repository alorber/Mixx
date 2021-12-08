import HomeLayout from '../layouts/HomeLayout/HomeLayout';
import LoginSignupLayout from '../layouts/LoginSignupLayout/LoginSignupLayout';
import Navbar from '../sections/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { isLoggedIn } from '../../services/api';
import { Stack } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [loggedIn, updateLoggedIn] = useState(false);

  useEffect(() => {
    updateLoggedIn(isLoggedIn())
  }, [updateLoggedIn]);

  const showIfLoggedIn = (component: JSX.Element) => {
    return loggedIn ? component : < LoginSignupLayout updateLoggedIn={updateLoggedIn} />
  }

  return (
   <BrowserRouter>
      <Stack className="App" h={'100%'}>
        <Navbar isLoggedIn={loggedIn}/>
        <Routes>
          <Route path='/' element={<HomeLayout />}/>
          <Route path='/login' element={<LoginSignupLayout updateLoggedIn={updateLoggedIn} />}/>
          <Route path='/my_ingredients' element={showIfLoggedIn(<></>)}/>
          <Route path='/my_cocktails' element={showIfLoggedIn(<></>)}/>
          <Route path='/my_favorites' element={showIfLoggedIn(<></>)}/>
          <Route path='/ingredients/:ingredient_id' element={<></>}/>
          <Route path='/ingredients' element={<></>}/>
          <Route path='/cocktails/:cocktail_id' element={<></>}/>
          <Route path='/cocktails' element={<></>}/>
          <Route path='/search' element={<></>}/>
          <Route path='/settings' element={<></>}/>
        </Routes>
      </Stack>
   </BrowserRouter>
  );
}

export default App;
