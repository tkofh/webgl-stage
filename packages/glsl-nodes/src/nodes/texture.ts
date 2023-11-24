import type { DataNode } from './types'

export const texture2D = <
  TSampler extends DataNode<'sampler2d'>,
  TCoord extends DataNode<'vec2'>,
  TBias extends DataNode<'float'> | undefined
>(
  sampler: TSampler,
  coord: TCoord,
  bias?: TBias
): DataNode<
  'vec4',
  | 'literal'
  | TSampler['storage']
  | TCoord['storage']
  | (TBias extends DataNode<'float', infer TStorage> ? TStorage : never)
> => ({
  storage: 'literal',
  type: 'vec4',
  dependencies: [sampler, coord, ...(bias ? [bias] : [])],
  write: null,
  expression: `texture2D(${sampler.expression}, ${coord.expression}${
    bias ? `, ${bias.expression}` : ''
  })`,
})

export const textureCube = <
  TSampler extends DataNode<'samplerCube'>,
  TCoord extends DataNode<'vec3'>,
  TBias extends DataNode<'float'> | undefined
>(
  sampler: TSampler,
  coord: TCoord,
  bias?: TBias
): DataNode<
  'vec4',
  | 'literal'
  | TSampler['storage']
  | TCoord['storage']
  | (TBias extends DataNode<'float', infer TStorage> ? TStorage : never)
> => ({
  storage: 'literal',
  type: 'vec4',
  dependencies: [sampler, coord, ...(bias ? [bias] : [])],
  write: null,
  expression: `textureCube(${sampler.expression}, ${coord.expression}${
    bias ? `, ${bias.expression}` : ''
  })`,
})
