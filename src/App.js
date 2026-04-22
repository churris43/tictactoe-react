import { useState } from "react";

function Square({ value, onSquareClick, class_name = "square" }) {
  return (
    <button className={class_name} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    description = move > 0 ? "Go to move #" + move : "Go to Game start";
    if (move === currentMove) {
      return <span> You are in move {currentMove}</span>;
    } else {
      return (
        <>
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        </>
      );
    }
  });

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const { winner, line } = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const { winner, line } = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.filter((v) => v !== null).length === 9) {
    status = "This is a draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  const items = [];
  let currentSquareNumber = 0;
  for (let i = 0; i <= 2; i++) {
    const rowSquares = [];
    for (let j = 0; j <= 2; j++) {
      const squareIndex = currentSquareNumber;
      rowSquares.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          class_name={line.includes(squareIndex) ? "square_winner" : "square"}
        />,
      );
      currentSquareNumber++;
    }
    items.push(
      <div key={i} className="board-row">
        {rowSquares}
      </div>,
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {items}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return { winner: null, line: [] };
}
