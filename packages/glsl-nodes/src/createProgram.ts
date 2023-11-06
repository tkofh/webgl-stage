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

const compareNodeOrder = (a: Node | undefined, b: Node | undefined): number => {
  const aComesFirst = -1
  const bComesFirst = 1

  if (a == null) {
    return bComesFirst
  }
  if (b == null) {
    return aComesFirst
  }

  if (a.dependencies.size > 0) {
    if (b.dependencies.size > 0) {
      if (a.dependencies.has(b)) {
        return bComesFirst
      }
      if (b.dependencies.has(a)) {
        return aComesFirst
      }

      return compareNodeOrder(
        Array.from(a.dependencies).reduce((largest, current) =>
          largest.dependencies.size > current.dependencies.size ? largest : current
        ),
        Array.from(b.dependencies).reduce((largest, current) =>
          largest.dependencies.size > current.dependencies.size ? largest : current
        )
      )
    } else {
      return bComesFirst
    }
  } else {
    return aComesFirst
  }
}

export const createProgram = (
  setup: ProgramSetup | ProgramSetupResult,
  options?: ProgramOptions
) => {
  const fragment = createWriter('fragment')
  const vertex = createWriter('vertex')

  const namer = createNamer()

  const result = typeof setup === 'function' ? setup(namer) : setup

  const fragmentQueue: Node[] = [result.gl_FragColor, ...result.gl_FragColor.dependencies]
  const vertexQueue: Node[] = [result.gl_Position, ...result.gl_Position.dependencies]

  fragmentQueue.sort(compareNodeOrder)
  while (fragmentQueue.length > 0) {
    const current = fragmentQueue.pop()!

    if (isDataNode(current)) {
      if (current.storage === 'varying') {
        vertexQueue.push(current)
        for (const dependency of current.dependencies) {
          if (!vertexQueue.includes(dependency)) {
            vertexQueue.push(dependency)
          }
        }
      }
    }

    current.write?.(fragment)
  }

  fragment.addGlobal(`precision ${options?.precision ?? 'mediump'} float;`)

  vertexQueue.sort(compareNodeOrder)
  while (vertexQueue.length > 0) {
    const current = vertexQueue.pop()!

    current.write?.(vertex)
  }

  return {
    vertexShader: vertex.compile(),
    fragmentShader: fragment.compile(),
  }
}
