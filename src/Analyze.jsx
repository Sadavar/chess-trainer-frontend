import { useState, useContext, useEffect } from 'react';
import PuzzleDisplay from './PuzzleDisplay.jsx';
import { useAppContext } from './AppContext.jsx';
import axios from 'axios';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'
import Header from './Header.jsx';
import Header2 from './Header2.jsx';

import { Group } from '@mantine/core';
import { Button, Card, Badge } from '@mantine/core';

import GameSelect from "./GameSelect.jsx";
import { Chessboard } from "react-chessboard";

ChartJS.register(...registerables);


export default function Analyze() {
    const [username, setUsername] = useState('');
    const [puzzles_found, setPuzzlesFound] = useState();

    const { selected_games_analyze, setSelectedGamesAnalyze } = useAppContext();

    const status_options = {
        Empty: "",
        GameSelect: "GameSelect",
        LoadingPuzzles: "LoadingPuzzles",
        NoPuzzlesFound: "NoPuzzlesFound",
        YesPuzzlesFound: "YesPuzzlesFound"
    }

    const [status, setStatus] = useState(status_options.GameSelect);
    const [game_info, setGameInfo] = useState({});
    const [loading_game_num, setLoadingGameNum] = useState(0);

    const [lineChartData, setLineChartData] = useState({
        labels: [],
        datasets: [
            {
                type: "line",
                data: []
            }
        ]
    });

    var lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Move Number'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Evaluation (CP)'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
    }

    // reset selectedGames and puzzleCounter when the analyze page is loaded
    useEffect(() => {
        console.error("resetting selected games");
        setSelectedGamesAnalyze([]);
    }, [])

    async function* getIterableStream(body) {
        if (!body || !body.getReader) {
            return;
        }
        const reader = body.getReader()
        const decoder = new TextDecoder()

        while (true) {
            const { value, done } = await reader.read()
            if (done) {
                break
            }
            const decodedChunk = decoder.decode(value, { stream: true })
            yield decodedChunk
        }
    }

    async function getPuzzles() {
        if (selected_games_analyze.length === 0) {
            console.error("no games selected");
            return;
        }
        setStatus(status_options.LoadingPuzzles);
        var puzzles = [];
        var game_num = 0;
        for (var game of selected_games_analyze) {
            game_num++;
            setLoadingGameNum(game_num);
            try {
                var tactics = await getTactics(game.pgn);
                console.error("tactics: ");
                console.error(tactics);
                if (tactics != null && tactics.length > 0) {
                    var info = getGameInfo(game.pgn);
                    for (var obj of tactics) {
                        var puzzle = {
                            start_FEN: obj.start_FEN,
                            end_FEN: obj.end_FEN,
                            turn_color: obj.turn_color,
                            game_info: info,
                        }
                        console.error("puzzles before: ");
                        console.error(puzzles);
                        puzzles = puzzles.concat(puzzle);
                        console.error("puzzles after: ");
                        console.error(puzzles);
                    }
                }
            } catch (err) {
                console.error(err);
                continue;
            }
        }

        if (puzzles.length === 0) {
            console.error("puzzles array empty");
            setStatus(status_options.NoPuzzlesFound);
            return;
        }

        console.error("Puzzles Found");
        setStatus(status_options.YesPuzzlesFound);
        console.error(puzzles);
        setPuzzlesFound(puzzles);
    }

    function getGameInfo(pgn) {
        var info = pgn.split('\n');

        var game_info = {
            date: info[2].split('"')[1],
            white: info[4].split('"')[1],
            black: info[5].split('"')[1],
            result: info[5].split('"')[1],
            white_elo: info[13].split('"')[1],
            black_elo: info[14].split('"')[1],
            time_control: info[15].split('"')[1],
            link: info[20].split('"')[1]
        }
        return game_info;
    }

    async function getTactics(pgn) {
        console.error("getting tactics of: " + pgn);

        var info = getGameInfo(pgn);
        setGameInfo(info);

        // get tactics
        const url = new URL(import.meta.env.VITE_BACKEND_URL + '/getTactics');
        try {
            var response = await fetch(
                url,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        pgn: pgn,
                        username: username
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )

            if (response.status !== 200) throw new Error(response.status.toString())
            if (!response.body) throw new Error('Response body does not exist')
        } catch (err) {
            console.error(err);
            return [];
        }

        // Generate eval straem
        const stream = getIterableStream(response.body);
        var chunk;
        var chunk_num = 0;
        var labels_arr = [];

        // reset chart data
        setLineChartData({
            labels: [],
            datasets: [
                {
                    type: "line",
                    data: []
                }
            ]
        });
        lineChartData.datasets[0].data = [];
        lineChartData.labels = [];

        for await (chunk of stream) {
            console.error(chunk);
            // break if the chunk is an array
            if (chunk[0] === '[') {
                break;
            }
            // create data point
            var data = JSON.parse(chunk);
            // add data point to chart data
            var old_chart_data = lineChartData.datasets[0];
            var new_chart_data = { ...old_chart_data };
            new_chart_data.data.push(data);
            labels_arr.push(chunk_num);

            const newChartData = {
                ...lineChartData,
                datasets: [new_chart_data],
                labels: labels_arr
            };
            setLineChartData(newChartData);
            chunk_num++;
        }
        //last chunk is the tactics array
        var tactics = chunk;
        if (tactics.length === 0) {
            console.error("no tactics found");
            return [];
        }
        console.error("Tactics before parse:")
        console.error(tactics);
        tactics = JSON.parse(tactics);
        console.error("tactics found: ");
        console.error(tactics);

        var tactics_found = [];
        for (var element of tactics) {
            var tactic = {
                start_FEN: element[0],
                end_FEN: element[1],
                turn_color: element[2]
            }
            tactics_found.push(tactic);
        }
        console.error("tactics found: ");
        console.error(tactics_found);
        return tactics_found;
    }

    function displayPuzzles() {
        if (status === status_options.YesPuzzlesFound) {
            console.error("displaying puzzles");
            console.error(puzzles_found);
            return <PuzzleDisplay puzzles_array={puzzles_found} isPlaying={false} />;
        }
    }

    function displayGameInfo() {
        return (
            <>
                <Card shadow="lg" padding="lg" radius="lg" withBorder>
                    <Group justify="space-between" mt="md" mb="xs">
                        <h1 className="text-xl font-bold">Game Being Analyzed</h1>
                        <Badge color="green"> {loading_game_num} / {selected_games_analyze.length}</Badge>
                    </Group>
                    <div> Date: {game_info.date} </div>
                    <div> White: {game_info.white} </div>
                    <div> Black: {game_info.black} </div>
                    <div> Result: {game_info.result} </div>
                    <div> White Elo: {game_info.white_elo} </div>
                    <div> Black Elo: {game_info.black_elo} </div>
                    <div> Time Control: {game_info.time_control} </div>
                </Card>
            </>
        );
    }

    function displayLoading() {
        if (status === status_options.LoadingPuzzles) {
            return (
                <div className="h-3/5 grid grid-cols-12 gap-4 pt-5">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">
                        {displayGameInfo()}
                    </div>
                    <div className="col-span-5">
                        <Chart options={lineChartOptions} data={lineChartData} />
                    </div>
                    <div className="col-span-1"></div>
                </div>
            );
        }
    }

    function handleAnalyze() {
        console.error("analyzing");
        console.error("selected games");
        console.error(selected_games_analyze);
        setPuzzlesFound([]);

        getPuzzles();
    }

    function displayAnalyzeButton() {
        if (status === status_options.GameSelect && selected_games_analyze.length > 0) {
            return (
                <div className="pt-5">
                    <Button
                        variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                        className="gradientButton opacityHover"
                        onClick={handleAnalyze}
                    >Analyze</Button>
                </div>
            );
        }
    }

    function displayGameSelect() {
        if (status === status_options.GameSelect) {
            return (
                <div className="flex flex-col items-center">
                    <div>
                        <GameSelect />
                    </div>
                    <div className="">
                        {displayAnalyzeButton()}
                    </div>
                </div>
            );
        }
    }

    return (
        <>
            <div className="h-screen">
                <div className="h-1/5">
                    <Header />
                    <h1 className="text-5xl text-center font-bold pb-5">Find Puzzles</h1>
                </div>
                <div className="h-4/5 pt-5">
                    <div>
                        {displayGameSelect()}
                    </div>
                    <div>
                        {displayLoading()}
                    </div>
                    <div>
                        {displayPuzzles()}
                    </div>
                </div>
            </div >
        </>

    );
}


