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
    const { counter, setCounter } = useContext(AppContext);

    async function handleGenerate() {
        console.log("generating");
        if (username == '') return;
        getPGNs();
    }

    async function getPGNs() {
        console.log("getting pgns of: " + username);
        let date = new Date('January 1, 2023 06:00:00');

        const chess_url = new URL('https://api.chess.com/pub/player/' + username + '/games/2023/');
        // const chess_url1 = new URL('https://api.chess.com/pub/player/sadavar/games/2023/04');
        var data_retreived = false;
        var pgns;
        while (!data_retreived) {
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            console.log(month);
            if (month == 13) {
                console.log("no games found this year");
                return;
            }
            try {
                const res = await fetch(chess_url + month);
                pgns = await res.json();
                console.log("pgns");
                console.log(pgns);
                if (pgns.games.length == 0) {
                    console.log("no games found");
                    date.setMonth(date.getMonth() + 1);
                } else {
                    data_retreived = true;
                }
            }
            catch (error) {
                console.log("error");
                console.log(error);
                month++;
                continue;
            }
        }
        let size = (pgns.games.length > 1) ? 1 : pgns.games.length;
        var tactics_found = [];
        for (var i = 0; i < size; i++) {
            let t = await getTactics(pgns.games[i].pgn);
            tactics_found = tactics_found.concat(t);
        }
        console.log("tactics loaded!");
        console.log(tactics_found);
        setTacticsLoaded(true);
        setTactics(tactics_found);
    };

    async function getTactics(pgn) {
        console.log("getting tactics of: " + pgn);

        const url = new URL('https://chess-trainer-python-b932ead51c12.herokuapp.com/getTactics');
        // const url2 = new URL('https://chess-trainer-backend-sadavar-6c10d1a552e9.herokuapp.com/getTactics');
        // const url3 = new URL('http://127.0.0.1:5000/getTactics');

        url.searchParams.append('pgns', pgn);
        const res = await fetch(url);
        const tactics = res.json();
        // setTactics(tactics + await tactics);
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

            {displayTactics()}

        </div>
    );
}


