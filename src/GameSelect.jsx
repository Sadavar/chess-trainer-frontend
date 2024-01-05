import { useState, useContext, useEffect } from 'react';
import { useAppContext } from './AppContext.jsx';
import axios from 'axios';
import { Button, ActionIcon, Card, Title, Text, Image, TextInput, Badge } from '@mantine/core';
import { Pagination, Checkbox } from '@mantine/core';

export default function GameSelect() {
    const [username, setUsername] = useState('');

    const [games, setGames] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [curr_games, setCurrGames] = useState([]);
    const [items, setItems] = useState([]);

    const { selectedGames, setSelectedGames } = useAppContext();

    async function handleGenerate() {
        console.log("generating");
        setSelectedGames([]);
        setActivePage(1);
        setItems([]);
        setGames([]);
        if (username == '') return;
        var games_found = await getGameArchives();
        if (games_found.length == 0) {
            console.log("no games found");
            return;
        }
        for (var game of games_found) {
            game.isSelected = false;
        }
        cleanGames(games_found);
    }

    async function getGameArchives() {
        console.log("getting game archives of: " + username);
        var url = 'https://api.chess.com/pub/player/' + username + '/games/archives'
        console.log(url);
        var res;
        try {
            res = await axios.get(url);
        } catch (err) {
            console.log(err);
            return [];
        }
        let archives = res.data.archives;

        var num_games_found = 0;
        var games_found = [];
        let curr_archive_num = archives.length - 1;

        while (num_games_found < 100) {
            url = new URL(archives[curr_archive_num]);
            try {
                res = await axios.get(url);
            } catch (err) {
                console.log(err);
                return;
            }
            let games = res.data.games;
            for (var game of games) {
                games_found.push(game);
                num_games_found += 1;
                if (num_games_found >= 100) {
                    break;
                }
            }
            curr_archive_num--;
        }

        console.log(games_found);
        return games_found;
    }

    function chunk(array, size) {
        if (!array.length) {
            return [];
        }
        const head = array.slice(0, size);
        const tail = array.slice(size);
        return [head, ...chunk(tail, size)];
    }

    const handleCheckboxChange = (game) => {
        console.log("checkbox changed");

        // Update games state with the new isSelected value for the clicked game
        const updatedGames = games.map((gameItem) =>
            gameItem.url === game.url ? { ...gameItem, isSelected: !gameItem.isSelected } : gameItem
        );

        // Update selectedGames based on the checkbox status
        setSelectedGames((prevSelectedGames) => {
            const index = prevSelectedGames.findIndex((gameItem) => gameItem.url === game.url);

            if (!game.isSelected) {
                console.log("adding game");
                if (index === -1) {
                    // Add the game if it doesn't exist in the array
                    return [...prevSelectedGames, game];
                }
            } else {
                console.log("deleting game");
                if (index !== -1) {
                    // Remove the game if it exists in the array
                    return [...prevSelectedGames.slice(0, index), ...prevSelectedGames.slice(index + 1)];
                }
            }

            // If no changes, return the current state
            return prevSelectedGames;
        });

        setGames(updatedGames);
        updateItems();
    };

    function updateItems() {
        console.log("selected games")
        console.log(selectedGames)
        console.log("getting items")
        var games_chunked = chunk(games, 10);
        var curr_games = games_chunked[activePage - 1];

        var items = curr_games.map((game) => (
            <div key={game.url} className="flex flex-row justify-around gap-5 pb-2 ">
                {/* Date Result Blitz/Rapid SelectButton*/}
                <Badge color="blue">{game.date}</Badge>
                <Badge color={game.result_color}>{game.result}</Badge>
                <Badge color="blue">{game.time_class}</Badge>
                <Checkbox
                    checked={game.isSelected}
                    onChange={() => handleCheckboxChange(game)}
                />
            </div>
        ))
        setItems(items);
    }

    function cleanGames(initial_games) {
        for (var game of initial_games) {
            //get date of the game from the pgn
            var pgn = game.pgn;
            var date = pgn.split("[Date ")[1].split("]")[0];
            date = date.substring(1, date.length - 1);
            // get whether the user won or lost
            var white = pgn.split("[White \"")[1].split("\"]")[0];
            var black = pgn.split("[Black \"")[1].split("\"]")[0];
            var result = pgn.split("[Result \"")[1].split("\"]")[0];
            if (white === username) {
                if (result === "1-0") {
                    game.result = "W";
                    game.result_color = "green";
                } else {
                    game.result = "L";
                    game.result_color = "red";
                }
            } else {
                if (result === "1-0") {
                    game.result = "L";
                    game.result_color = "red";
                } else {
                    game.result = "W";
                    game.result_color = "green";
                }
            }
            if (result === "1/2-1/2") {
                game.result = "D";
                game.result_color = "grey";
            }
            game.date = date;
        }
        setGames(initial_games);
    }

    useEffect(() => {
        if (games.length > 0) updateItems();
    }, [games, activePage])

    return (
        <>
            <div className="flex flex-row justify-center gap-2">
                <div className="flex flex-row justify-center gap-2">
                    <TextInput
                        placeholder="Chess.com Username"
                        value={username}
                        onChange={(event) => setUsername(event.currentTarget.value)}
                        size="md"
                    />
                    <Button
                        variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                        size="md"
                        onClick={handleGenerate}
                    >Generate</Button>
                </div>
            </div>
            <div className="pt-10">
                {games.length > 0 &&
                    <div className="w-screen flex flex-col items-center">
                        <div>
                            {items}
                        </div>
                        <div>
                            <Pagination total={10} value={activePage} onChange={setActivePage} mt="sm" />
                        </div>
                    </div>
                }
            </div>

        </>
    );
}


