import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App3.jsx'
import './index.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LandingPage from './LandingPage.jsx';
import Analyze from './Analyze.jsx';
import Login from './Login.jsx';
import GameSelect from './GameSelect.jsx';

import {AppProvider} from './AppContext.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Analyze",
    element: <Analyze />,
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider>
    <AppProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider router={router}>
            <App />
      </RouterProvider>
      </GoogleOAuthProvider>
      </AppProvider>
    </MantineProvider>
  </React.StrictMode>
);
