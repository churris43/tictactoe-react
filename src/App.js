import { useState } from "react";

function Square({ value, onSquareClick, class_name = "square" }) {
  return (
    <button className={class_name} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    {
      boardStatus: Array(9).fill(null),
      coordinates: "0,0",
    },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].boardStatus;

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    let description;
    console.log(history);
    description =
      move > 0
        ? "Go to move #  " + move + " Ticked:" + history[move].coordinates
        : "Go to Game start";
    if (move === currentMove) {
      return (
        <span>
          You are in move {currentMove}{" "}
          {move > 0 ? "Ticked:" + history[move].coordinates : ""}
        </span>
      );
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

  function handlePlay(nextSquares, row, col) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { boardStatus: nextSquares, coordinates: row + "," + col },
    ];
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
  function handleClick(i, row, col) {
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
    onPlay(nextSquares, row, col);
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
          onSquareClick={() => handleClick(squareIndex, i + 1, j + 1)}
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
