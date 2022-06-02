import { FC } from 'react';
import { SquareValue } from './types';

interface SquareProps {
  value: SquareValue;
  highlighted: boolean;
  onClick: () => void;
}

export const Square: FC<SquareProps> = props => {
  return (
    <button
      className={`square ${props.highlighted ? 'highlighted' : ''}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};
