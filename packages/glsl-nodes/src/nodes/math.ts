import type { DataType, DataNode } from './types'

export const add = <TValueX extends DataNode<DataType>, TValueY extends DataNode<TValueX['type']>>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `${x.expression} + ${y.expression}`,
})

export const subtract = <
  TValueX extends DataNode<DataType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `${x.expression} - ${y.expression}`,
})
export const multiply = <
  TValueX extends DataNode<DataType>,
  TValueY extends DataNode<
    | TValueX['type']
    | (TValueX['type'] extends 'vec2'
        ? 'mat2' | 'float'
        : TValueX['type'] extends 'vec3'
        ? 'mat3' | 'float'
        : TValueX['type'] extends 'vec4'
        ? 'mat4' | 'float'
        : never)
  >
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `${x.expression} * ${y.expression}`,
})

export const divide = <
  TValueX extends DataNode<DataType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `${x.expression} / ${y.expression}`,
})
