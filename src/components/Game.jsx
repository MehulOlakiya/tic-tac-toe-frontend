import { useState, useEffect } from "react";
import Board from "./Board";
import "./Game.css";

function Game({ socket, gameId, playerId, playerSymbol, opponentConnected }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(playerSymbol === "X");
  const [winningCombination, setWinningCombination] = useState([]);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  useEffect(() => {
    if (!socket) return;

    socket.on("move_made", (data) => {
      setBoard(data.board);
      setIsXNext(data.currentTurn === "X");
      setIsMyTurn(data.currentTurn === playerSymbol);
    });

    socket.on("game_over", (data) => {
      setBoard(data.board);
      if (data.winner && data.winner !== "draw") {
        setWinner(data.winner);
        setWinningCombination(data.winningCombination || []);

        setScores((prevScores) => ({
          ...prevScores,
          [data.winner]: prevScores[data.winner] + 1,
        }));
      } else if (data.winner === "draw") {
        setIsDraw(true);
      }
    });

    socket.on("game_reset", (data) => {
      resetGameState(data.board, data.currentTurn === "X");
    });

    socket.on("opponent_joined", (data) => {
      resetGameState(Array(9).fill(null), true);

      setScores({ X: 0, O: 0 });

      setIsMyTurn(playerSymbol === "X");
    });

    socket.on("game_state_update", (data) => {
      if (data.status === "in_progress") {
        resetGameState(Array(9).fill(null), true);
        setScores({ X: 0, O: 0 });
        setIsMyTurn(playerSymbol === "X");
      }
    });

    socket.on("game_state", (data) => {
      setBoard(data.board);
      setIsXNext(data.currentTurn === "X");
      setIsMyTurn(data.currentTurn === playerSymbol);

      if (data.status === "completed") {
        if (data.winner && data.winner !== "draw") {
          setWinner(data.winner);
          setWinningCombination(data.winningCombination || []);

          setScores((prevScores) => ({
            ...prevScores,
            [data.winner]: prevScores[data.winner] + 1,
          }));
        } else if (data.winner === "draw") {
          setIsDraw(true);
        }
      }
    });

    socket.on("game_restored", (data) => {
      if (data.gameState) {
        setBoard(data.gameState.board || Array(9).fill(null));
        setIsXNext(data.gameState.currentTurn === "X");
        setIsMyTurn(data.gameState.currentTurn === playerSymbol);
        setWinner(data.gameState.winner || null);
        setIsDraw(data.gameState.isDraw || false);
        setWinningCombination(data.gameState.winningCombination || []);
        setScores(data.gameState.scores || { X: 0, O: 0 });
      }
    });

    return () => {
      socket.off("move_made");
      socket.off("game_over");
      socket.off("game_reset");
      socket.off("opponent_joined");
      socket.off("game_state_update");
      socket.off("game_state");
      socket.off("game_restored");
    };
  }, [socket, playerSymbol]);

  const handleClick = (i) => {
    if (!isMyTurn || winner || isDraw || board[i] || !opponentConnected) {
      return;
    }

    socket.emit("make_move", {
      gameId,
      position: i,
      symbol: playerSymbol,
    });
  };

  const resetGameState = (newBoard = Array(9).fill(null), xIsNext = true) => {
    setBoard(newBoard);
    setIsXNext(xIsNext);
    setWinner(null);
    setIsDraw(false);
    setIsMyTurn(playerSymbol === "X");
    setWinningCombination([]);
  };

  const requestReset = () => {
    socket.emit("reset_game", { gameId });
  };

  let status;
  if (winner) {
    status = winner === playerSymbol ? "You won!" : "Opponent won!";
  } else if (isDraw) {
    status = "Game ended in a draw";
  } else if (!opponentConnected) {
    status = "Waiting for opponent to reconnect...";
  } else {
    status = isMyTurn ? "Your turn" : "Opponent's turn";
  }

  return (
    <div className="game">
      <div className="score-board">
        <div className="score">
          <span className="player-x">X: {scores.X}</span>
          <span className="player-o">O: {scores.O}</span>
        </div>
      </div>
      <div className="game-board">
        <Board
          squares={board}
          onClick={handleClick}
          highlightWinner={winningCombination}
        />
      </div>
      <div className="game-info">
        <div
          className={`status ${winner ? "winner" : ""} ${isDraw ? "draw" : ""}`}
        >
          {status}
        </div>
        {(winner || isDraw) && opponentConnected && (
          <button className="reset-button" onClick={requestReset}>
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}

export default Game;
