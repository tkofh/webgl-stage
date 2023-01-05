import type { Writer } from '../writer'

export interface Node {
  dependencies: Node[]
  write: null | ((writer: Writer) => void)
}

export type DataType =
  | 'float'
  | 'int'
  | 'bool'
  | 'vec2'
  | 'ivec2'
  | 'bvec2'
  | 'vec3'
  | 'ivec3'
  | 'bvec3'
  | 'vec4'
  | 'ivec4'
  | 'bvec4'
  | 'mat2'
  | 'mat3'
  | 'mat4'
  | 'sampler2d'
  | 'samplerCube'

export type StorageType = 'attribute' | 'varying' | 'uniform' | 'local' | 'literal'

export interface DataNode<TType extends DataType, TStorage extends StorageType = StorageType>
  extends Node {
  storage: TStorage
  type: TType
  expression: string
}

export type OutputType = 'gl_Position' | 'gl_FragColor'

export interface OutputNode<TOutput extends OutputType> extends Node {
  target: TOutput
}
