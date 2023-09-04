import { useState } from 'react';
import { Chessboard } from "react-chessboard";
import Chess from "chess";
import PuzzleDisplay from './PuzzleDisplay.js';



export default function Import() {
    const [username, setUsername] = useState('');
    var [pgns, setPGNs] = useState([]);
    var [tactics, setTactics] = useState([]);
    var [tacticsLoaded, setTacticsLoaded] = useState(false);


    async function handleGenerate() {
        console.log("generating");
        getPGNs();
    }

    async function getPGNs() {
        console.log("getting pgns of: " + username);

        const url = new URL('https://chess-trainer-backend-sadavar-6c10d1a552e9.herokuapp.com/getPGNs');
        url.searchParams.append('username', username);
        const res = await fetch(url);
        pgns = await res.json();
        setPGNs(pgns);

        getTactics();
    };

    async function getTactics() {
        let pgn = pgns.games[0].pgn;
        console.log("getting tactics of: " + pgn);

        const url = new URL('https://chess-trainer-python-b932ead51c12.herokuapp.com/getTactics');
        const url2 = new URL('https://chess-trainer-backend-sadavar-6c10d1a552e9.herokuapp.com/getTactics');
        const url3 = new URL('http://127.0.0.1:5000/getTactics');

        url.searchParams.append('pgns', pgn);
        const res = await fetch(url);
        const data = res.json();
        setTactics(await data);
        console.log("tactics found: " + await data);
        await data.then(setTacticsLoaded(true)).then(console.log("tactics loaded!"));

    }

    function displayTactics() {
        if (tacticsLoaded) {
            return <PuzzleDisplay FEN_array={tactics} />;
        } else {
            return <h1> not loaded </h1>;
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


