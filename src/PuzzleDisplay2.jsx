import { useState, useContext, useEffect, useRef } from 'react';
import Puzzle from './Puzzle.jsx'
import { useAppContext } from './AppContext.jsx';
import { Chessboard } from "react-chessboard";
import axios from 'axios';
import { Button, Card, Group } from '@mantine/core';
import Header from './Header.jsx';
import { FaChessBoard, FaCircleXmark, FaRegCircleCheck, FaArrowRight, FaRotateLeft, FaSquarePlus, FaSearchengin } from "react-icons/fa6";



export default function PuzzleDisplay2() {
    const retryPuzzleRef = useRef({ retryPuzzle: () => { } });
    const puzzleRef = useRef();
    const [window_width, setWindowWidth] = useState(window.innerWidth);
    const [game_state, setGameState] = useState("");

    const { puzzle_counter, setPuzzleCounter } = useAppContext();
    const { user } = useAppContext();

    const FEN_array = [
        ["rnbqk2r/p1p3p1/5n1p/1p1pP1B1/3b4/2N5/PPP1QPPP/R4RK1 w - - 0 13", "rnbqk2r/p1p3p1/5n1p/1p1pP1B1/3b4/2N5/PPP1QPPP/R4RK1 w - - 0 13", "white"],
        ["rnbqk2r/p1p3p1/5n1p/1p1pP1B1/3b4/2N5/PPP1QPPP/R4RK1 w - - 0 13", "rnbqk2r/p1p3p1/5n1p/1p1pP1B1/3b4/2N5/PPP1QPPP/R4RK1 w - - 0 13", "white"],
    ]

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

    function displayPuzzleStatus() {
        if (game_state === "Correct") {
            return (
                <div className="flex w-full h-16 bg-green-500 justify-center items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2"> <FaRegCircleCheck /> Correct!</h1>
                </div>
            )
        }
        else if (game_state === "Incorrect") {
            return (
                <div className="flex w-full h-16 bg-red-500 text-white justify-center items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2"> <FaCircleXmark /> Incorrect</h1>
                </div>
            )
        }
        else if (game_state === "Playing") {
            return (
                <div className="flex w-full h-16 bg-slate-100 justify-center items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2"> <FaChessBoard /> White to Move</h1>
                </div>
            )
        }
    }

    function displayPuzzleButtons() {
        if (game_state === "Correct") {
            return (
                <>
                    <button onClick={nextPuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-green-500 hover:bg-blue-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaArrowRight /> Next
                    </button>
                    <button onClick={retryPuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaRotateLeft /> Retry
                    </button>
                    <button onClick={savePuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaSquarePlus /> Save
                    </button>
                </>
            )
        }
        else if (game_state === "Incorrect") {
            return (
                <>
                    <button onClick={nextPuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaArrowRight /> Next
                    </button>
                    <button onClick={retryPuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-red-500 hover:bg-red-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaRotateLeft /> Retry
                    </button>
                    <button onClick={savePuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaSquarePlus /> Save
                    </button>
                </>
            )
        }
        else if (game_state === "Playing") {
            return (
                <>
                    <button onClick={nextPuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaArrowRight /> Next
                    </button>
                    <button onClick={retryPuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaRotateLeft /> Retry
                    </button>
                    <button onClick={savePuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaSquarePlus /> Save
                    </button>
                </>
            )
        }
    }


    return (
        <>
            <Header />
            <div className="flex flex-col gap-2 lg:grid lg:grid-cols-12">
                <div className="bg-red-200 col-start-3 col-span-4">
                    <Puzzle
                        start_FEN={FEN_array[puzzle_counter][0]}
                        end_FEN={FEN_array[puzzle_counter][1]}
                        turn_color={FEN_array[puzzle_counter][2]}
                        retryPuzzleRef={retryPuzzleRef}
                        setGameStateRef={setGameState}
                    />
                </div>
                <div className="col-span-4 flex flex-col gap-1 items-center outline-slate-100 outline rounded-lg shadow-lg">
                    {displayPuzzleStatus()}
                    <div className="hidden md:w-3/5 md:flex md:flex-col ">
                        <h1 className="text-lg font-bold text-center">Game Info</h1>
                        <div className="pb-5">
                            <div className="flex justify-between"><div>Date: </div><div>12/23/2023</div></div>
                            <div className="flex justify-between"><div>White: </div><div>sadavar</div></div>
                            <div className="flex justify-between"><div>Black: </div><div>mani</div></div>
                            <div className="flex justify-between"><div>Result: </div><div>sadavar</div></div>
                            <div className="flex justify-between"><div>While Elo: </div><div>1600</div></div>
                            <div className="flex justify-between"><div>Black Elo: </div><div>1200</div></div>
                            <div className="flex justify-between"><div>TimeControl: </div><div>Blitz</div></div>
                        </div>
                        <button onClick={nextPuzzle} className="w-full flex gap-1 items-center justify-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                            <FaSearchengin /> Analysis Board
                        </button>
                    </div>
                    <div className="mt-auto w-full h-16 flex justify-center items-center gap-2 bg-slate-200">
                        {displayPuzzleButtons()}
                    </div>
                </div>
            </div>
        </>
    );
}


