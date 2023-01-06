import type { Namer } from './namer'
import { createNamer } from './namer'
import type { Node, OutputNode, OutputType } from './nodes/types'
import { createWriter } from './writer'

type ProgramSetup = (namer: Namer) => {
  [TOutput in OutputType]: OutputNode<TOutput>
}

interface ProgramOptions {
  precision?: 'lowp' | 'mediump' | 'highp'
}

export const createProgram = (setup: ProgramSetup, options?: ProgramOptions) => {
  const vertex = createWriter()
  const fragment = createWriter()

  const namer = createNamer()

  const result = setup(namer)

  const vertexWritten = new Set<Node>()
  const vertexQueue: Node[] = [result.gl_Position]
  while (vertexQueue.length > 0) {
    const current = vertexQueue.pop()!
    if (!vertexWritten.has(current)) {
      vertexWritten.add(current)
      current.write?.(vertex)
    }
    vertexQueue.push(...current.dependencies)
  }

  const fragmentWritten = new Set<Node>()
  const fragmentQueue: Node[] = [result.gl_FragColor]
  while (fragmentQueue.length > 0) {
    const current = fragmentQueue.pop()!
    if (!fragmentWritten.has(current)) {
      fragmentWritten.add(current)
      current.write?.(fragment)
    }
    fragmentQueue.push(...current.dependencies)
  }

  fragment.addGlobal(`precision ${options?.precision ?? 'mediump'} float;`)

  return {
    vertex: vertex.compile(),
    fragment: fragment.compile(),
  }
}
