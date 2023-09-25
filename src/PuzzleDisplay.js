import { useState, useContext, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import Puzzle from './Puzzle.js'
import Chess from "chess";
import { AppContext } from './AppContext';


export default function PuzzleDisplay({ FEN_array }) {

    var puzzles = [];
    for (var i = 0; i < FEN_array.length; i++) {
        puzzles.push(<Puzzle start_FEN={FEN_array[i][0]} end_FEN={FEN_array[i][1]} turn_color={FEN_array[i][2]} />);
    }
    const { puzzle_counter, setPuzzleCounter } = useContext(AppContext);

    useEffect(() => {
        setPuzzleCounter(0);
    }, [FEN_array])

    return (
        <div>
            <h2>Puzzles</h2>
            {puzzles[puzzle_counter]}
            <button onClick={() => setPuzzleCounter(puzzle_counter + 1)}>Next Puzzle</button>
        </div>
    );
}


