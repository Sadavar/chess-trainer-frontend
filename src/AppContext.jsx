import { createContext, useContext, useState } from 'react';

const AppContext = createContext("");

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [puzzle_counter, setPuzzleCounter] = useState(0);
    const [selected_games_analyze, setSelectedGamesAnalyze] = useState([]);

    const [puzzle_counter_play, setPuzzleCounterPlay] = useState(0);
    const [puzzles_array_play, setPuzzlesArrayPlay] = useState([]);

    console.log("setting App Context");
    return (
        <AppContext.Provider value={{
            user, setUser,
            puzzle_counter, setPuzzleCounter,
            selected_games_analyze, setSelectedGamesAnalyze,
            puzzle_counter_play, setPuzzleCounterPlay,
            puzzles_array_play, setPuzzlesArrayPlay
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)