import type {
  AccessableDataType,
  DataNode,
  DataType,
  DataTypeLiteralParams,
  SwizzleableDataType,
} from './types'

export const attribute = <TType extends DataType>(
  type: TType,
  name: string
): DataNode<TType, 'attribute'> => ({
  storage: 'attribute',
  type,
  expression: name,
  dependencies: [],
  write: ({ addGlobal, mode }) => {
    if (mode === 'vertex') {
      addGlobal(`attribute ${type} ${name};`)
    }
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
  name: string,
  value: DataNode<TType>
): DataNode<TType, 'varying'> => ({
  storage: 'varying',
  type,
  expression: name,
  dependencies: [value],
  write: ({ addGlobal, addMainBody, mode }) => {
    addGlobal(`varying ${type} ${name};`)

    if (mode === 'vertex') {
      addMainBody(`${name} = ${value.expression};`)
    }
  },
})

export const variable = <
  TType extends DataType,
  TValue extends DataNode<TType> | DataTypeLiteralParams[TType]
>(
  type: TType,
  name: string,
  value: TValue
): DataNode<
  TType,
  'local' | (TValue extends DataNode<TType, infer TStorage> ? TStorage : 'literal')
> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const valueNode = (Array.isArray(value) ? literal<TType, any>(type, value) : value) as DataNode<
    TType,
    'literal'
  >
  return {
    type,
    storage: 'local',
    expression: name,
    dependencies: [valueNode],
    write: ({ addMainBody }) => {
      addMainBody(`${type} ${name} = ${valueNode.expression};`)
    },
  }
}

export const constant = <
  TType extends DataType,
  TValue extends DataNode<TType> | DataTypeLiteralParams[TType]
>(
  type: TType,
  name: string,
  value: TValue
): DataNode<
  TType,
  'local' | (TValue extends DataNode<TType, infer TStorage> ? TStorage : 'literal')
> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const valueNode = (Array.isArray(value) ? literal<TType, any>(type, value) : value) as DataNode<
    TType,
    'literal'
  >
  return {
    type,
    storage: 'local',
    expression: name,
    dependencies: [valueNode],
    write: ({ addGlobal }) => {
      addGlobal(`const ${type} ${name} = ${valueNode.expression};`)
    },
  }
}

export const literal = <TType extends DataType, TValues extends DataTypeLiteralParams[TType]>(
  type: TType,
  values: TValues
): DataNode<
  TType,
  'literal' | (TValues[number] extends DataNode<DataType, infer TStorage> ? TStorage : never)
> => {
  const dependencies: DataNode<DataType>[] = []
  const valueExpressions: string[] = []
  for (const value of values) {
    if (typeof value === 'object') {
      dependencies.push(value)
      valueExpressions.push(value.expression)
    } else if (value != null) {
      valueExpressions.push(value)
    }
  }

  return {
    type,
    dependencies,
    write: null,
    storage: 'literal',
    expression:
      type === 'bool' || type === 'int' || type === 'float'
        ? valueExpressions[0]
        : `${type}(${valueExpressions.join(', ')})`,
  }
}

export const cast = <
  TCast extends 'bool' | 'float' | 'int',
  TValue extends DataNode<Exclude<'bool' | 'float' | 'int', TCast>>
>(
  value: TValue,
  cast: TCast
): DataNode<TCast, 'literal' | TValue['storage']> => ({
  type: cast,
  dependencies: [value],
  write: null,
  expression: `${cast}(${value.expression})`,
  storage: 'literal',
})

interface SwizzleOutputMap {
  vec2: ['float', 'vec2', 'vec3', 'vec4']
  ivec2: ['int', 'ivec2', 'ivec3', 'ivec4']
  uvec2: ['bool', 'uvec2', 'uvec3', 'uvec4']
  vec3: ['float', 'vec2', 'vec3', 'vec4']
  ivec3: ['int', 'ivec2', 'ivec3', 'ivec4']
  uvec3: ['bool', 'uvec2', 'uvec3', 'uvec4']
  vec4: ['float', 'vec2', 'vec3', 'vec4']
  ivec4: ['int', 'ivec2', 'ivec3', 'ivec4']
  uvec4: ['bool', 'uvec2', 'uvec3', 'uvec4']
}
interface SwizzleComponentMap {
  vec2: 'x' | 'y'
  ivec2: 'x' | 'y'
  uvec2: 'x' | 'y'
  vec3: 'x' | 'y' | 'z'
  ivec3: 'x' | 'y' | 'z'
  uvec3: 'x' | 'y' | 'z'
  vec4: 'x' | 'y' | 'z' | 'w'
  ivec4: 'x' | 'y' | 'z' | 'w'
  uvec4: 'x' | 'y' | 'z' | 'w'
}
type SwizzleCombinations<TType extends SwizzleableDataType> =
  | SwizzleComponentMap[TType]
  | `${SwizzleComponentMap[TType]}${SwizzleComponentMap[TType]}`
  | `${SwizzleComponentMap[TType]}${SwizzleComponentMap[TType]}${SwizzleComponentMap[TType]}`
  | `${SwizzleComponentMap[TType]}${SwizzleComponentMap[TType]}${SwizzleComponentMap[TType]}${SwizzleComponentMap[TType]}`

