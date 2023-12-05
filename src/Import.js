import { useState, useContext, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import Chess from "chess";
import PuzzleDisplay from './PuzzleDisplay.js';
import { AppContext } from './AppContext';
import axios from 'axios';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'
ChartJS.register(...registerables);


export default function Import() {
    const [username, setUsername] = useState('');
    const [tactics, setTactics] = useState([]);
    const [tacticsLoaded, setTacticsLoaded] = useState(false);
    const { puzzle_counter, setPuzzleCounter } = useContext(AppContext);
    const [lineChartData, setLineChartData] = useState({
        labels: [],
        datasets: [
            {
                type: "line",
                data: []
            }
        ]
    });

    const [status, setStatus] = useState("");

    async function handleStream() {
        console.log("streaming");
        const stream = await generateStream()
        for await (const chunk of stream) {
            console.log(chunk)
        }
    }

    const generateStream = async () => {
        const url = new URL('http://127.0.0.1:5000/getTactics');
        const response = await fetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({
                    pgn: "1. e4 e5 2. Nc3 Nc6",
                    username: "sadavar"
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )

        if (response.status !== 200) throw new Error(response.status.toString())
        if (!response.body) throw new Error('Response body does not exist')

        return getIterableStream(response.body)
    }

    async function* getIterableStream(body) {
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

    async function handleGenerate() {
        console.log("generating");
        if (username == '') return;
        setTacticsLoaded(false);
        setTactics([]);
        setPuzzleCounter(0);

        getPGNs();
    }

    async function getPGNs() {
        console.log("getting pgns of: " + username);
        var date = new Date();
        var current_year = date.getFullYear();
        var data_retreived = false;
        var games = [];
        var months_tried = 0;
        var num_games = 0;

        // Grab chess games from the last 2 years
        setStatus("Loading Games from Chess.com...");
        while (months_tried < 24 && num_games < 10) {
            console.log(date);

            if (date.getMonth() == 0) {
                date.setFullYear(date.getFullYear() - 1);
                date.setMonth(11);
            }
            var chess_api_url = new URL('https://api.chess.com/pub/player/' + username + '/games/' + date.getFullYear() + '/');
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var url = chess_api_url + month;
            months_tried++;

            try {
                var res = await axios.get(url);
                console.log(res);
            } catch (err) {
                console.log(err);
                setStatus("Error Loading Games");
                return;
            }

            if (res.data.games.length == 0) {
                console.log("no games found for" + date.getFullYear() + "/" + month);
                date.setMonth(date.getMonth() - 1);
            } else {
                for (var game of res.data.games) {
                    if (num_games >= 10) {
                        break;
                    }
                    games.push(game);
                    num_games++;
                }
            }
        }

        if (num_games == 0) {
            console.log("No games found");
            setStatus("No Games Found");
            return;
        }

        // Generate tactics from the games
        setStatus("Loading Tactics...");
        var tactics_found = [];
        for (var game of games) {
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

        if (tactics_found.length == 0) {
            console.log("tactics array empty");
            setStatus("No Tactics Found");
            return;
        }


        console.log("tactics loaded!");
        console.log(tactics_found);
        setTacticsLoaded(true);
        setTactics(tactics_found);
        setStatus("");
    };

    async function getTactics(pgn) {
        console.log("getting tactics of: " + pgn);

        // const url = new URL('https://chess-trainer-python-b932ead51c12.herokuapp.com/getTactics');
        const url = new URL('http://127.0.0.1:5000/getTactics');
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
                        // 'Access-Control-Allow-Origin': '*'
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
            if (chunk[0] == '[') {
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
        if (tactics.length == 0) {
            console.log("no tactics found");
            return [];
        }
        tactics = JSON.parse(tactics);
        console.log("tactics found: ");
        console.log(tactics);
        return tactics;
    }

    function displayTactics() {
        if (tacticsLoaded) {
            return <PuzzleDisplay FEN_array={tactics} />;
        }
    }

    function displayChart() {
        if (status == "Loading Tactics...") {
            return <Chart options={lineChartOptions} data={lineChartData} />
        }
    }

    var lineChartOptions = {
        // responsive: true,
        // maintainAspectRatio: false,
        // tooltips: {
        //     enabled: true
        // },
        // // scales: {
        // //     xAxes: [
        // //         {
        // //             ticks: {
        // //                 autoSkip: true,
        // //                 maxTicksLimit: 10
        // //             }
        // //         }
        // //     ]
        // // }

    }

    return (
        <div>
            <h1> Chess Trainer </h1>
            <input
                type="text"
                id="username-input"
                name="username-input"
                placeholder="Chess.com Username"
                onChange={(event) => setUsername(event.target.value)}
                value={username}
            />
            <button onClick={handleGenerate}> Generate </button>
            <button onClick={handleStream}> Stream! </button>

            <div> {status} </div>

            {displayTactics()}

            {displayChart()}

        </div>
    );
}


