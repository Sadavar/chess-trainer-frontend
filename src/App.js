import './App.css';
import Import from './Import.js';
import { useState, createContext } from "react";
import { AppContext } from './AppContext';

function App() {
  const [puzzle_counter, setPuzzleCounter] = useState(0);

  // replace console.* for disable log on production
  // console.log = () => { }
  // console.error = () => { }
  // console.debug = () => { }


  return (
    <>
      <AppContext.Provider value={{ puzzle_counter, setPuzzleCounter }}>
        <Import />
      </AppContext.Provider>
    </>
  );
}

export default App;
