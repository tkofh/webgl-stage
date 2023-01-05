import type { DataType, DataNode } from './types'

/* need to store all the storage types of the terms so that we can tell if an attribute exists in the dependencies for a fragment shader */

export const add = <TFirst extends DataNode<DataType>, TTerms extends DataNode<TFirst['type']>[]>(
  first: TFirst,
  ...terms: TTerms
): DataNode<TFirst['type'], 'literal' | TFirst['storage'] | TTerms[number]['storage']> => {
  if (terms.length === 0) {
    return first
  }
  return {
    storage: 'literal',
    type: first.type,
    dependencies: [first, ...terms],
    write: null,
    expression: `${first.expression} + ${terms.map((term) => term.expression).join(' + ')}`,
  }
}
