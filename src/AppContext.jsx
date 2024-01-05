import { createContext, useContext, useState } from 'react';

const AppContext = createContext("");

export const AppProvider = ({ children }) => {
    const [puzzle_counter, setPuzzleCounter] = useState(0);
    const [user, setUser] = useState(null);
    const [selectedGames, setSelectedGames] = useState([]);

    console.log("setting App Context");
    return (
        <AppContext.Provider value={{
            puzzle_counter, setPuzzleCounter,
            user, setUser,
            selectedGames, setSelectedGames
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)