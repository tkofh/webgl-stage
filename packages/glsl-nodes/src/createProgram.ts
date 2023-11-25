/* eslint-disable no-console */
import { collectDependencies } from './helpers'
import type { Namer } from './namer'
import { createNamer } from './namer'
import type { DataNode, DataType, Node, OutputNode, OutputType } from './nodes/types'
import { createWriter } from './writer'

type ProgramSetupResult = {
  [TOutput in OutputType]: OutputNode<TOutput>
}

type ProgramSetup = (namer: Namer) => ProgramSetupResult

export interface ProgramOptions {
  debug?: boolean
  precision?: 'lowp' | 'mediump' | 'highp'
}

export const createProgram = (
  setup: ProgramSetup | ProgramSetupResult,
  options?: ProgramOptions
) => {
  const debug = options?.debug ?? false

  if (debug) {
    console.log('createProgram', setup, options)
    console.time('program created')
  }
  const fragment = createWriter('fragment')
  const vertex = createWriter('vertex')

  const namer = createNamer()

  const result = typeof setup === 'function' ? setup(namer) : setup

  if (debug) {
    console.log('result', result)
    console.time('collected unique nodes')
  }

  const uniqueNodes = collectDependencies(result.gl_FragColor, result.gl_Position)

  if (debug) {
    console.timeEnd('collected unique nodes')
    console.log('uniqueNodes', uniqueNodes)

    console.time('dependencies resolved')
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

  if (debug) {
    console.timeEnd('dependencies resolved')
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

  if (debug) {
    console.time('fragment nodes collected')
  }

  while (fragmentDiscoveryQueue.length > 0) {
    const current = fragmentDiscoveryQueue.pop()!
    fragmentNodes.add(current)

    if (isDataNode(current) && current.storage === 'varying') {
      vertexDiscoveryQueue.push(current)
    } else {
      fragmentDiscoveryQueue.unshift(...current.dependencies)
    }
  }

  if (debug) {
    console.timeEnd('fragment nodes collected')
    console.time('vertex nodes collected')
  }

  while (vertexDiscoveryQueue.length > 0) {
    const current = vertexDiscoveryQueue.pop()!
    vertexNodes.add(current)
    vertexDiscoveryQueue.push(...current.dependencies)
  }

  if (debug) {
    console.time('vertex nodes collected')
  }

  fragment.addGlobal(`precision ${options?.precision ?? 'mediump'} float;`)
  for (const node of Array.from(fragmentNodes).sort(compareNodeOrder)) {
    node.write?.(fragment)
  }

  for (const node of Array.from(vertexNodes).sort(compareNodeOrder)) {
    node.write?.(vertex)
  }

  if (debug) {
    console.timeEnd('program created')
  }

  return {
    vertexShader: vertex.compile(),
    fragmentShader: fragment.compile(),
    nodes: new WeakSet(uniqueNodes),
  }
}
