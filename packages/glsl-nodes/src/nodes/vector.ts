import type { DataNode, NumberVecType, NumberVecToBoolVec, BoolVecType } from './types'

export const lessThan = <
  TValueX extends DataNode<NumberVecType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  NumberVecToBoolVec[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  storage: 'literal',
  type: `b${x.type.replace('i', '')}` as NumberVecToBoolVec[TValueX['type']],
  dependencies: [x, y],
  write: null,
  expression: `lessThan(${x.expression}, ${y.expression})`,
})

export const lessThanEqual = <
  TValueX extends DataNode<NumberVecType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  NumberVecToBoolVec[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  storage: 'literal',
  type: `b${x.type.replace('i', '')}` as NumberVecToBoolVec[TValueX['type']],
  dependencies: [x, y],
  write: null,
  expression: `lessThanEqual(${x.expression}, ${y.expression})`,
})

export const greaterThan = <
  TValueX extends DataNode<NumberVecType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  NumberVecToBoolVec[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  storage: 'literal',
  type: `b${x.type.replace('i', '')}` as NumberVecToBoolVec[TValueX['type']],
  dependencies: [x, y],
  write: null,
  expression: `greaterThan(${x.expression}, ${y.expression})`,
})

export const greaterThanEqual = <
  TValueX extends DataNode<NumberVecType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  NumberVecToBoolVec[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  storage: 'literal',
  type: `b${x.type.replace('i', '')}` as NumberVecToBoolVec[TValueX['type']],
  dependencies: [x, y],
  write: null,
  expression: `greaterThanEqual(${x.expression}, ${y.expression})`,
})

export const equal = <
  TValueX extends DataNode<NumberVecType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  NumberVecToBoolVec[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  storage: 'literal',
  type: `b${x.type.replace('i', '')}` as NumberVecToBoolVec[TValueX['type']],
  dependencies: [x, y],
  write: null,
  expression: `equal(${x.expression}, ${y.expression})`,
})

export const notEqual = <
  TValueX extends DataNode<NumberVecType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  NumberVecToBoolVec[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  storage: 'literal',
  type: `b${x.type.replace('i', '')}` as NumberVecToBoolVec[TValueX['type']],
  dependencies: [x, y],
  write: null,
  expression: `notEqual(${x.expression}, ${y.expression})`,
})

export const any = <TValueX extends DataNode<BoolVecType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x],
  write: null,
  expression: `any(${x.expression})`,
})

export const all = <TValueX extends DataNode<BoolVecType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x],
  write: null,
  expression: `all(${x.expression})`,
})

export const not = <TValueX extends DataNode<BoolVecType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x],
  write: null,
  expression: `not(${x.expression})`,
})
