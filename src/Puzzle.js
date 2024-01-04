import { useState } from 'react';
import { useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import * as ChessJS from "chess.js";


const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;



const Puzzle = ({ start_FEN, end_FEN, turn_color, retryPuzzleRef, setGameStateRef }) => {
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

    const retryPuzzle = () => {
        game.load(start_FEN);
        setGameFEN(start_FEN);
        setGameState("");
    };

    // Pass the retryPuzzle function to the parent component
    useEffect(() => {
        retryPuzzleRef.current.retryPuzzle = retryPuzzle;
    }, [retryPuzzleRef, start_FEN]);

    // Pass the game state to the parent component
    useEffect(() => {
        setGameStateRef(game_state);
    }, [game_state]);


    var analysis_link = "https://lichess.org/analysis/" + start_FEN;
    return (
        <Chessboard
            id="puzzle"
            position={game_FEN}
            onPieceDrop={onDrop}
            boardOrientation={turn_color}
        />
    );
}

export default Puzzle;


