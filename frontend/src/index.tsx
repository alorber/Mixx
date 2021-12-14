import App from './components/App/App';
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import './index.css';

const newTheme = extendTheme({
  fonts: {
    heading: 'Comfortaa',
    body: 'Comfortaa'
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={newTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
