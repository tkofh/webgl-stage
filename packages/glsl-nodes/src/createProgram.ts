import type { Namer } from './namer'
import { createNamer } from './namer'
import type { DataNode, DataType, Node, OutputNode, OutputType } from './nodes/types'
import { createWriter } from './writer'

type ProgramSetupResult = {
  [TOutput in OutputType]: OutputNode<TOutput>
}

type ProgramSetup = (namer: Namer) => ProgramSetupResult

export interface ProgramOptions {
  precision?: 'lowp' | 'mediump' | 'highp'
}

const isDataNode = (node: Node): node is DataNode<DataType> => 'storage' in node

export const createProgram = (
  setup: ProgramSetup | ProgramSetupResult,
  options?: ProgramOptions
) => {
  const fragment = createWriter('fragment')
  const vertex = createWriter('vertex')

  const namer = createNamer()

  const result = typeof setup === 'function' ? setup(namer) : setup

  const fragmentWritten = new Set<Node>()
  const fragmentQueue: Node[] = [result.gl_FragColor]

  const vertexWritten = new Set<Node>()
  const vertexQueue: Node[] = [result.gl_Position]

  while (fragmentQueue.length > 0) {
    const current = fragmentQueue.pop()!
    if (!fragmentWritten.has(current)) {
      fragmentWritten.add(current)

      let write = true

      if (isDataNode(current)) {
        if (current.storage === 'varying') {
          vertexQueue.push(current)
        } else if (current.storage === 'attribute') {
          write = false
        }
      }

      if (write) {
        current.write?.(fragment)
      }
    }
    fragmentQueue.unshift(...current.dependencies)
  }

  fragment.addGlobal(`precision ${options?.precision ?? 'mediump'} float;`)

  while (vertexQueue.length > 0) {
    const current = vertexQueue.pop()!
    if (!vertexWritten.has(current)) {
      vertexWritten.add(current)
      current.write?.(vertex)
    }
    vertexQueue.unshift(...current.dependencies)
  }

  return {
    vertexShader: vertex.compile(),
    fragmentShader: fragment.compile(),
  }
}
