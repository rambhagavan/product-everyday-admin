import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { StyledEngineProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux'
import store from './app/redux/stores/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store} >
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StyledEngineProvider>
    </React.StrictMode>
  </Provider>
);

