import { useState, useEffect } from "react";
import "./WaitingRoom.css";

function WaitingRoom({
  createGame,
  joinGame,
  availableGames,
  refreshGames,
  username,
  setUsername,
}) {
  const [gameIdInput, setGameIdInput] = useState("");

  const handleJoinGame = (e) => {
    e.preventDefault();
    if (gameIdInput.trim()) {
      joinGame(gameIdInput.trim());
    }
  };

  const handleJoinAvailableGame = (gameId) => {
    joinGame(gameId);
  };

  return (
    <div className="waiting-room">
      <div className="username-section">
        <label htmlFor="username">Your Name:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          className="username-input"
        />
      </div>

      <div className="options">
        <div className="option">
          <h2>Create a New Game</h2>
          <p>Start a new game and invite a friend to play</p>
          <button onClick={createGame} className="create-button">
            Create Game
          </button>
        </div>

        <div className="option">
          <h2>Join a Game</h2>
          <p>Enter a game ID to join an existing game</p>
          <form onSubmit={handleJoinGame}>
            <input
              type="text"
              value={gameIdInput}
              onChange={(e) => setGameIdInput(e.target.value)}
              placeholder="Enter Game ID"
              className="game-id-input"
            />
            <button type="submit" className="join-button">
              Join Game
            </button>
          </form>
        </div>
      </div>

      <div className="available-games">
        <div className="available-games-header">
          <h2>Available Games</h2>
          <button onClick={refreshGames} className="refresh-button">
            <span className="refresh-icon">↻</span> Refresh Games
          </button>
        </div>
        <div className="games-list">
          {availableGames.length > 0 ? (
            availableGames.map((game) => (
              <div key={game.gameId} className="game-item">
                <span>Game by {game.players[0]?.username || "Player 1"}</span>
                <button
                  onClick={() => handleJoinAvailableGame(game.gameId)}
                  className="join-button"
                >
                  Join
                </button>
              </div>
            ))
          ) : (
            <div className="no-games">
              No games available. Create one or wait for others to create games.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;
