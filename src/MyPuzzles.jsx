import Header from './Header.jsx';
import { Button, ActionIcon, Card, Title, Text, Image, TextInput, Badge } from '@mantine/core';
import axios from 'axios';
import { useAppContext } from './AppContext.jsx';
import { useState, useEffect } from 'react';

export default function MyPuzzles() {

    const { user } = useAppContext();
    const [puzzles, setPuzzles] = useState([]);

    function getPuzzles() {
        var url = 'http://127.0.0.1:5000/getPuzzles';
        var payload = {
            user: user
        }
        axios.post(url, payload)
            .then((res) => {
                console.log(res);
                setPuzzles(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        console.log("getting puzzles");
        getPuzzles();
    }, [])


    return (
        <div>
            <Header />
            <h1>My Puzzles</h1>
            <div>
                {puzzles.map((puzzle, index) => {
                    return (
                        <div key={index}>
                            <h1>{puzzle.start_FEN}</h1>
                            <h1>{puzzle.end_FEN}</h1>
                            <h1>{puzzle.turn_color}</h1>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}