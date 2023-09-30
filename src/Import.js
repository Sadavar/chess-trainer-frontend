import { useState, useContext, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import Chess from "chess";
import PuzzleDisplay from './PuzzleDisplay.js';
import { AppContext } from './AppContext';

export default function Import() {
    const [username, setUsername] = useState('');
    var [pgns, setPGNs] = useState([]);
    var [tactics, setTactics] = useState([]);
    var [tacticsLoaded, setTacticsLoaded] = useState(false);
    const { puzzle_counter, setPuzzleCounter } = useContext(AppContext);

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);


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
        // const chess_url1 = new URL('https://api.chess.com/pub/player/sadavar/games/2023/04');
        var data_retreived = false;
        var pgns;
        while (!data_retreived) {
            if (date.getMonth() == 0) {
                if (date.getFullYear() != current_year - 2) {
                    date.setFullYear(date.getFullYear() - 1);
                    date.setMonth(11);
                }
                return;
            }
            var chess_url = new URL('https://api.chess.com/pub/player/' + username + '/games/' + date.getFullYear() + '/');
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            console.log(month);
            try {
                const res = await fetch(chess_url + month);
                pgns = await res.json();
                console.log("pgns");
                console.log(pgns);
                if (pgns.games.length == 0) {
                    console.log("no games found");
                    date.setMonth(date.getMonth() - 1);
                } else {
                    data_retreived = true;
                }
            }
            catch (error) {
                console.log("error");
                console.log(error);
                return;
            }
        }
        let size = (pgns.games.length > 10) ? 10 : pgns.games.length;
        var tactics_found = [];
        for (var i = 0; i < size; i++) {
            let t = await getTactics(pgns.games[i].pgn);
            tactics_found = tactics_found.concat(t);
        }
        console.log("tactics loaded!");
        console.log(tactics_found);
        setTacticsLoaded(true);
        setIsLoading(false);
        setTactics(tactics_found);
    };

    async function getTactics(pgn) {
        console.log("getting tactics of: " + pgn);

        const url = new URL('https://chess-trainer-python-b932ead51c12.herokuapp.com/getTactics');
        // const url = new URL('http://127.0.0.1:5000/getTactics');

        var payload = {
            pgn: pgn,
            username: username
        };

        const res = await fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload), // body data type must match "Content-Type" header
        });

        const tactics = res.json();
        console.log("tactics found: " + await tactics);
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
                onChange={event => setUsername(event.target.value)}
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


