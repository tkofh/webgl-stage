import type { DataNode, FloatDataType } from './types'

export const radians = <TDegrees extends DataNode<FloatDataType>>(
  degrees: TDegrees
): DataNode<TDegrees['type'], 'literal' | TDegrees['storage']> => ({
  storage: 'literal',
  type: degrees.type,
  dependencies: [degrees],
  write: null,
  expression: `radians(${degrees.expression})`,
})

export const degrees = <TRadians extends DataNode<FloatDataType>>(
  radians: TRadians
): DataNode<TRadians['type'], 'literal' | TRadians['storage']> => ({
  storage: 'literal',
  type: radians.type,
  dependencies: [radians],
  write: null,
  expression: `degrees(${radians.expression})`,
})

export const sin = <TRadians extends DataNode<FloatDataType>>(
  radians: TRadians
): DataNode<TRadians['type'], 'literal' | TRadians['storage']> => ({
  storage: 'literal',
  type: radians.type,
  dependencies: [radians],
  write: null,
  expression: `sin(${radians.expression})`,
})

export const cos = <TRadians extends DataNode<FloatDataType>>(
  radians: TRadians
): DataNode<TRadians['type'], 'literal' | TRadians['storage']> => ({
  storage: 'literal',
  type: radians.type,
  dependencies: [radians],
  write: null,
  expression: `cos(${radians.expression})`,
})

export const tan = <TRadians extends DataNode<FloatDataType>>(
  radians: TRadians
): DataNode<TRadians['type'], 'literal' | TRadians['storage']> => ({
  storage: 'literal',
  type: radians.type,
  dependencies: [radians],
  write: null,
  expression: `tan(${radians.expression})`,
})

export const asin = <TRadians extends DataNode<FloatDataType>>(
  radians: TRadians
): DataNode<TRadians['type'], 'literal' | TRadians['storage']> => ({
  storage: 'literal',
  type: radians.type,
  dependencies: [radians],
  write: null,
  expression: `asin(${radians.expression})`,
})

export const acos = <TRadians extends DataNode<FloatDataType>>(
  radians: TRadians
): DataNode<TRadians['type'], 'literal' | TRadians['storage']> => ({
  storage: 'literal',
  type: radians.type,
  dependencies: [radians],
  write: null,
  expression: `acos(${radians.expression})`,
})

export const atan = <TRadians extends DataNode<FloatDataType>>(
  radians: TRadians
): DataNode<TRadians['type'], 'literal' | TRadians['storage']> => ({
  storage: 'literal',
  type: radians.type,
  dependencies: [radians],
  write: null,
  expression: `atan(${radians.expression})`,
})
