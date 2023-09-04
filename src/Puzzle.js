import { useState } from 'react';
import { Chessboard } from "react-chessboard";
import * as ChessJS from "chess.js";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

export default function Puzzle({ start_FEN, end_FEN }) {
    const [game, setGame] = useState(new Chess());
    const [game_FEN, setGameFEN] = useState(start_FEN);

    // const game = new Chess();
    console.log("loading FEN: " + start_FEN);
    game.load(start_FEN);

    function onDrop(sourceSquare, targetSquare) {
        // console.log(game.moves());
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

        game.move(move);

        console.log("game after:" + game.fen());
        console.log("end_FEN: " + end_FEN);

        if (game.fen() === end_FEN) {
            console.log("puzzle solved!");
        } else {
            console.log("puzzle not solved");
        }

        game.undo();
        return true; // null if the move was illegal, the move object if the move was legal
    }

    return (
        <div>
            <div style={{ width: 500 }}>
                <Chessboard
                    id="puzzle"
                    position={start_FEN}
                    onPieceDrop={onDrop}
                    boardOrientation='black'
                />
            </div>
        </div>
    );
}


