"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./App.css";
import Game from "./components/Game";
import WaitingRoom from "./components/WaitingRoom";
import ConnectionStatus from "./components/ConnectionStatus";
import GameInfo from "./components/GameInfo";

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null);
  const [opponentConnected, setOpponentConnected] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [availableGames, setAvailableGames] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";
    const newSocket = io(BACKEND_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
      setOpponentConnected(false);
      setGameStarted(false);
      console.log("Disconnected from server");
    });

    newSocket.on("game_created", (data) => {
      setGameId(data.gameId);
      setPlayerId(data.playerId);
      setPlayerSymbol(data.symbol);
      setUsername(data.username || "Player 1");
      console.log(`Game created: ${data.gameId}`);
    });

    newSocket.on("game_joined", (data) => {
      setGameId(data.gameId);
      setPlayerId(data.playerId);
      setPlayerSymbol(data.symbol);
      setOpponentConnected(true);
      setGameStarted(true);
      setUsername(data.username);
      console.log(`Joined game: ${data.gameId}`);
    });

    newSocket.on("opponent_joined", () => {
      setOpponentConnected(true);
      setGameStarted(true);
      console.log("Opponent joined the game");
    });

    newSocket.on("game_state_update", (data) => {
      if (data.status === "in_progress") {
        setGameStarted(true);
        setOpponentConnected(true);
      }
    });

    newSocket.on("opponent_disconnected", () => {
      setOpponentConnected(false);
      console.log("Opponent disconnected");
    });

    newSocket.on("opponent_reconnected", () => {
      setOpponentConnected(true);
      console.log("Opponent reconnected");
    });

    newSocket.on("available_games", (data) => {
      setAvailableGames(data.games);
    });

    newSocket.on("error", (data) => {
      console.error("Socket error:", data.message);
      alert(`Error: ${data.message}`);
    });

    return () => {
      if (gameId && playerId) {
        newSocket.emit("player_disconnected", {
          gameId: gameId,
          playerId: playerId,
        });
      }
      window.removeEventListener("beforeunload", () => {});
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && connected && !gameId) {
      socket.emit("get_available_games");
    }
  }, [socket, connected, gameId]);

  const createGame = () => {
    if (socket) {
      socket.emit("create_game", { username: username || "Player 1" });
    }
  };

  const joinGame = (id) => {
    if (socket) {
      socket.emit("join_game", {
        gameId: id,
        username: username,
      });
    }
  };

  const refreshGames = () => {
    if (socket) {
      socket.emit("get_available_games");
    }
  };

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>

      <ConnectionStatus connected={connected} />

      {connected && !gameId && (
        <WaitingRoom
          createGame={createGame}
          joinGame={joinGame}
          availableGames={availableGames}
          refreshGames={refreshGames}
          username={username}
          setUsername={setUsername}
        />
      )}

      {connected && gameId && (
        <>
          <GameInfo
            gameId={gameId}
            playerSymbol={playerSymbol}
            opponentConnected={opponentConnected}
            username={username}
          />

          {gameStarted && (
            <Game
              socket={socket}
              gameId={gameId}
              playerId={playerId}
              playerSymbol={playerSymbol}
              opponentConnected={opponentConnected}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
