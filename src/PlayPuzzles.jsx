import Header from './Header.jsx';
import PuzzleDisplay from './PuzzleDisplay.jsx'
import { Button, ActionIcon, Card, Title, Text, Image, TextInput, Badge } from '@mantine/core';
import axios from 'axios';
import { useAppContext } from './AppContext.jsx';
import { useState, useEffect } from 'react';
import { FaArrowRight, FaRotateLeft, FaCheck, FaBolt } from 'react-icons/fa6';
import { Link } from 'react-router-dom';


export default function PlayPuzzles() {

    const { user, puzzles_array_play, setPuzzlesArrayPlay } = useAppContext();

    function display() {
        if (puzzles_array_play.length == 0) {
            return (
                <div className="text-center">
                    <h1 className="text-3xl font-bold">No puzzles to play</h1>
                    <p className="text-xl pt-5">Try adding some puzzles from the <Link to="/mypuzzles">My Puzzles</Link> page</p>
                </div>
            )
        } else {
            return (
                <PuzzleDisplay puzzles_array={puzzles_array_play} isPlaying={true} />
            )
        }
    }

    return (
        <div>
            <Header />
            <h1 className='text-center text-3xl md:text-4xl lg:text-5xl font-bold pb-5'>Play Puzzles</h1>
            {display()}
        </div>
    )
}