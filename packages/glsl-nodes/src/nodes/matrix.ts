import type { DataNode, MatrixDataType } from './types'

export const matrixCompMult = <
  TValueX extends DataNode<MatrixDataType>,
  TValueY extends DataNode<TValueX['type']>
>(
  x: TValueX,
  y: TValueY
): DataNode<TValueX['type'], 'literal' | TValueX['storage'] | TValueY['storage']> => ({
  storage: 'literal',
  type: x.type,
  dependencies: new Set([x, ...x.dependencies, y, ...y.dependencies]),
  write: null,
  expression: `matrixCompMult(${x.expression}, ${y.expression})`,
})
