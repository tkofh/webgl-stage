import type { DataNode, DataType, ComparableTypes, ComparisonResult } from './types'

export const equal = <
  TValueX extends DataNode<ComparableTypes>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  ComparisonResult[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  dependencies: [x, y],
  expression: ['bool', 'float', 'int'].includes(x.type)
    ? `${x.expression} == ${y.expression}`
    : `equal(${x.expression}, ${y.expression})`,
  storage: 'literal',
  type: (['bool', 'float', 'int'].includes(x.type)
    ? 'bool'
    : x.type.replace(/i?vec/, 'bvec')) as ComparisonResult[TValueX['type']],
  write: null,
})

export const lessThan = <
  TValueX extends DataNode<ComparableTypes>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  ComparisonResult[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  dependencies: [x, y],
  expression: ['bool', 'float', 'int'].includes(x.type)
    ? `${x.expression} < ${y.expression}`
    : `lessThan(${x.expression}, ${y.expression})`,
  storage: 'literal',
  type: (['bool', 'float', 'int'].includes(x.type)
    ? 'bool'
    : x.type.replace(/i?vec/, 'bvec')) as ComparisonResult[TValueX['type']],
  write: null,
})

export const lessThanEqual = <
  TValueX extends DataNode<ComparableTypes>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  ComparisonResult[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  dependencies: [x, y],
  expression: ['bool', 'float', 'int'].includes(x.type)
    ? `${x.expression} <= ${y.expression}`
    : `lessThanEqual(${x.expression}, ${y.expression})`,
  storage: 'literal',
  type: (['bool', 'float', 'int'].includes(x.type)
    ? 'bool'
    : x.type.replace(/i?vec/, 'bvec')) as ComparisonResult[TValueX['type']],
  write: null,
})

export const greaterThan = <
  TValueX extends DataNode<ComparableTypes>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  ComparisonResult[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  dependencies: [x, y],
  expression: ['bool', 'float', 'int'].includes(x.type)
    ? `${x.expression} > ${y.expression}`
    : `greaterThan(${x.expression}, ${y.expression})`,
  storage: 'literal',
  type: (['bool', 'float', 'int'].includes(x.type)
    ? 'bool'
    : x.type.replace(/i?vec/, 'bvec')) as ComparisonResult[TValueX['type']],
  write: null,
})

export const greaterThanEqual = <
  TValueX extends DataNode<ComparableTypes>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  ComparisonResult[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  dependencies: [x, y],
  expression: ['bool', 'float', 'int'].includes(x.type)
    ? `${x.expression} >= ${y.expression}`
    : `greaterThanEqual(${x.expression}, ${y.expression})`,
  storage: 'literal',
  type: (['bool', 'float', 'int'].includes(x.type)
    ? 'bool'
    : x.type.replace(/i?vec/, 'bvec')) as ComparisonResult[TValueX['type']],
  write: null,
})

export const notEqual = <
  TValueX extends DataNode<ComparableTypes>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<
  ComparisonResult[TValueX['type']],
  'literal' | TValueX['storage'] | TValueY['storage']
> => ({
  dependencies: [x, y],
  expression: ['bool', 'float', 'int'].includes(x.type)
    ? `${x.expression} != ${y.expression}`
    : `notEqual(${x.expression}, ${y.expression})`,
  storage: 'literal',
  type: (['bool', 'float', 'int'].includes(x.type)
    ? 'bool'
    : x.type.replace(/i?vec/, 'bvec')) as ComparisonResult[TValueX['type']],
  write: null,
})

export const any = <TValue extends DataNode<'bvec2' | 'bvec3' | 'bvec4'>>(
  x: TValue
): DataNode<'bool', 'literal' | TValue['storage']> => ({
  dependencies: [x],
  expression: `any(${x.expression})`,
  storage: 'literal',
  type: 'bool',
  write: null,
})

export const all = <TValue extends DataNode<'bvec2' | 'bvec3' | 'bvec4'>>(
  x: TValue
): DataNode<'bool', 'literal' | TValue['storage']> => ({
  dependencies: [x],
  expression: `all(${x.expression})`,
  storage: 'literal',
  type: 'bool',
  write: null,
})

export const not = <TValue extends DataNode<'bvec2' | 'bvec3' | 'bvec4'>>(
  x: TValue
): DataNode<'bool', 'literal' | TValue['storage']> => ({
  dependencies: [x],
  expression: `not(${x.expression})`,
  storage: 'literal',
  type: 'bool',
  write: null,
})

export const ternary = <
  TCondition extends DataNode<'bool'>,
  TTrue extends DataNode<DataType>,
  TFalse extends DataNode<TTrue['type']>
>(
  condition: TCondition,
  trueBranch: TTrue,
  falseBranch: TFalse
): DataNode<
  TTrue['type'],
  'literal' | TCondition['storage'] | TTrue['storage'] | TFalse['storage']
> => ({
  dependencies: [condition, trueBranch, falseBranch],
  expression: `(${condition.expression} ? ${trueBranch.expression} : ${falseBranch.expression})`,
  storage: 'literal',
  type: trueBranch.type,
  write: null,
})
