import { useState } from 'react';
import { useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

export default function Puzzle({ start_FEN, end_FEN }) {
    const [game, setGame] = useState(new Chess());
    const [game_FEN, setGameFEN] = useState(start_FEN);
    const [game_state, setGameState] = useState("");

    useEffect(() => {
        setGameFEN(start_FEN);
        setGameState("");
    }, [start_FEN])


    // const game = new Chess();
    console.log("loading FEN: " + game_FEN);
    game.load(game_FEN);


    function onDrop(sourceSquare, targetSquare) {
        // console.log(game.moves());
        if (game_state === "Correct!" || game_state === "Incorrect") return false;
        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        // illegal move
        if (move === null) return false;
        return true;
    }

    function makeAMove(move) {
        console.log("game before:" + game.fen());

        // Test if move is illegal
        try {
            let copy = new Chess(game.fen());
            let res = copy.move(move);
        } catch (error) {
            console.log("error");
            return;
        }

        game.move(move);
        setGameFEN(game.fen());

        console.log("game after:" + game.fen());
        console.log("end_FEN: " + end_FEN);

        if (game.fen() === end_FEN) {
            console.log("puzzle solved!");
            setGameState("Correct!");
        } else {
            console.log("puzzle not solved");
            setGameState("Incorrect");
        }

        return true; // null if the move was illegal, the move object if the move was legal
    }

    function retryPuzzle() {
        game.load(start_FEN);
        setGameFEN(start_FEN);
        setGameState("");
    }

    let analysis_link = "https://lichess.org/analysis/" + game_FEN;



    return (
        <div>
            <h2> {game_state} </h2>
            <h4><a href={analysis_link}>Analysis Board</a></h4>

            <div style={{ width: 500 }}>
                <Chessboard
                    id="puzzle"
                    position={game_FEN}
                    onPieceDrop={onDrop}
                    boardOrientation='black'
                />
            </div>
            <button onClick={() => retryPuzzle()}>Retry Puzzle</button>
        </div>
    );
}


