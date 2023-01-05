import type { Namer } from './namer';
import { createNamer } from './namer'
import type { Node, OutputNode, OutputType } from './nodes/types';
import { createWriter } from './writer'

type ProgramSetup = (namer: Namer) => {
  [TOutput in OutputType]: OutputNode<TOutput>
}

export const createProgram = (setup: ProgramSetup) => {
  const vertex = createWriter()
  const fragment = createWriter()

  const namer = createNamer()

  const result = setup(namer)

  const vertexQueue: Node[] = [result.gl_Position]
  while(vertexQueue.length > 0) {
    const current = vertexQueue.pop()!
    current.write?.(vertex)
    vertexQueue.push(...current.dependencies)
  }

  const fragmentQueue: Node[] = [result.gl_FragColor]
  while (fragmentQueue.length > 0) {
    const current = fragmentQueue.pop()!
    current.write?.(fragment)
    fragmentQueue.push(...current.dependencies)
  }

  console.log(vertex.compile())
  console.log(fragment.compile())
}
