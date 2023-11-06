import type { DataNode, FloatDataType } from './types'

export const pow = <
  TValueX extends DataNode<FloatDataType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies, y, ...y.dependencies]),
  write: null,
  expression: `pow(${x.expression}, ${y.expression})`,
})

export const exp = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `exp(${x.expression})`,
})

export const log = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `log(${x.expression})`,
})

export const exp2 = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `exp2(${x.expression})`,
})

export const log2 = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `log2(${x.expression})`,
})

export const sqrt = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `sqrt(${x.expression})`,
})

export const inversesqrt = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `inversesqrt(${x.expression})`,
})
