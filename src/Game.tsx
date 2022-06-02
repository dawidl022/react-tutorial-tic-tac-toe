import { FC, useState } from 'react';
import { Board } from './Board';
import {
  Order,
  History,
  Snapshot,
  SquareValue,
  HighlightedSquares,
} from './types';

export const Game: FC = () => {
  const [history, setHistory] = useState<History>([
    {
      squares: Array(9).fill(null),
      lastMove: null,
    },
  ]);
  const [stepNumber, setStepNumber] = useState<number>(0);
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [order, setOrder] = useState<Order>(Order.ASC);

  const current = (): Snapshot => {
    return history[stepNumber];
  };

  const handleClick = (i: number): void => {
    const squares = current().squares.slice();
    if (calculateWinner(squares)[0] !== null || squares[i] != null) {
      return;
    }
    const newHistory = history.slice(0, stepNumber + 1);

    squares[i] = xIsNext ? 'X' : 'O';

    const row = Math.floor(i / 3);
    const col = i % 3;
    setHistory(
      newHistory.concat([
        {
          squares: squares,
          lastMove: { col, row },
        },
      ])
    );
    setStepNumber(newHistory.length);
    setXIsNext(!xIsNext);
  };

  const calculateWinner = (
    squares: SquareValue[]
  ): [SquareValue, HighlightedSquares] => {
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
      if (
        squares[a] != null &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return [squares[a], [a, b, c]];
      }
    }
    return [null, null];
  };

  const isDraw = (squares: SquareValue[]): boolean =>
    squares.filter(s => s != null).length === 9;

  const jumpTo = (move: number) => {
    setStepNumber(move);
    setXIsNext(move % 2 === 0);
  };

  const toggleMoveOrder = () =>
    setOrder(order === Order.ASC ? Order.DESC : Order.ASC);

  const [winner, highlightedSquares] = calculateWinner(current().squares);

  const moves = history.map((_, moveIndex) => {
    const location = history[moveIndex].lastMove;
    const desc =
      moveIndex == 0
        ? 'Go to game start'
        : `Go to move #${moveIndex} (${location?.col}, ${location?.row})`;
    return (
      <li key={moveIndex}>
        <button onClick={() => jumpTo(moveIndex)}>
          {moveIndex == stepNumber ? <strong>{desc}</strong> : desc}
        </button>
      </li>
    );
  });

  const status = winner
    ? `Winner: ${winner}`
    : isDraw(current().squares)
    ? 'Draw'
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current().squares}
          highlightedSquares={highlightedSquares}
          onClick={i => handleClick(i)}
        />
        <button onClick={() => toggleMoveOrder()}>
          Sort moves in {order === Order.ASC ? 'descending' : 'ascending'} order
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol reversed={order === Order.DESC}>
          {order === Order.ASC ? moves : [...moves].reverse()}
        </ol>
      </div>
    </div>
  );
};
