export type SquareValue = 'X' | 'O' | null;

type BoardValues = SquareValue[];

export interface Cell {
  col: number;
  row: number;
}

export interface Snapshot {
  squares: BoardValues;
  lastMove: Cell | null;
}

export type History = Snapshot[];

export type HighlightedSquares = [number, number, number] | null;

export enum Order {
  ASC,
  DESC,
}
