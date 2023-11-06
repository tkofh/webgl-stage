import type { DataNode, FloatDataType } from './types'

export const length = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `length(${x.expression})`,
})

export const distance = <
  TPoint0 extends DataNode<FloatDataType>,
  TPoint1 extends DataNode<TPoint0['type']>
>(
  p0: TPoint0,
  p1: TPoint1
): DataNode<TPoint0['type'], 'literal' | TPoint0['storage'] | TPoint1['storage']> => ({
  storage: 'literal',
  type: p0.type,
  dependencies: new Set([p0, ...p0.dependencies, p1, ...p1.dependencies]),
  write: null,
  expression: `distance(${p0.expression}, ${p1.expression})`,
})

export const dot = <
  TPoint0 extends DataNode<FloatDataType>,
  TPoint1 extends DataNode<TPoint0['type']>
>(
  p0: TPoint0,
  p1: TPoint1
): DataNode<'float', 'literal' | TPoint0['storage'] | TPoint1['storage']> => ({
  storage: 'literal',
  type: 'float',
  dependencies: new Set([p0, ...p0.dependencies, p1, ...p1.dependencies]),
  write: null,
  expression: `dot(${p0.expression}, ${p1.expression})`,
})

export const cross = <TPoint extends DataNode<'vec3'>>(
  p0: TPoint,
  p1: TPoint
): DataNode<'vec3', 'literal' | TPoint['storage']> => ({
  storage: 'literal',
  type: p0.type,
  dependencies: new Set([p0, ...p0.dependencies, p1, ...p1.dependencies]),
  write: null,
  expression: `cross(${p0.expression}, ${p1.expression})`,
})

export const normalize = <TValueX extends DataNode<FloatDataType>>(
  x: TValueX
): DataNode<TValueX['type'], 'literal' | TValueX['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies]),
  write: null,
  expression: `normalize(${x.expression})`,
})

export const reflect = <
  TIncident extends DataNode<FloatDataType>,
  TNormal extends DataNode<TIncident['type']>
>(
  incident: TIncident,
  normal: TNormal
): DataNode<TIncident['type'], 'literal' | TIncident['storage'] | TNormal['storage']> => ({
  storage: 'literal',
  type: incident.type,
  dependencies: new Set([incident, ...incident.dependencies, normal, ...normal.dependencies]),
  write: null,
  expression: `reflect(${incident.expression}, ${normal.expression})`,
})

export const refract = <
  TIncident extends DataNode<FloatDataType>,
  TNormal extends DataNode<TIncident['type']>,
  TEta extends DataNode<'float'>
>(
  incident: TIncident,
  normal: TNormal,
  eta: TEta
): DataNode<
  TIncident['type'],
  'literal' | TIncident['storage'] | TNormal['storage'] | TEta['storage']
> => ({
  storage: 'literal',
  type: incident.type,
  dependencies: new Set([
    incident,
    ...incident.dependencies,
    normal,
    ...normal.dependencies,
    eta,
    ...eta.dependencies,
  ]),
  write: null,
  expression: `refract(${incident.expression}, ${normal.expression}, ${eta.expression})`,
})
