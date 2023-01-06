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
  dependencies: [x, y],
  write: null,
  expression: `matrixCompMult(${x.expression}, ${y.expression})`,
})
