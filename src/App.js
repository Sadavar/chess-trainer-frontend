import './App.css';
import Import from './Import.js';
import { useState, createContext } from "react";
import { AppContext } from './AppContext';

function App() {
  const [puzzle_counter, setPuzzleCounter] = useState(0);
  
  return (
    <>
      <AppContext.Provider value={{ puzzle_counter, setPuzzleCounter }}>
        <Import />
      </AppContext.Provider>
    </>
  );
}

export default App;