export const swizzle = <
  TValue extends DataNode<SwizzleableDataType>,
  TSwizzle extends SwizzleCombinations<TValue['type']>,
  TOutputLength extends
    | 0
    | 1
    | 2
    | 3 = TSwizzle extends `${SwizzleComponentMap[TValue['type']]}${SwizzleComponentMap[TValue['type']]}${SwizzleComponentMap[TValue['type']]}${SwizzleComponentMap[TValue['type']]}`
    ? 3
    : TSwizzle extends `${SwizzleComponentMap[TValue['type']]}${SwizzleComponentMap[TValue['type']]}${SwizzleComponentMap[TValue['type']]}`
    ? 2
    : TSwizzle extends `${SwizzleComponentMap[TValue['type']]}${SwizzleComponentMap[TValue['type']]}`
    ? 1
    : 0
>(
  value: TValue,
  swizzle: TSwizzle
): DataNode<SwizzleOutputMap[TValue['type']][TOutputLength], 'literal' | TValue['storage']> => ({
  type: `${value.type.replace(/[234]/, '')}${
    swizzle.length
  }` as SwizzleOutputMap[TValue['type']][TOutputLength],
  dependencies: [value],
  write: null,
  expression: `${value.expression}.${swizzle}`,
  storage: 'literal',
})

type DimensionCount<TType extends AccessableDataType> = TType extends `${'u' | 'i' | ''}${
  | 'mat'
  | 'vec'}2`
  ? '2'
  : TType extends `${'u' | 'i' | ''}${'mat' | 'vec'}3`
  ? '3'
  : '4'
interface DimensionCountIndices {
  '2': '0' | '1'
  '3': '0' | '1' | '2'
  '4': '0' | '1' | '2' | '3'
}
type AccessDepth<TType extends AccessableDataType> = TType extends `mat${'2' | '3' | '4'}` ? 2 : 1
interface AccessScalarMap {
  vec2: 'float'
  ivec2: 'int'
  bvec2: 'bool'
  vec3: 'float'
  ivec3: 'int'
  bvec3: 'bool'
  vec4: 'float'
  ivec4: 'int'
  bvec4: 'bool'
  mat2: 'float'
  mat3: 'float'
  mat4: 'float'
}
interface AccessVectorMap {
  mat2: 'vec2'
  mat3: 'vec3'
  mat4: 'vec4'
}
export const access = <
  TValue extends DataNode<AccessableDataType>,
  TAccess extends
    | `[${DimensionCountIndices[DimensionCount<TValue['type']>]}]`
    | (AccessDepth<TValue['type']> extends 2
        ? `[${DimensionCountIndices[DimensionCount<
            TValue['type']
          >]}][${DimensionCountIndices[DimensionCount<TValue['type']>]}]`
        : never)
>(
  value: TValue,
  access: TAccess
): DataNode<
  TValue['type'] extends `mat${'2' | '3' | '4'}`
    ? TAccess extends `[${DimensionCountIndices[DimensionCount<TValue['type']>]}]`
      ? AccessVectorMap[TValue['type']]
      : AccessScalarMap[TValue['type']]
    : AccessScalarMap[TValue['type']],
  'literal' | TValue['storage']
> => ({
  type: (value.type.startsWith('mat') && access.length === 3
    ? `vec${value.type.replace('mat', '')}`
    : value.type.startsWith('i')
    ? 'int'
    : value.type.startsWith('b')
    ? 'bool'
    : 'float') as TValue['type'] extends `mat${'2' | '3' | '4'}`
    ? TAccess extends `[${DimensionCountIndices[DimensionCount<TValue['type']>]}]`
      ? AccessVectorMap[TValue['type']]
      : AccessScalarMap[TValue['type']]
    : AccessScalarMap[TValue['type']],
  storage: 'literal',
  dependencies: [value],
  write: null,
  expression: `${value.expression}${access}`,
})
