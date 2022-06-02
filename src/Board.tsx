import { FC } from 'react';
import { Square } from './Square';
import { HighlightedSquares, SquareValue } from './types';

interface BoardProps {
  squares: SquareValue[];
  highlightedSquares: HighlightedSquares;
  onClick: (i: number) => void;
}

export const Board: FC<BoardProps> = props => {
  function renderSquare(i: number) {
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        key={i}
        highlighted={
          (props.highlightedSquares && props.highlightedSquares.includes(i)) ===
          true
        }
      />
    );
  }

  const GRID_SIZE = 3;

  return (
    <div>
      {[...Array(GRID_SIZE)].map((_, i) => (
        <div className="board-row" key={i}>
          {[...Array(GRID_SIZE)].map((_, j) => renderSquare(i * GRID_SIZE + j))}
        </div>
      ))}
    </div>
  );
};
