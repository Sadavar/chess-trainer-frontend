import './App.css';
import LandingPage from './LandingPage.js';
import Analyze from './Analyze.js';
import Login from './Login.js';
import GameSelect from './GameSelect.js';
import { useState, createContext } from "react";
import { AppContext } from './AppContext';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


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
]);

function App() {
  const [puzzle_counter, setPuzzleCounter] = useState(0);
  const [user, setUser] = useState("");
  const [selectedGames, setSelectedGames] = useState([]);

  return (
    <>
      <AppContext.Provider value={{
        puzzle_counter, setPuzzleCounter,
        user, setUser,
        selectedGames, setSelectedGames
      }}>
        <RouterProvider router={router} />
      </AppContext.Provider>
    </>

  );
}

export default App;
