import "./Square.css";

function Square({ value, onClick, isWinningSquare }) {
  const squareClass = `square ${value ? `square-${value.toLowerCase()}` : ""} ${
    isWinningSquare ? "winning" : ""
  }`;

  return (
    <button
      className={squareClass}
      onClick={onClick}
      aria-label={value ? `Square with ${value}` : "Empty square"}
    >
      {value}
    </button>
  );
}

export default Square;
