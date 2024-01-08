import Header from './Header.jsx';
import PuzzleDisplay from './PuzzleDisplay.jsx'
import { Button, ActionIcon, Card, Title, Text, Image, TextInput, Badge } from '@mantine/core';
import axios from 'axios';
import { useAppContext } from './AppContext.jsx';
import { useState, useEffect } from 'react';
import { FaArrowRight, FaRotateLeft, FaCheck, FaBolt, FaCircleXmark } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


export default function MyPuzzles() {

    const { user, puzzles_array_play, setPuzzlesArrayPlay } = useAppContext();
    const [puzzles, setPuzzles] = useState([]);

    const [selected_puzzles, setSelectedPuzzles] = useState([]);


    function getPuzzles() {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + '/getPuzzles')
        var payload = {
            user: user
        }
        var data;
        axios.post(url, payload)
            .then((res) => {
                console.error("res:")
                console.error(res);
                data = res.data;
                if (!data) return;
                setPuzzles(data);
            })
            .catch((err) => {
                console.error(err);
                return;
            })

        // var fake_data = [
        //     {
        //         "start_FEN": "rnbqk2r/p1p3p1/5n1p/1pbp2B1/3NP3/2N5/PPP1QPPP/R4RK1 w - - 0 12",
        //         "end_FEN": "rnbqk2r/p1p3p1/5n1p/1pbP2B1/3N4/2N5/PPP1QPPP/R4RK1 b - - 0 12",
        //         "turn_color": "white",
        //         "name": "2024-01-07 03:31:59",
        //         "game_info": {
        //             "black": "johnr282",
        //             "black_elo": "1194",
        //             "date": "2023.12.04",
        //             "link": "https://www.chess.com/game/live/95457569247",
        //             "result": "johnr282",
        //             "time_control": "300",
        //             "white": "sadavar",
        //             "white_elo": "1656"
        //         },
        //         "date_info": {
        //             "date": "2024-01-07",
        //             "timestamp": "03:31:59"
        //         }
        //     },
        //     {
        //         "start_FEN": "rnbqk2r/p1p3p1/5n1p/1pbp2B1/3NP3/2N5/PPP1QPPP/R4RK1 w - - 0 12",
        //         "end_FEN": "rnbqk2r/p1p3p1/5n1p/1pbP2B1/3N4/2N5/PPP1QPPP/R4RK1 b - - 0 12",
        //         "turn_color": "white",
        //         "name": "Fake Puzzle",
        //         "game_info": {
        //             "black": "johnr282",
        //             "black_elo": "1194",
        //             "date": "2023.12.04",
        //             "link": "https://www.chess.com/game/live/95457569247",
        //             "result": "johnr282",
        //             "time_control": "300",
        //             "white": "sadavar",
        //             "white_elo": "1656"
        //         },
        //         "date_info": {
        //             "date": "2024-01-07",
        //             "timestamp": "03:32:03"
        //         }
        //     }
        // ]
        // var data = fake_data;

        if (!data) return;
        for (let puzzle of data) {
            puzzle.isSelected = false;
        }
        setPuzzles(data)
    }

    useEffect(() => {
        console.error("getting puzzles");
        getPuzzles();
    }, [])



    function selectPuzzle(puzzle) {
        var new_selected_puzzles = [...selected_puzzles];
        if (new_selected_puzzles.includes(puzzle)) {
            new_selected_puzzles.splice(new_selected_puzzles.indexOf(puzzle), 1);
        } else {
            new_selected_puzzles.push(puzzle);
        }
        setSelectedPuzzles(new_selected_puzzles);

        // change puzzle's isSelected value in puzzles array
        var new_puzzles = [...puzzles];
        for (let p of new_puzzles) {
            if (p.date_info.timestamp === puzzle.date_info.timestamp) {
                if (puzzle.isSelected) {
                    p.isSelected = false;
                } else {
                    p.isSelected = true;
                }
            }
        }
        setPuzzles(new_puzzles);
    }

    function displaySelectButton(puzzle) {
        if (!puzzle.isSelected) {
            return (
                <button onClick={() => selectPuzzle(puzzle)} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                    <FaCheck /> Select
                </button>
            )
        } else {
            return (
                <button onClick={() => selectPuzzle(puzzle)} className="flex gap-1 items-center h-9 px-4 text-md bg-gray-400 hover:bg-gray-500 transition-colors duration-150 text-white font-bold rounded-md">
                    <FaCheck /> Select
                </button>
            )
        }
    }

    useEffect(() => {
        console.error("puzzles: ");
        console.error(puzzles)
        console.error("selected_puzzles: ");
        console.error(selected_puzzles)
        displayMyPuzzles();
    }, [puzzles])

    function displayMyPuzzles() {
        return (
            <div className="flex flex-wrap justify-center gap-10 w-full">
                {puzzles.map((puzzle, index) => (
                    <div className="px-10 flex flex-col justify-center items-center outline outline-slate-100 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-400" key={index}>
                        <h1 className="w-full text-center text-2xl font-bold py-2">{puzzle.name}</h1>
                        <h1 className="font-bold">Game Info</h1>
                        <div className="">
                            <div className="pb-5 ">
                                <div className="flex justify-between"><div>White: </div><div>{puzzle.game_info.white}</div></div>
                                <div className="flex justify-between"><div>Black: </div><div>{puzzle.game_info.black}</div></div>
                                <div className="flex justify-between"><div>Result: </div><div>{puzzle.game_info.result}</div></div>
                                <div className="flex justify-between"><div>While Elo: </div><div>{puzzle.game_info.white_elo}</div></div>
                                <div className="flex justify-between"><div>Black Elo: </div><div>{puzzle.game_info.black_elo}</div></div>
                                <div className="flex justify-between"><div>TimeControl: </div><div>{puzzle.game_info.time_control}</div></div>
                                <div className="flex justify-between"><div className="">Date: </div><div>{puzzle.game_info.date}</div></div>
                                <div className="flex justify-between"><div>Link: </div><a href={puzzle.game_info.link} className="text-blue-400 hover:text-blue-500">Game Link</a></div>
                            </div>
                        </div>
                        <div className="mt-auto h-16 flex justify-center items-center gap-2">
                            {displaySelectButton(puzzle)}
                            <Link to={"/playpuzzles"}>
                                <button onClick={() => { setPuzzlesArrayPlay([puzzle]) }} className="flex gap-1 items-center h-9 px-4 text-md bg-green-500 hover:bg-green-600 transition-colors duration-150 text-white font-bold rounded-md">
                                    <FaBolt /> Play
                                </button>
                            </Link>
                            <button className="flex gap-1 items-center h-9 px-4 text-md bg-red-500 hover:bg-red-600 transition-colors duration-150 text-white font-bold rounded-md">
                                <FaCircleXmark /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        )

    }


    return (
        <div>
            <Header />
            <h1 className='text-center text-5xl font-bold'>My Puzzles</h1>
            <div className='h-20 flex flex-row justify-center items-center gap-2'>
                <button onClick={() => { setPuzzlesArrayPlay(selected_puzzles) }} className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                    <FaBolt /> Play Random Puzzles
                </button>
                {selected_puzzles.length == 0 ?
                    <button className="flex gap-1 items-center h-9 px-4 text-md bg-gray-400 text-white font-bold rounded-md">
                        <FaBolt /> Play Selected Puzzles
                    </button>
                    :
                    <Link to={"/playpuzzles"}>
                        <button onClick={() => { setPuzzlesArrayPlay(selected_puzzles) }} className="flex gap-1 items-center h-9 px-4 text-md bg-green-500 hover:bg-green-600 transition-colors duration-150 text-white font-bold rounded-md">
                            <FaBolt /> Play Selected Puzzles
                        </button>
                    </Link>
                }
            </div>
            <div className="">
                {displayMyPuzzles()}
            </div>
        </div>
    )
}