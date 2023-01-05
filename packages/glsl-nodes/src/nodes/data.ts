import type { DataNode, DataType } from './types'

export const attribute = <TType extends DataType>(
  type: TType,
  name: string
): DataNode<TType, 'attribute'> => ({
  storage: 'attribute',
  type,
  expression: name,
  dependencies: [],
  write: ({ addGlobal }) => {
    addGlobal(`attribute ${type} ${name};`)
  },
})

export const uniform = <TType extends DataType>(
  type: TType,
  name: string
): DataNode<TType, 'uniform'> => ({
  storage: 'uniform',
  type,
  expression: name,
  dependencies: [],
  write: ({ addGlobal }) => {
    addGlobal(`uniform ${type} ${name};`)
  },
})

export const varying = <TType extends DataType>(
  type: TType,
  name: string
): DataNode<TType, 'varying'> => ({
  storage: 'varying',
  type,
  expression: name,
  dependencies: [],
  write: ({ addGlobal }) => {
    addGlobal(`varying ${type} ${name};`)
  },
})

export const variable = <TType extends DataType, TValue extends DataNode<TType>>(
  type: TType,
  name: string,
  value: DataNode<TType, 'literal'>
): DataNode<
  TType,
  'local' | (TValue extends DataNode<TType, infer TStorage> ? TStorage : never)
> => ({
  type,
  storage: 'local',
  expression: name,
  dependencies: [value],
  write: ({ addMainBody }) => {
    addMainBody(`${type} ${name} = ${value.expression};`)
  },
})

export const constant = <TType extends DataType, TValue extends DataNode<TType>>(
  type: TType,
  name: string,
  value: DataNode<TType, 'literal'>
): DataNode<
  TType,
  'local' | (TValue extends DataNode<TType, infer TStorage> ? TStorage : never)
> => ({
  type,
  storage: 'local',
  expression: name,
  dependencies: [value],
  write: ({ addGlobal }) => {
    addGlobal(`const ${type} ${name} = ${value.expression};`)
  },
})



// export const literal = <TType extends DataType>(type: TType, ) => {}
