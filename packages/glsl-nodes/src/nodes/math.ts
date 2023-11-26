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

type MultiplicationResult<
  TLeft extends ArithmeticDataType,
  TRight extends ArithmeticDataType
> = TLeft extends 'mat2'
  ? TRight extends 'vec2'
    ? 'vec2'
    : 'mat2'
  : TLeft extends 'mat3'
  ? TRight extends 'vec3'
    ? 'vec3'
    : 'mat3'
  : TLeft extends 'mat4'
  ? TRight extends 'vec4'
    ? 'vec4'
    : 'mat4'
  : TLeft

export const multiply = <
  TValueX extends DataNode<ArithmeticDataType>,
  TValueY extends DataNode<ArithmeticCompatibleTypes[TValueX['type']]>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  MultiplicationResult<TValueX['type'], TValueY['type']>,
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  storage: 'literal',
  type: (x.type === 'mat2' && y.type === 'vec2'
    ? 'vec2'
    : x.type === 'mat3' && y.type === 'vec3'
    ? 'vec3'
    : x.type === 'mat4' && y.type === 'vec4'
    ? 'vec4'
    : x.type) as MultiplicationResult<TValueX['type'], TValueY['type']>,
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
): DataNode<
  MultiplicationResult<TValueX['type'], TValueY['type']>,
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  storage: 'literal',
  type: (x.type === 'mat2' && y.type === 'vec2'
    ? 'vec2'
    : x.type === 'mat3' && y.type === 'vec3'
    ? 'vec3'
    : x.type === 'mat4' && y.type === 'vec4'
    ? 'vec4'
    : x.type) as MultiplicationResult<TValueX['type'], TValueY['type']>,
  dependencies: [x, y],
  write: null,
  expression: `(${x.expression} / ${y.expression})`,
})
