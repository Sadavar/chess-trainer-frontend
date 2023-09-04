import './App.css';
import Import from './Import.js';
import { useState, createContext } from "react";
import { AppContext } from './AppContext';

function App() {
  const [counter, setCounter] = useState(0);

  return (
    <>
      <AppContext.Provider value={{ counter, setCounter }}>
        <Import />
      </AppContext.Provider>
    </>
  );
}

export default App;
