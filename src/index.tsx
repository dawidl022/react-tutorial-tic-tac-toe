import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
}

interface BoardProps {
  squares: SquareValue[];
  onClick: (i: number) => void;
}

type History = Snapshot[];
interface Snapshot {
  squares: BoardValues;
}

type BoardValues = SquareValue[];

type SquareValue = 'X' | 'O' | null;

const Square: FC<SquareProps> = props => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

const Board: FC<BoardProps> = props => {
  function renderSquare(i: number) {
    return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

class Game extends React.Component {
  state: { history: History; xIsNext: boolean };

  constructor(props: {}) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
    };
  }

  get current(): Snapshot {
    const history = this.state.history;
    return history[history.length - 1];
  }

  handleClick(i: number) {
    const squares = this.current.squares.slice();
    if (this.calculateWinner(squares) || squares[i] != null) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: this.state.history.concat([
        {
          squares: squares,
        },
      ]),
      xIsNext: !this.state.xIsNext,
    });
  }

  calculateWinner(squares: SquareValue[]) {
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
        return squares[a];
      }
    }
    return null;
  }

  isDraw(squares: SquareValue[]) {
    return squares.filter(s => s != null).length === 9;
  }

  render() {
    const winner = this.calculateWinner(this.current.squares);

    const status = winner
      ? `Winner: ${winner}`
      : this.isDraw(this.current.squares)
      ? 'Draw'
      : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);
