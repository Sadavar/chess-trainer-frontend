import { useState, useContext, useEffect } from 'react';
import PuzzleDisplay from './PuzzleDisplay.jsx';
import { useAppContext } from './AppContext.jsx';
import axios from 'axios';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'
import Header from './Header.jsx';

import { Group } from '@mantine/core';
import { Button, Card, Badge } from '@mantine/core';

import GameSelect from "./GameSelect.jsx";
import { Chessboard } from "react-chessboard";

ChartJS.register(...registerables);


export default function Analyze() {
    const [username, setUsername] = useState('');
    const [tactics, setTactics] = useState([]);
    const [tacticsLoaded, setTacticsLoaded] = useState(false);

    const { selectedGames, puzzle_counter, setPuzzleCounter } = useAppContext();

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

    const status_options = {
        Empty: "",
        GameSelect: "GameSelect",
        LoadingPuzzles: "LoadingPuzzles",
        NoPuzzlesFound: "NoPuzzlesFound",
        YesPuzzlesFound: "YesPuzzlesFound"
    }

    const [status, setStatus] = useState(status_options.GameSelect);
    const [game_info, setGameInfo] = useState({});
    const [window_width, setWindowWidth] = useState(window.innerWidth);
    const [loading_game_num, setLoadingGameNum] = useState(0);

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
        if (selectedGames.length === 0) {
            console.log("no games selected");
            return;
        }
        // Generate tactics from the games
        setStatus(status_options.LoadingPuzzles);
        var tactics_found = [];
        var game_num = 0;
        for (var game of selectedGames) {
            game_num++;
            setLoadingGameNum(game_num);
            try {
                var tactic = await getTactics(game.pgn);
                if (tactic != null) {
                    tactics_found = tactics_found.concat(tactic);
                }
            } catch (err) {
                console.log(err);
                continue;
            }
        }

        if (tactics_found.length === 0) {
            console.log("tactics array empty");
            setStatus(status_options.NoPuzzlesFound);
            return;
        }

        console.log("Puzzles Found");
        setStatus(status_options.YesPuzzlesFound);
        console.log(tactics_found);
        setTactics(tactics_found);
    }

    async function getTactics(pgn) {
        console.log("getting tactics of: " + pgn);

        var info = pgn.split('\n');

        var game_info = {
            date: info[2].split('"')[1],
            white: info[4].split('"')[1],
            black: info[5].split('"')[1],
            result: info[5].split('"')[1],
            white_elo: info[13].split('"')[1],
            black_elo: info[14].split('"')[1],
            time_control: info[15].split('"')[1]
        }
        setGameInfo(game_info);

        const url = new URL('https://chess-trainer-python-b932ead51c12.herokuapp.com/getTactics');
        // const url = new URL('http://127.0.0.1:5000/getTactics');
        // const url = new URL('https://chess-trainer-python-2jxttd4vc-sadavars-projects.vercel.app' + '/getTactics');
        // const url = new URL('https://web-production-27420.up.railway.app/getTactics');
        var response;
        // get tactics
        try {
            response = await fetch(
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
            console.log(err);
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
            console.log(chunk);
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
            console.log("new chart data: " + new_chart_data.data);

            labels_arr.push(chunk_num);

            const newChartData = {
                ...lineChartData,
                datasets: [new_chart_data],
                labels: labels_arr
            };

            console.log("labels: " + newChartData.labels);
            console.log("data: " + newChartData.datasets[0].data);

            setLineChartData(newChartData);
            chunk_num++;
        }
        //last chunk is the tactics array
        var tactics = chunk;
        if (tactics.length === 0) {
            console.log("no tactics found");
            return [];
        }
        tactics = JSON.parse(tactics);
        console.log("tactics found: ");
        console.log(tactics);
        return tactics;
    }

    function displayPuzzles() {
        if (status === status_options.YesPuzzlesFound) {
            return <PuzzleDisplay FEN_array={tactics} />;
        }
    }

    function displayGameInfo() {
        return (
            <>
                <Card shadow="lg" padding="lg" radius="lg" withBorder>
                    <Group justify="space-between" mt="md" mb="xs">
                        <h1 className="text-xl font-bold">Game Being Analyzed</h1>
                        <Badge color="green"> {loading_game_num} / {selectedGames.length}</Badge>
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
        console.log("analyzing");
        setTacticsLoaded(false);
        setTactics([]);
        setPuzzleCounter(0);

        getPuzzles();
    }

    function displayAnalyzeButton() {
        if (status === status_options.GameSelect && selectedGames.length > 0) {
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
                    <div>
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
                <div className="h-4/5 pt-10">
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


