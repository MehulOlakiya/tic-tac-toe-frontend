import React, { useEffect, useState } from "react";

const GameBoard = ({ gameId, playerId, symbol, username, socket }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState("X");
  const [scores, setScores] = useState([]);
  const [gameStatus, setGameStatus] = useState("in_progress");
  const [winningCombination, setWinningCombination] = useState(null);
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("move_made", ({ board, currentTurn, scores }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
      setScores(scores);
    });

    socket.on("game_over", ({ board, winner, winningCombination, scores }) => {
      setBoard(board);
      setGameStatus("completed");
      setWinningCombination(winningCombination);
      setScores(scores);
    });

    socket.on("game_reset", ({ board, currentTurn }) => {
      setBoard(board);
      setCurrentTurn(currentTurn);
      setGameStatus("in_progress");
      setWinningCombination(null);
    });

    socket.on("opponent_disconnected", ({ playerId, scores }) => {
      setOpponentDisconnected(true);
      setScores(scores);
      setGameStatus("waiting");
      setBoard(Array(9).fill(null));
      setCurrentTurn("X");
      setWinningCombination(null);
    });

    return () => {
      socket.off("move_made");
      socket.off("game_over");
      socket.off("game_reset");
      socket.off("opponent_disconnected");
    };
  }, [socket]);

  const handleCellClick = (index) => {
    if (
      board[index] ||
      gameStatus === "completed" ||
      currentTurn !== symbol ||
      opponentDisconnected
    )
      return;
    socket.emit("make_move", { gameId, position: index, symbol });
  };

  const renderCell = (index) => {
    const isWinningCell = winningCombination?.includes(index);
    return (
      <div
        key={index}
        className={`cell${isWinningCell ? " winning" : ""}`}
        onClick={() => handleCellClick(index)}
      >
        {board[index]}
      </div>
    );
  };

  const getScore = (symbol) => {
    const player = scores.find((p) => p && p.symbol === symbol);
    return player ? player.score : 0;
  };

  return (
    <div className="game-container">
      <div className="score-board">
        <div className="player-score">
          <h3>Player X</h3>
          <p>Score: {getScore("X")}</p>
        </div>
        <div className="player-score">
          <h3>Player O</h3>
          <p>Score: {getScore("O")}</p>
        </div>
      </div>
      <div className="game-board">{board.map((_, idx) => renderCell(idx))}</div>
      <div className="game-status">
        {opponentDisconnected ? (
          <h2>Opponent disconnected. Waiting for new opponent...</h2>
        ) : gameStatus === "completed" ? (
          <h2>
            {winningCombination
              ? `Player ${currentTurn === "X" ? "O" : "X"} wins!`
              : "It's a draw!"}
          </h2>
        ) : (
          <h2>Current Turn: Player {currentTurn}</h2>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
