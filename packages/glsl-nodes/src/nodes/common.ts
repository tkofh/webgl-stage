import type { DataNode, FloatDataType } from './types'

export const abs = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `abs(${x.expression})`,
})

export const sign = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `sign(${x.expression})`,
})

export const floor = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `floor(${x.expression})`,
})

export const ceil = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `ceil(${x.expression})`,
})

export const fract = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `fract(${x.expression})`,
})

export const mod = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `mod(${x.expression})`,
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
  dependencies: new Set([x, ...x.dependencies, y, ...y.dependencies]),
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
  dependencies: new Set([x, ...x.dependencies, y, ...y.dependencies]),
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
  dependencies: new Set([x, ...x.dependencies, min, ...min.dependencies, max, ...max.dependencies]),
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
  dependencies: new Set([x, ...x.dependencies, y, ...y.dependencies, a, ...a.dependencies]),
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
  dependencies: new Set([edge, ...edge.dependencies, value, ...value.dependencies]),
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
  dependencies: new Set([
    edge0,
    ...edge0.dependencies,
    edge1,
    ...edge1.dependencies,
    value,
    ...value.dependencies,
  ]),
  write: null,
  expression: `smoothstep(${edge0.expression}, ${edge1.expression}, ${value.expression})`,
})
