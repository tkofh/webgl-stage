import type { DataNode, FloatDataType } from './types'

export const abs = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x],
  write: null,
  expression: `abs(${x.expression})`,
})

export const sign = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x],
  write: null,
  expression: `sign(${x.expression})`,
})

export const floor = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x],
  write: null,
  expression: `floor(${x.expression})`,
})

export const ceil = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x],
  write: null,
  expression: `ceil(${x.expression})`,
})

export const fract = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x],
  write: null,
  expression: `fract(${x.expression})`,
})

export const mod = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX,
  y: DataNode<TValueX['type'] | 'float'>
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `mod(${x.expression}, ${y.expression})`,
})

export const min = <
  TValueX extends DataNode<FloatDataType>,
  TValueY extends DataNode<TValueX['type'] | 'float'>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `min(${x.expression}, ${y.expression})`,
})

export const max = <
  TValueX extends DataNode<FloatDataType>,
  TValueY extends DataNode<TValueX['type'] | 'float'>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y],
  write: null,
  expression: `max(${x.expression}, ${y.expression})`,
})

export const clamp = <
  TValueX extends DataNode<FloatDataType>,
  TValueEdge extends DataNode<TValueX['type'] | 'float'>
>(
  x: TValueX,
  min: TValueEdge,
  max: TValueEdge
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueEdge['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, min, max],
  write: null,
  expression: `clamp(${x.expression}, ${min.expression}, ${max.expression})`,
})

export const mix = <
  TValueX extends DataNode<FloatDataType>,
  TValueY extends DataNode<TValueX['type']>,
  TInterpolation extends DataNode<TValueX['type'] | 'float'>
>(
  x: TValueX,
  y: TValueY,
  a: TInterpolation
): DataNode<
  TValueX['type'],
  'literal' | TValueX['storage'] | TValueY['storage'] | TInterpolation['storage']
> => ({
  storage: 'literal',
  type: x.type,
  dependencies: [x, y, a],
  write: null,
  expression: `mix(${x.expression}, ${y.expression}, ${a.expression})`,
})

export const step = <
  TValue extends DataNode<FloatDataType>,
  TEdge extends DataNode<TValue['type'] | 'float'>
>(
  edge: TEdge,
  value: TValue
): DataNode<TValue['type'], 'literal' | TValue['storage'] | TEdge['storage']> => ({
  storage: 'literal',
  type: value.type,
  dependencies: [edge, value],
  write: null,
  expression: `step(${edge.expression}, ${value.expression})`,
})

export const smoothstep = <
  TValue extends DataNode<FloatDataType>,
  TEdge0 extends DataNode<TValue['type'] | 'float'>,
  TEdge1 extends DataNode<TEdge0['type']>
>(
  edge0: TEdge0,
  edge1: TEdge1,
  value: TValue
): DataNode<
  TValue['type'],
  'literal' | TValue['storage'] | TEdge0['storage'] | TEdge1['storage']
> => ({
  storage: 'literal',
  type: value.type,
  dependencies: [edge0, edge1, value],
  write: null,
  expression: `smoothstep(${edge0.expression}, ${edge1.expression}, ${value.expression})`,
})
