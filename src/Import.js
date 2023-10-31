import { useState, useContext, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import Chess from "chess";
import PuzzleDisplay from './PuzzleDisplay.js';
import { AppContext } from './AppContext';
import axios from 'axios';

export default function Import() {
    const [username, setUsername] = useState('');
    const [pgns, setPGNs] = useState([]);
    const [tactics, setTactics] = useState([]);
    const [tacticsLoaded, setTacticsLoaded] = useState(false);
    const { puzzle_counter, setPuzzleCounter } = useContext(AppContext);

    const [isLoading, setIsLoading] = useState(false);


    async function handleGenerate() {
        console.log("generating");
        if (username == '') return;
        getPGNs();
    }

    async function getPGNs() {
        console.log("getting pgns of: " + username);

        setIsLoading(true);

        var date = new Date();
        var current_year = date.getFullYear();
        var data_retreived = false;
        var pgns;
        var months_tried = 0;

        // try and grab data from the last 2 years
        while (!data_retreived && months_tried < 24) {
            console.log(date);

            if (date.getMonth() == 0) {
                date.setFullYear(date.getFullYear() - 1);
                date.setMonth(11);
            }
            var chess_api_url = new URL('https://api.chess.com/pub/player/' + username + '/games/' + date.getFullYear() + '/');
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var url = chess_api_url + month;
            months_tried++;

            try {
                const res = await axios.get(url);
                if (res.data.games.length == 0) {
                    console.log("no games found for" + date.getFullYear() + "/" + month);
                    date.setMonth(date.getMonth() - 1);
                } else {
                    pgns = res.data;
                    data_retreived = true;
                }
                console.log(res);
            } catch (error) {
                console.log(error);
                continue;
            }
        }


        var size = (pgns.games.length > 10) ? 10 : pgns.games.length;
        var tactics_found = [];
        for (var i = 0; i < size; i++) {
            try {
                var t = await getTactics(pgns.games[i].pgn);
                console.log("recieved tactics: ");
                console.log(t);
                if (t != null) {
                    tactics_found = tactics_found.concat(t);
                }
            } catch (error) {
                console.log("error");
                console.log(error);
                continue;
            }
        }

        if (tactics_found.length == 0) {
            console.log("tactics array empty");
            setIsLoading(false);
            return;
        }


        console.log("tactics loaded!");
        console.log(tactics_found);
        setTacticsLoaded(true);
        setIsLoading(false);
        setTactics(tactics_found);
    };

    async function getTactics(pgn) {
        console.log("getting tactics of: " + pgn);

        // const url = new URL('https://chess-trainer-python-b932ead51c12.herokuapp.com/getTactics');
        const url = new URL('http://127.0.0.1:5000/getTactics');

        var payload = {
            pgn: pgn,
            username: username
        };

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        var tactics;
        try {
            const res = await axios.post(url, payload, headers)
            if (res.data.length == 0) {
                console.log("no tactics found");
                return;
            }
            tactics = res.data;
        } catch (error) {
            console.log(error);
        }

        console.log("tactics found: " + tactics);
        return tactics;
    }

    function displayTactics() {
        if (tacticsLoaded) {
            return <PuzzleDisplay FEN_array={tactics} />;
        }
    }

    return (
        <div>
            <h1> Chess Trainer </h1>
            <input
                type="text"
                id="username-input"
                name="username-input"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
            />
            <button onClick={handleGenerate}> Generate </button>

            <div>
                {isLoading ? <p>Loading...</p> : null}
            </div>

            {displayTactics()}

        </div>
    );
}


