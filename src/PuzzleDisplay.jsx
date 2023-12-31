import { useState, useContext, useEffect, useRef } from 'react';
import Puzzle from './Puzzle.jsx'
import { useAppContext } from './AppContext.jsx';
import axios from 'axios';
import Header from './Header.jsx';
import { Modal, Button, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FaChessBoard, FaCircleXmark, FaRegCircleCheck, FaArrowRight, FaRotateLeft, FaSquarePlus, FaSearchengin } from "react-icons/fa6";
import { Link } from "react-router-dom";

export default function PuzzleDisplay({ puzzles_array, isPlaying }) {

    const retryPuzzleRef = useRef({ retryPuzzle: () => { } });
    const [game_state, setGameState] = useState("");

    const { puzzle_counter, setPuzzleCounter } = useAppContext();
    const { user } = useAppContext();

    useEffect(() => {
        console.error("resetting puzzle counter")
        setPuzzleCounter(0);
    }, [puzzles_array])

    function nextPuzzle() {
        if (puzzle_counter === puzzles_array.length - 1) {
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

    const [opened, { open, close }] = useDisclosure(false);
    const [puzzle_name, setPuzzleName] = useState("");


    function showModal() {
        if (!user) {
            return (
                <Modal opened={opened} onClose={close} centered>
                    <h1 className="text-center text-2xl pb-5">Please Login to Save Puzzles</h1>
                    <div className="flex justify-center pt-2">
                        <Button component={Link} to="/login">Login</Button>
                    </div>
                </Modal>
            );
        }

        return (
            <>
                <Modal opened={opened} onClose={close} title="Enter A Puzzle Name" centered>
                    <h1 className="text-slate-500 pb-5">If no puzzle name is entered, a timestamp will be created for the name</h1>

                    <TextInput
                        placeholder="Enter Puzzle Name"
                        value={puzzle_name}
                        onChange={(event) => setPuzzleName(event.currentTarget.value)}
                        size="md"
                    />
                    <div className="flex justify-center pt-5">
                        <button onClick={savePuzzle} className="flex gap-1 justify-center items-center h-9 w-1/2 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                            <FaSquarePlus /> Save
                        </button>
                    </div>
                </Modal>
            </>
        );

    }

    function savePuzzle() {
        console.error("saving puzzle");
        let date_raw = new Date().toJSON();
        let date = date_raw.slice(0, 10);
        let timestamp = date_raw.slice(11, 19);

        var date_info = {
            date: date,
            timestamp: timestamp
        }

        var puzzle = puzzles_array[puzzle_counter]
        if (puzzle_name === "") {
            puzzle.name = date_info.date + " " + date_info.timestamp;
        } else {
            puzzle.name = puzzle_name;
        }
        puzzle.date_info = date_info;
        var payload = {
            user: user,
            puzzle: puzzle
        }
        console.error(puzzle);
        const url = new URL(import.meta.env.VITE_BACKEND_URL + '/savePuzzle')
        axios.post(url, payload)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            })
        close();
    }

    function displayPuzzleStatus() {
        if (game_state === "Correct") {
            return (
                <div className="flex w-full h-16 bg-green-500 justify-center items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-white"> <FaRegCircleCheck /> Correct!</h1>
                </div>
            )
        }
        else if (game_state === "Incorrect") {
            return (
                <div className="flex w-full h-16 bg-red-500 text-white justify-center items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-white"> <FaCircleXmark /> Incorrect</h1>
                </div>
            )
        }
        else if (game_state === "Playing") {
            var turn = puzzles_array[puzzle_counter].turn_color;
            const capital_first_letter = turn.charAt(0).toUpperCase();
            const remaining_letters = turn.slice(1);
            const capital_turn = capital_first_letter + remaining_letters;
            return (
                <div className="flex w-full h-16 bg-slate-100 justify-center items-center">
                    <h1 className="text-2xl font-bold flex items-center gap-2"> <FaChessBoard />  {capital_turn} to Move</h1>
                </div>
            )
        }
    }



    function displayPuzzleButtons() {
        if (game_state === "Correct") {
            return (
                <>
                    <button onClick={nextPuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-green-500 hover:bg-green-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaArrowRight /> Next
                    </button>
                    <button onClick={retryPuzzle} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                        <FaRotateLeft /> Retry
                    </button>
                    {!isPlaying &&
                        <button onClick={open} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                            <FaSquarePlus /> Save
                        </button>
                    }
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
                    {!isPlaying &&
                        <button onClick={open} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                            <FaSquarePlus /> Save
                        </button>
                    }
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
                    {!isPlaying &&
                        <button onClick={open} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                            <FaSquarePlus /> Save
                        </button>
                    }
                </>
            )
        }
    }

    function displayPuzzle() {
        console.error("puzzle_counter: " + puzzle_counter)
        console.error("puzzles_array: ")
        console.error(puzzles_array)
        console.error("puzzles_array[puzzle_counter]: ")
        console.error(puzzles_array[puzzle_counter])
        if (puzzles_array[puzzle_counter] !== undefined) {
            return (
                <Puzzle
                    start_FEN={puzzles_array[puzzle_counter].start_FEN}
                    end_FEN={puzzles_array[puzzle_counter].end_FEN}
                    turn_color={puzzles_array[puzzle_counter].turn_color}
                    retryPuzzleRef={retryPuzzleRef}
                    setGameStateRef={setGameState}
                />
            )
        } else {
            return (
                <div className="flex justify-center items-center h-96">
                    <h1 className="text-2xl font-bold flex items-center gap-2"> <FaChessBoard />  Loading...</h1>
                </div>
            )
        }
    }

    function displayGameInfo() {
        var game_info = puzzles_array[puzzle_counter].game_info;
        if (game_info !== undefined) {
            return (
                <div className="pb-5">
                    <div className="flex justify-between"><div>Date: </div><div>{game_info.date}</div></div>
                    <div className="flex justify-between"><div>White: </div><div>{game_info.white}</div></div>
                    <div className="flex justify-between"><div>Black: </div><div>{game_info.black}</div></div>
                    <div className="flex justify-between"><div>Result: </div><div>{game_info.result}</div></div>
                    <div className="flex justify-between"><div>While Elo: </div><div>{game_info.white_elo}</div></div>
                    <div className="flex justify-between"><div>Black Elo: </div><div>{game_info.black_elo}</div></div>
                    <div className="flex justify-between"><div>Time Control: </div><div>{game_info.time_control}</div></div>
                    <div className="flex justify-between"><div>Link: </div><a href={game_info.link} className="text-blue-400 hover:text-blue-500">Game Link</a></div>
                </div>
            )
        }
    }

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    return (
        <>
            {/* <Header /> */}
            <div className="flex flex-col gap-2 md:grid md:grid-cols-12">
                <div className="col-start-3 col-span-4">
                    {displayPuzzle()}
                </div>
                <div className="col-span-4 flex flex-col gap-1 items-center outline-slate-100 outline rounded-lg shadow-lg">
                    {displayPuzzleStatus()}
                    <div className="hidden md:w-3/5 md:flex md:flex-col ">
                        {isPlaying &&
                            <h1 className="text-lg font-bold text-center">{puzzles_array[puzzle_counter].name}</h1>
                        }
                        <h1 className="text-lg font-bold text-center">Game Info</h1>

                        {displayGameInfo()}
                        <div className='pb-2'>
                            <button onClick={() => openInNewTab("https://lichess.org/analysis/" + puzzles_array[puzzle_counter].start_FEN)} className="w-full flex gap-1 items-center justify-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                                <FaSearchengin /> Analysis Board
                            </button>
                        </div>
                    </div>
                    <div className="mt-auto w-full h-16 flex justify-center items-center gap-2 bg-slate-200">
                        {displayPuzzleButtons()}
                    </div>
                    {showModal()}
                </div>
            </div>
        </>
    );
}


