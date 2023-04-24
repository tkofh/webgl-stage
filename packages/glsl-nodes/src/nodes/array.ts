import { literal } from './data'
import type { ArrayNode, DataNode, DataType, DataTypeLiteralParams } from './types'

export const attributeArray = <TDataType extends DataType>(
  dataType: TDataType,
  name: string,
  length: number
): ArrayNode<TDataType, 'attribute'> => ({
  storage: 'attribute',
  dataType,
  length,
  expression: name,
  dependencies: [],
  write: ({ addGlobal }) => {
    addGlobal(`attribute ${dataType} ${name}[${length}];`)
  },
})

export const uniformArray = <TDataType extends DataType>(
  dataType: TDataType,
  name: string,
  length: number
): ArrayNode<TDataType, 'uniform'> => ({
  storage: 'uniform',
  dataType,
  length,
  expression: name,
  dependencies: [],
  write: ({ addGlobal }) => {
    addGlobal(`uniform ${dataType} ${name}[${length}];`)
  },
})

export const varyingArray = <TDataType extends DataType>(
  dataType: TDataType,
  name: string,
  length: number
): ArrayNode<TDataType, 'varying'> => ({
  storage: 'varying',
  dataType,
  length,
  expression: name,
  dependencies: [],
  write: ({ addGlobal }) => {
    addGlobal(`varying ${dataType} ${name}[${length}];`)
  },
})

export const variableArray = <TDataType extends DataType, TValue extends ArrayNode<TDataType>>(
  dataType: TDataType,
  name: string,
  value: TValue
): ArrayNode<TDataType, 'local'> => ({
  storage: 'local',
  dataType,
  length: value.length,
  expression: name,
  dependencies: [value],
  write: ({ addMainBody }) => {
    addMainBody(`${dataType} ${name}[${length}] = ${value.expression};`)
  },
})

export const constantArray = <TDataType extends DataType, TValue extends ArrayNode<TDataType>>(
  dataType: TDataType,
  name: string,
  value: TValue
): ArrayNode<TDataType, 'local'> => ({
  storage: 'local',
  dataType,
  length: value.length,
  expression: name,
  dependencies: [value],
  write: ({ addMainBody }) => {
    addMainBody(
      `const ${dataType} ${name}[${length}] = ${dataType}[${length}](${value.expression});`
    )
  },
})

export const literalArray = <
  TDataType extends DataType,
  TValues extends Array<DataTypeLiteralParams[TDataType] | DataNode<TDataType>>
>(
  dataType: TDataType,
  values: TValues
): ArrayNode<
  TDataType,
  | 'literal'
  | (TValues[number] extends DataNode<DataType, infer TDataNodeStorage>
      ? TDataNodeStorage
      : TValues[number] extends Array<unknown>
      ? TValues[number][number] extends DataNode<TDataType, infer TDeepDataNodeStorage>
        ? TDeepDataNodeStorage
        : never
      : never)
> => {
  const dependencies: DataNode<TDataType>[] = []
  const valueExpressions: string[] = []
  for (const value of values) {
    if (Array.isArray(value)) {
      const arrayValue = literal(dataType, value)
      dependencies.push(arrayValue)
      valueExpressions.push(arrayValue.expression)
    } else if (typeof value === 'object') {
      dependencies.push(value)
      valueExpressions.push(value.expression)
    } else {
      valueExpressions.push(value)
    }
  }

  return {
    storage: 'literal',
    dataType,
    length: values.length,
    write: null,
    expression: `${dataType}[${values.length}](${valueExpressions.join(', ')})`,
    dependencies,
  }
}

export const accessArray = <TValue extends ArrayNode<DataType>>(
  value: TValue,
  access: DataNode<'int'>
): DataNode<TValue['dataType'], 'literal' | TValue['storage']> => ({
  type: value.dataType,
  storage: 'literal',
  dependencies: [value, access],
  write: null,
  expression: `${value.expression}[${access.expression}]`,
})
