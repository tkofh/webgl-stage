import type { OutputType, OutputNode, DataNode, DataType, StorageType } from './types'

interface OutputToAllowedStorage {
  ['gl_Position']: Exclude<StorageType, 'varying'>
  ['gl_FragColor']: Exclude<StorageType, 'attribute'>
}

export const output = <TOutput extends OutputType>(
  target: TOutput,
  value: DataNode<DataType, OutputToAllowedStorage[TOutput]>
): OutputNode<TOutput> => ({
  dependencies: [value],
  target,
  write: ({ addMainBody }) => {
    addMainBody(`${target} = ${value.expression};`)
  },
})
