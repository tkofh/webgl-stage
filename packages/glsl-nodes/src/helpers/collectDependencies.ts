import type { Node } from '../nodes/types'

export const collectDependencies = (...nodes: (Node | Node[])[]) => {
  const uniqueNodes = new Set<Node>()
  const nodeDiscoveryQueue = nodes.flat()

  while (nodeDiscoveryQueue.length > 0) {
    const current = nodeDiscoveryQueue.shift()!
    uniqueNodes.add(current)
    nodeDiscoveryQueue.push(...current.dependencies)
  }

  return uniqueNodes
}
