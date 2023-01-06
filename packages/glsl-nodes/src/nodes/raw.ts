import type { DataNode, DataType, StorageType } from "./types"

interface RawSource {
  global?: string
  mainBody?: string
}

export const raw = <TType extends DataType, TStorage extends StorageType>(type: TType, storage: TStorage, expression: string, source: RawSource): DataNode<TType, TStorage> => ({
    type,
    storage,
    dependencies: [],
    expression,
    write: (writer) => {
      if(source.global) {
        writer.addGlobal(source.global)
      }
      if(source.mainBody) {
        writer.addMainBody(source.mainBody)
      }
    }
  })
