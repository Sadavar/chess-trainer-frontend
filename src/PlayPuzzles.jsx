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

    return (
        <div>
            <Header />
            <h1 className='text-center text-5xl font-bold pb-5'>Play Puzzles</h1>
            <div className="">
                <PuzzleDisplay puzzles_array={puzzles_array_play} isPlaying={true} />
            </div>
        </div>
    )
}