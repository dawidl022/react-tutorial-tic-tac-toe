import React from 'react';
import { Board } from './Board';
import {
  Order,
  History,
  Snapshot,
  SquareValue,
  HighlightedSquares,
} from './types';

export class Game extends React.Component {
  state: {
    history: History;
    xIsNext: boolean;
    stepNumber: number;
    order: Order;
  };

  constructor(props: {}) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastMove: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      order: Order.ASC,
    };
  }

  get current(): Snapshot {
    const history = this.state.history;
    return history[this.state.stepNumber];
  }

  handleClick(i: number) {
    const squares = this.current.squares.slice();
    if (this.calculateWinner(squares)[0] !== null || squares[i] != null) {
      return;
    }
    const history = this.state.history.slice(0, this.state.stepNumber + 1);

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const row = Math.floor(i / 3);
    const col = i % 3;
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastMove: { col, row },
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  calculateWinner(squares: SquareValue[]): [SquareValue, HighlightedSquares] {
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
  }

  isDraw(squares: SquareValue[]) {
    return squares.filter(s => s != null).length === 9;
  }

  jumpTo(move: number) {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 === 0,
    });
  }

  toggleMoveOrder() {
    this.setState({
      order: this.state.order === Order.ASC ? Order.DESC : Order.ASC,
    });
  }

  render() {
    const [winner, highlightedSquares] = this.calculateWinner(
      this.current.squares
    );

    const moves = this.state.history.map((_, moveIndex) => {
      const location = this.state.history[moveIndex].lastMove;
      const desc =
        moveIndex == 0
          ? 'Go to game start'
          : `Go to move #${moveIndex} (${location?.col}, ${location?.row})`;
      return (
        <li key={moveIndex}>
          <button onClick={() => this.jumpTo(moveIndex)}>
            {moveIndex == this.state.stepNumber ? (
              <strong>{desc}</strong>
            ) : (
              desc
            )}
          </button>
        </li>
      );
    });

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
            highlightedSquares={highlightedSquares}
            onClick={i => this.handleClick(i)}
          />
          <button onClick={() => this.toggleMoveOrder()}>
            Sort moves in{' '}
            {this.state.order === Order.ASC ? 'descending' : 'ascending'} order
          </button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol reversed={this.state.order === Order.DESC}>
            {this.state.order === Order.ASC ? moves : [...moves].reverse()}
          </ol>
        </div>
      </div>
    );
  }
}
