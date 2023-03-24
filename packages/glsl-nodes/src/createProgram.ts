import type { Namer } from './namer'
import { createNamer } from './namer'
import type { Node, OutputNode, OutputType } from './nodes/types'
import { createWriter } from './writer'

type ProgramSetupResult = {
  [TOutput in OutputType]: OutputNode<TOutput>
}

type ProgramSetup = (namer: Namer) => ProgramSetupResult

export interface ProgramOptions {
  precision?: 'lowp' | 'mediump' | 'highp'
}

export const createProgram = (
  setup: ProgramSetup | ProgramSetupResult,
  options?: ProgramOptions
) => {
  const vertex = createWriter()
  const fragment = createWriter()

  const namer = createNamer()

  const result = typeof setup === 'function' ? setup(namer) : setup

  const vertexWritten = new Set<Node>()
  const vertexQueue: Node[] = [result.gl_Position]
  while (vertexQueue.length > 0) {
    const current = vertexQueue.pop()!
    if (!vertexWritten.has(current)) {
      vertexWritten.add(current)
      current.write?.(vertex)
    }
    vertexQueue.unshift(...current.dependencies)
  }

  const fragmentWritten = new Set<Node>()
  const fragmentQueue: Node[] = [result.gl_FragColor]
  while (fragmentQueue.length > 0) {
    const current = fragmentQueue.pop()!
    if (!fragmentWritten.has(current)) {
      fragmentWritten.add(current)
      current.write?.(fragment)
    }
    fragmentQueue.unshift(...current.dependencies)
  }

  fragment.addGlobal(`precision ${options?.precision ?? 'mediump'} float;`)

  return {
    vertex: vertex.compile(),
    fragment: fragment.compile(),
  }
}
