import { useState, useContext, useEffect, useRef } from 'react';
import { Chessboard } from "react-chessboard";
import Puzzle from './Puzzle.js'
import Chess from "chess";
import { AppContext } from './AppContext';
import { Button, Input, Col, Row, Space, Typography, Card } from 'antd'

export default function PuzzleDisplay({ FEN_array }) {
    const { puzzle_counter, setPuzzleCounter } = useContext(AppContext);
    const retryPuzzleRef = useRef({ retryPuzzle: () => { } });
    const puzzleRef = useRef();
    const [window_width, setWindowWidth] = useState(window.innerWidth);


    useEffect(() => {
        setPuzzleCounter(0);
    }, [FEN_array])

    function nextPuzzle() {
        console.log("next puzzle");
        setPuzzleCounter(puzzle_counter + 1);
    }

    const retryPuzzle = () => {
        console.log('Calling retryPuzzleFunction:', retryPuzzleRef.current.retryPuzzle);
        retryPuzzleRef.current.retryPuzzle();
    };



    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize)
    })

    if (window_width < 1000) {
        return (
            <>
                <Row>
                    <Col span={24} align="middle">
                        <h2>Puzzles: {FEN_array.length}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Puzzle
                            start_FEN={FEN_array[puzzle_counter][0]}
                            end_FEN={FEN_array[puzzle_counter][1]}
                            turn_color={FEN_array[puzzle_counter][2]}
                            retryPuzzleRef={retryPuzzleRef}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24} align="middle">
                        <Button onClick={nextPuzzle}>Next Puzzle</Button>
                        <Button onClick={retryPuzzle}>Retry Puzzle</Button>
                    </Col>
                </Row>
            </>
        );
    }
    else {
        return (
            <Row>
                <Col span={2}></Col>
                <Col span={9}>
                    <Puzzle
                        start_FEN={FEN_array[puzzle_counter][0]}
                        end_FEN={FEN_array[puzzle_counter][1]}
                        turn_color={FEN_array[puzzle_counter][2]}
                        retryPuzzleRef={retryPuzzleRef}
                    />
                </Col>
                <Col span={13} align="middle">
                    <h2>Puzzles: {FEN_array.length}</h2>
                    <Button onClick={nextPuzzle}>Next Puzzle</Button>
                    <Button onClick={retryPuzzle}>Retry Puzzle</Button>
                </Col>
                <Col span={3}></Col>
            </Row>

        );

    }
}


