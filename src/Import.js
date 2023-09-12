import { useState, useContext } from 'react';
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
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        console.log(month);



        const chess_url = new URL('https://api.chess.com/pub/player/' + username + '/games/2023/');
        // const chess_url1 = new URL('https://api.chess.com/pub/player/sadavar/games/2023/04');
        var data_retreived = false;
        var pgns;
        while (!data_retreived) {
            if (month == 13) {
                console.log("no games found");
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
        getTactics(pgns);
    };

    async function getTactics(pgns) {
        let pgn = pgns.games[0].pgn;
        console.log("getting tactics of: " + pgn);

        const url = new URL('https://chess-trainer-python-b932ead51c12.herokuapp.com/getTactics');
        // const url2 = new URL('https://chess-trainer-backend-sadavar-6c10d1a552e9.herokuapp.com/getTactics');
        // const url3 = new URL('http://127.0.0.1:5000/getTactics');

        url.searchParams.append('pgns', pgn);
        const res = await fetch(url);
        const tactics = res.json();
        setTactics(await tactics);
        console.log("tactics found: " + await tactics);
        await tactics.then(setTacticsLoaded(true)).then(console.log("tactics loaded!"));

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


