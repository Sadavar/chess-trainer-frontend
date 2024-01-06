import { useState, useContext, useEffect, useRef } from 'react';
import Puzzle from './Puzzle.jsx'
import { useAppContext } from './AppContext.jsx';
import { Chessboard } from "react-chessboard";
import axios from 'axios';
import { Button } from '@mantine/core';


export default function PuzzleDisplay({ FEN_array }) {
    const retryPuzzleRef = useRef({ retryPuzzle: () => { } });
    const puzzleRef = useRef();
    const [window_width, setWindowWidth] = useState(window.innerWidth);
    const [game_state, setGameState] = useState("");

    const { puzzle_counter, setPuzzleCounter } = useAppContext();
    const { user } = useAppContext();



    useEffect(() => {
        setPuzzleCounter(0);
    }, [FEN_array])

    function nextPuzzle() {
        if (puzzle_counter === FEN_array.length - 1) {
            setPuzzleCounter(0);
            return;
        }
        console.log("next puzzle");
        setPuzzleCounter(puzzle_counter + 1);
    }

    const retryPuzzle = () => {
        console.log('Calling retryPuzzleFunction:', retryPuzzleRef.current.retryPuzzle);
        retryPuzzleRef.current.retryPuzzle();
    };

    function savePuzzle() {
        if (!user) {
            alert("Please login to save puzzles");
            return;
        }
        console.log("saving puzzle");
        var puzzle = {
            start_FEN: FEN_array[puzzle_counter][0],
            end_FEN: FEN_array[puzzle_counter][1],
            turn_color: FEN_array[puzzle_counter][2]
        }
        var payload = {
            user: user,
            puzzle: puzzle
        }
        console.log(puzzle);
        var url = 'http://127.0.0.1:5000/savePuzzle';
        axios.post(url, payload)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
    }



    return (
        <>
            <div className=" flex flex-col lg:grid lg:grid-cols-12">
                <div className="col-start-3 col-span-4">
                    <Puzzle
                        start_FEN={FEN_array[puzzle_counter][0]}
                        end_FEN={FEN_array[puzzle_counter][1]}
                        turn_color={FEN_array[puzzle_counter][2]}
                        retryPuzzleRef={retryPuzzleRef}
                        setGameStateRef={setGameState}
                    />
                </div>
                <div className="bg-blue-200 col-span-5 flex flex-col gap-1 items-center h-1/2">
                    <h2>Puzzles: {FEN_array.length}</h2>
                    <Button onClick={nextPuzzle}>Next Puzzle</Button>
                    <Button onClick={retryPuzzle}>Retry Puzzle</Button>
                    <Button onClick={savePuzzle}>Save Puzzle</Button>
                    <h2>{game_state}</h2>
                </div>
            </div>
        </>
    );
}


