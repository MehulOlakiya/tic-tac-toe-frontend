import "./GameInfo.css";

function GameInfo({ gameId, playerSymbol, opponentConnected, username }) {
  const displayName =
    username || (playerSymbol === "X" ? "Player 1" : "Player 2");
  const opponentName = playerSymbol === "X" ? "Player 2" : "Player 1";

  return (
    <div className="game-info-container">
      <div className="game-details">
        <p>
          Game ID: <span className="game-id">{gameId}</span>
        </p>
        <p>
          You ({displayName}):{" "}
          <span className="player-symbol">{playerSymbol}</span>
        </p>
      </div>
      <div
        className={`opponent-status ${
          opponentConnected ? "connected" : "disconnected"
        }`}
      >
        {opponentConnected
          ? `${username} connected`
          : `Waiting for opponent...`}
      </div>
    </div>
  );
}

export default GameInfo;
