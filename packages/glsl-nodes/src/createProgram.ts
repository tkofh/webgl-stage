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

export const createProgram = (
  setup: ProgramSetup | ProgramSetupResult,
  options?: ProgramOptions
) => {
  const fragment = createWriter('fragment')
  const vertex = createWriter('vertex')

  const namer = createNamer()

  const result = typeof setup === 'function' ? setup(namer) : setup

  const uniqueNodes = new Set<Node>()
  const nodeDiscoveryQueue: Node[] = [result.gl_FragColor, result.gl_Position]
  while (nodeDiscoveryQueue.length > 0) {
    const current = nodeDiscoveryQueue.shift()!
    uniqueNodes.add(current)
    nodeDiscoveryQueue.push(...current.dependencies)
  }

  const dependencies = new Map<Node, Set<Node>>()
  const dependencyResolutionQueue = Array.from(uniqueNodes).sort(
    (a, b) => a.dependencies.length - b.dependencies.length
  )
  while (dependencyResolutionQueue.length > 0) {
    const current = dependencyResolutionQueue.shift()!
    let didResolve = true
    const currentDependencies = new Set<Node>()
    for (const dependency of current.dependencies) {
      if (dependencies.has(dependency)) {
        currentDependencies.add(dependency)
        for (const childDependency of dependencies.get(dependency)!) {
          currentDependencies.add(childDependency)
        }
      } else {
        didResolve = false
        dependencyResolutionQueue.push(current)
        break
      }
    }

    if (didResolve) {
      dependencies.set(current, currentDependencies)
    }
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

    const aDeps = dependencies.get(a)!
    const bDeps = dependencies.get(b)!

    if (aDeps.size > 0) {
      if (bDeps.size > 0) {
        if (aDeps.has(b)) {
          return bComesFirst
        }
        if (bDeps.has(a)) {
          return aComesFirst
        }

        return compareNodeOrder(
          Array.from(aDeps).reduce((largest, current) =>
            dependencies.get(largest)!.size > dependencies.get(current)!.size ? largest : current
          ),
          Array.from(bDeps).reduce((largest, current) =>
            dependencies.get(largest)!.size > dependencies.get(current)!.size ? largest : current
          )
        )
      } else {
        return bComesFirst
      }
    } else {
      return aComesFirst
    }
  }

  const fragmentDiscoveryQueue: Node[] = [result.gl_FragColor]
  const vertexDiscoveryQueue: Node[] = [result.gl_Position]

  const fragmentNodes = new Set<Node>()
  const vertexNodes = new Set<Node>()

  while (fragmentDiscoveryQueue.length > 0) {
    const current = fragmentDiscoveryQueue.pop()!
    fragmentNodes.add(current)

    if (isDataNode(current) && current.storage === 'varying') {
      vertexDiscoveryQueue.push(current)
    } else {
      fragmentDiscoveryQueue.unshift(...current.dependencies)
    }
  }

  while (vertexDiscoveryQueue.length > 0) {
    const current = vertexDiscoveryQueue.pop()!
    vertexNodes.add(current)
    vertexDiscoveryQueue.push(...current.dependencies)
  }

  fragment.addGlobal(`precision ${options?.precision ?? 'mediump'} float;`)
  for (const node of Array.from(fragmentNodes).sort(compareNodeOrder)) {
    node.write?.(fragment)
  }

  for (const node of Array.from(vertexNodes).sort(compareNodeOrder)) {
    node.write?.(vertex)
  }

  return {
    vertexShader: vertex.compile(),
    fragmentShader: fragment.compile(),
  }
}
