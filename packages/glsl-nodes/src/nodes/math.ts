import type { DataNode, ArithmeticCompatibleTypes, ArithmeticDataType } from './types'

export const add = <
  TValueX extends DataNode<ArithmeticDataType>,
  TValueY extends DataNode<ArithmeticCompatibleTypes[TValueX['type']]>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `(${x.expression} + ${y.expression})`,
})

export const subtract = <
  TValueX extends DataNode<ArithmeticDataType>,
  TValueY extends DataNode<ArithmeticCompatibleTypes[TValueX['type']]>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `(${x.expression} - ${y.expression})`,
})
export const multiply = <
  TValueX extends DataNode<ArithmeticDataType>,
  TValueY extends DataNode<ArithmeticCompatibleTypes[TValueX['type']]>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `(${x.expression} * ${y.expression})`,
})

export const divide = <
  TValueX extends DataNode<ArithmeticDataType>,
  TValueY extends DataNode<ArithmeticCompatibleTypes[TValueX['type']]>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `(${x.expression} / ${y.expression})`,
})
