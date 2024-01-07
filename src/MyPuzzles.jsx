import Header from './Header.jsx';
import PuzzleDisplay from './PuzzleDisplay.jsx'
import { Button, ActionIcon, Card, Title, Text, Image, TextInput, Badge } from '@mantine/core';
import axios from 'axios';
import { useAppContext } from './AppContext.jsx';
import { useState, useEffect } from 'react';
import { FaArrowRight, FaRotateLeft, FaCheck, FaBolt } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


export default function MyPuzzles() {

    const { user, selected_games_play, setSelectedGamesPlay, puzzles_array_play, setPuzzlesArrayPlay } = useAppContext();
    const [puzzles, setPuzzles] = useState([]);


    function getPuzzles() {
        const url = new URL(import.meta.env.VITE_BACKEND_URL + '/getPuzzles')
        var payload = {
            user: user
        }
        axios.post(url, payload)
            .then((res) => {
                console.log(res);
                let data = res.data;
                // let new_puzzles = [];
                // for (var i = 0; i < 4; i++) {
                //     for (var j = 0; j < data.length; j++) {
                //         new_puzzles.push(data[j]);
                //     }
                // }
                setPuzzles(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        console.log("getting puzzles");
        getPuzzles();
    }, [])

    function displayMyPuzzles() {
        return (
            <div className="flex flex-wrap justify-center gap-10 w-full">
                {puzzles.map((puzzle, index) => (
                    <div className="px-10 flex flex-col justify-center items-center outline outline-slate-100 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-400" key={index}>
                        <h1 className="w-full text-center text-xl font-bold py-2">Puzzle Name</h1>
                        <h1>Game Info</h1>
                        <div className="">
                            <div className="pb-5">
                                <div className="flex justify-between"><div>White: </div><div>{puzzle.game_info.white}</div></div>
                                <div className="flex justify-between"><div>Black: </div><div>{puzzle.game_info.black}</div></div>
                                <div className="flex justify-between"><div>Result: </div><div>{puzzle.game_info.result}</div></div>
                                <div className="flex justify-between"><div>While Elo: </div><div>{puzzle.game_info.white_elo}</div></div>
                                <div className="flex justify-between"><div>Black Elo: </div><div>{puzzle.game_info.black_elo}</div></div>
                                <div className="flex justify-between"><div>TimeControl: </div><div>{puzzle.game_info.time_control}</div></div>
                                <div className="flex justify-between"><div className="">Date: </div><div>{puzzle.game_info.date}</div></div>
                                <div className="flex justify-between"><div>Link: </div><a href={puzzle.game_info.link} className="text-blue-400 hover:text-blue-500">Game Link</a></div>
                            </div>
                            <div className="mt-auto h-16 flex justify-center items-center gap-2 ">
                                <button className="flex gap-1 items-center h-9 px-4 text-md bg-sky-500 hover:bg-sky-600 transition-colors duration-150 text-white font-bold rounded-md">
                                    <FaCheck /> Select
                                </button>
                                <Link to={"/playpuzzles"}>
                                    <button onClick={() => { setPuzzlesArrayPlay([puzzle]) }} className="flex gap-1 items-center h-9 px-4 text-md bg-green-500 hover:bg-green-600 transition-colors duration-150 text-white font-bold rounded-md">
                                        <FaBolt /> Play
                                    </button>
                                </Link>
                            </div>
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
                <Button>Play Random Puzzles</Button>
                <Button>Play Selected Puzzles</Button>
            </div>
            <div className="">
                {displayMyPuzzles()}
            </div>
        </div>
    )
}