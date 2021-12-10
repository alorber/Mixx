import HomeLayout from '../layouts/HomeLayout/HomeLayout';
import LoginSignupLayout from '../layouts/LoginSignupLayout/LoginSignupLayout';
import MyCocktailsLayout from '../layouts/MyCocktailsLayout/MyCocktailsLayout';
import MyFavoritesLayout from '../layouts/MyFavoritesLayout/MyFavoritesLayout';
import MyIngredientsLayout from '../layouts/MyIngredientsLayout/MyIngredientsLayout';
import Navbar from '../sections/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { isLoggedIn } from '../../services/api';
import { Stack } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [loggedIn, updateLoggedIn] = useState(false);

  const checkLoggedIn = () => {
    console.log(isLoggedIn());
    updateLoggedIn(isLoggedIn());
  }

  useEffect(() => {
    checkLoggedIn();
  }, [updateLoggedIn]);

  const showIfLoggedIn = (component: JSX.Element) => {
    return loggedIn ? component : < LoginSignupLayout isLoggedIn={loggedIn} updateLoggedIn={updateLoggedIn} 
                                      checkLoggedIn={checkLoggedIn} />
  }

  return (
   <BrowserRouter>
      <Stack className="App" h={'100%'}>
        <Navbar isLoggedIn={loggedIn}/>
        <Routes>
          <Route path='/' element={<HomeLayout checkLoggedIn={checkLoggedIn} />}/>
          <Route path='/login' element={<LoginSignupLayout isLoggedIn={loggedIn} updateLoggedIn={updateLoggedIn}
                                          checkLoggedIn={checkLoggedIn} />}/>
          <Route path='/my_ingredients' element={showIfLoggedIn(<MyIngredientsLayout checkLoggedIn={checkLoggedIn} />)}/>
          <Route path='/my_cocktails' element={showIfLoggedIn(<MyCocktailsLayout checkLoggedIn={checkLoggedIn} />)}/>
          <Route path='/my_favorites' element={showIfLoggedIn(<MyFavoritesLayout checkLoggedIn={checkLoggedIn} />)} />
          <Route path='/ingredients/:ingredient_id' element={<></>}/>
          <Route path='/ingredients' element={<></>}/>
          <Route path='/cocktails/:cocktail_id' element={<></>}/>
          <Route path='/cocktails' element={<></>}/>
          <Route path='/search' element={<></>}/>
          <Route path='/settings' element={showIfLoggedIn(<></>)}/>
        </Routes>
      </Stack>
   </BrowserRouter>
  );
}

export default App;
