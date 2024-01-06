import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.jsx'
import LandingPage from './LandingPage.jsx';
import Analyze from './Analyze.jsx';
import Login from './Login.jsx';
import GameSelect from './GameSelect.jsx';
import MyPuzzles from './MyPuzzles.jsx';
import PuzzleDisplay2 from './PuzzleDisplay2.jsx';

import { useAppContext, AppProvider } from './AppContext.jsx';
import { Navigate, Outlet } from 'react-router-dom';


const ProtectedRoutes = () => {
  const { user } = useAppContext();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/analyze",
    element: <Analyze />,
  },
  {
    path: "/puzzledisplay",
    element: <PuzzleDisplay2 />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/mypuzzles",
        element: <MyPuzzles />,
      },
    ],
  },
]);


if (import.meta.env.NODE_ENV !== "development")
  console.log = () => { };


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </GoogleOAuthProvider>
  </AppProvider>
);
