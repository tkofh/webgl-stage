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

export type FloatDataType = 'float' | 'vec2' | 'vec3' | 'vec4'
export type MatrixDataType = 'mat2' | 'mat3' | 'mat4'
export type NumberVecType = 'vec2' | 'ivec2' | 'vec3' | 'ivec3' | 'vec4' | 'ivec4'
export type BoolVecType = 'bvec2' | 'bvec3' | 'bvec4'
export type SwizzleableDataType = 'vec2' | 'ivec2' | 'vec3' | 'ivec3' | 'vec4' | 'ivec4'
export type AccessableDataType =
  | 'vec2'
  | 'ivec2'
  | 'vec3'
  | 'ivec3'
  | 'vec4'
  | 'ivec4'
  | 'mat2'
  | 'mat3'
  | 'mat4'

export type StorageType = 'attribute' | 'varying' | 'uniform' | 'local' | 'literal'

export type WritableStorageType = 'varying' | 'local'

export interface DataNode<TType extends DataType, TStorage extends StorageType = StorageType>
  extends Node {
  storage: TStorage
  type: TType
  expression: string
}

export interface DataTypeLiteralParams {
  float: [string]
  int: [string]
  bool: [string]
  vec2: [DataNode<'float'> | string, (DataNode<'float'> | string)?] | [DataNode<'vec2'>]
  vec3:
    | [DataNode<'float'> | string, (DataNode<'float'> | string)?, (DataNode<'float'> | string)?]
    | [DataNode<'float'> | string, DataNode<'vec2'>]
    | [DataNode<'vec2'>, (DataNode<'float'> | string)?]
  vec4:
    | [
        DataNode<'float'> | string,
        (DataNode<'float'> | string)?,
        (DataNode<'float'> | string)?,
        (DataNode<'float'> | string)?
      ]
    | [DataNode<'float'> | string, (DataNode<'float'> | string)?, DataNode<'vec2'>?]
    | [DataNode<'float'> | string, DataNode<'vec2'>?, (DataNode<'float'> | string)?]
    | [DataNode<'vec2'>, (DataNode<'float'> | string)?, (DataNode<'float'> | string)?]
    | [DataNode<'vec2'>, DataNode<'vec2'>?]
    | [DataNode<'vec3'>, (DataNode<'float'> | string)?]
    | [DataNode<'float'> | string, DataNode<'vec3'>?]
  ivec2: [DataNode<'float'> | string, (DataNode<'float'> | string)?] | [DataNode<'ivec2'>]
  ivec3:
    | [DataNode<'float'> | string, (DataNode<'float'> | string)?, (DataNode<'float'> | string)?]
    | [DataNode<'float'> | string, DataNode<'ivec2'>?]
    | [DataNode<'ivec2'>, (DataNode<'float'> | string)?]
  ivec4:
    | [
        DataNode<'float'> | string,
        (DataNode<'float'> | string)?,
        (DataNode<'float'> | string)?,
        (DataNode<'float'> | string)?
      ]
    | [DataNode<'float'> | string, (DataNode<'float'> | string)?, DataNode<'ivec2'>?]
    | [DataNode<'float'> | string, DataNode<'ivec2'>?, (DataNode<'float'> | string)?]
    | [DataNode<'ivec2'>, (DataNode<'float'> | string)?, (DataNode<'float'> | string)?]
    | [DataNode<'ivec2'>, DataNode<'ivec2'>?]
    | [DataNode<'ivec3'>, (DataNode<'float'> | string)?]
    | [DataNode<'float'> | string, DataNode<'ivec3'>?]
  bvec2: [DataNode<'float'> | string, (DataNode<'float'> | string)?] | [DataNode<'bvec2'>]
  bvec3:
    | [DataNode<'float'> | string, (DataNode<'float'> | string)?, (DataNode<'float'> | string)?]
    | [DataNode<'float'> | string, DataNode<'bvec2'>?]
    | [DataNode<'bvec2'>, (DataNode<'float'> | string)?]
  bvec4:
    | [
        DataNode<'float'> | string,
        (DataNode<'float'> | string)?,
        (DataNode<'float'> | string)?,
        (DataNode<'float'> | string)?
      ]
    | [DataNode<'float'> | string, (DataNode<'float'> | string)?, DataNode<'bvec2'>?]
    | [DataNode<'float'> | string, DataNode<'bvec2'>?, (DataNode<'float'> | string)?]
    | [DataNode<'bvec2'>, (DataNode<'float'> | string)?, (DataNode<'float'> | string)?]
    | [DataNode<'bvec2'>, DataNode<'bvec2'>?]
    | [DataNode<'bvec3'>, (DataNode<'float'> | string)?]
    | [DataNode<'float'> | string, DataNode<'bvec3'>?]
  mat2:
    | [
        DataNode<'float'> | string,
        (DataNode<'float'> | string)?,
        (DataNode<'float'> | string)?,
        (DataNode<'float'> | string)?
      ]
    | [DataNode<'float'> | string, (DataNode<'float'> | string)?, DataNode<'vec2'>?]
    | [DataNode<'float'> | string, DataNode<'vec2'>?, (DataNode<'float'> | string)?]
    | [DataNode<'vec2'>, (DataNode<'float'> | string)?, (DataNode<'float'> | string)?]
    | [DataNode<'vec3'>, (DataNode<'float'> | string)?]
    | [DataNode<'float'> | string, DataNode<'vec3'>?]

  // if someone feels like typing all this out be my guest lol
  mat3: [
    DataNode<'float'> | DataNode<'vec2'> | DataNode<'vec3'> | DataNode<'vec4'> | string,
    ...(DataNode<'float'> | DataNode<'vec2'> | DataNode<'vec3'> | DataNode<'vec4'> | string)[]
  ]
  mat4: [
    DataNode<'float'> | DataNode<'vec2'> | DataNode<'vec3'> | DataNode<'vec4'> | string,
    ...(DataNode<'float'> | DataNode<'vec2'> | DataNode<'vec3'> | DataNode<'vec4'> | string)[]
  ]
  sampler2d: []
  samplerCube: []
}

export interface ArrayNode<TDataType extends DataType, TStorage extends StorageType = StorageType>
  extends Node {
  storage: TStorage
  dataType: TDataType
  length: number
  expression: string
}

export interface NumberVecToBoolVec {
  vec2: 'bvec2'
  vec3: 'bvec3'
  vec4: 'bvec4'
  ivec2: 'bvec2'
  ivec3: 'bvec3'
  ivec4: 'bvec4'
}

export type OutputType = 'gl_Position' | 'gl_FragColor' // 'gl_PointSize' | 'gl_PointCoord' | 'gl_FrontFacing' |  'gl_FragCoord'

export interface OutputNode<TOutput extends OutputType> extends Node {
  target: TOutput
}
