import { useState, useContext, useEffect } from 'react';
import { Chessboard } from "react-chessboard";
import Chess from "chess";
import PuzzleDisplay from './PuzzleDisplay.js';
import { AppContext } from './AppContext';
import axios from 'axios';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2'

import { Button, Input, Col, Row, Space, Typography, Card, Statistic } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
const { Text, Link, Title } = Typography



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
    const [game_info, setGameInfo] = useState({});
    const [window_width, setWindowWidth] = useState(window.innerWidth);
    const [loading_game_num, setLoadingGameNum] = useState(0);


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
        var games = [];
        var months_tried = 0;
        var num_games = 0;
        var num_games_analyzing = 3;

        // Grab chess games from the last 2 years
        setStatus("Loading Games from Chess.com...");
        while (months_tried < 24 && num_games < num_games_analyzing) {
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
                    if (num_games >= num_games_analyzing) {
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
        var game_num = 0;
        for (var game of games) {
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

    function displayGameInfo() {
        if (status == "Loading Tactics...") {
            var title = "Game Being Analyzed" + " (" + loading_game_num + "/" + 10 + ")";
            return (
                <Card title={title} bordered={false}>
                    <div> Date: {game_info.date} </div>
                    <div> White: {game_info.white} </div>
                    <div> Black: {game_info.black} </div>
                    <div> Result: {game_info.result} </div>
                    <div> White Elo: {game_info.white_elo} </div>
                    <div> Black Elo: {game_info.black_elo} </div>
                    <div> Time Control: {game_info.time_control} </div>
                </Card>
            );
        }
    }

    function displayLoadingInfo() {
        if (window_width < 1000) {
            return (
                <>
                    <Row>
                        <Col span={24} align="middle">
                            {displayChart()}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} align="middle">
                            {displayGameInfo()}
                        </Col>
                    </Row>
                </>
            );
        }
        else {
            return (
                <Row >
                    <Col span={3}></Col>
                    <Col span={7} align="middle">
                        {displayGameInfo()}
                    </Col>
                    <Col span={12} align="middle">
                        {displayChart()}
                    </Col>
                    <Col span={2}></Col>
                </Row>

            );
        }
    }


    var lineChartOptions = {
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
        responsive: "true",
        maintainAspectRatio: "false"

    }

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize)
    })

    return (
        <div>
            <Row align="middle" >
                <Col span={24} align="middle">
                    <Title> Chess Trainer</Title>
                </Col>
            </Row>

            <Row>
                <Col span={24} align="middle">
                    <Input
                        placeholder="Chess.com Username"
                        onChange={(event) => setUsername(event.target.value)}
                        value={username}
                        size="default"
                        style={{ width: 200 }}
                    />
                    <Button
                        onClick={handleGenerate}
                        type="primary"
                        size="default"
                    > Generate
                    </Button>
                </Col>
            </Row>
            <Row >
                <Col span={24} align="middle">
                    <Text> {status} </Text>
                </Col>
            </Row>

            {displayLoadingInfo()}

            {/* <Row >
                <Col span={3}></Col>
                <Col span={7} align="middle">
                    {displayGameInfo()}
                </Col>
                <Col span={12} align="middle">
                    {displayChart()}
                </Col>
                <Col span={2}></Col>
            </Row> */}

            {displayTactics()}

        </div >
    );
}


