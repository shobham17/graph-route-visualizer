import type { Edge } from '../types/graph'

export function buildAdjacencyList(
  nodes: number[],
  edges: Edge[]
) {

  const adjacencyList: Record<
    number,
    { node: number; weight: number }[]
  > = {}

  // Initialize nodes
  nodes.forEach((nodeId) => {
    adjacencyList[nodeId] = []
  })

  // Add edges
  edges.forEach((edge) => {

    adjacencyList[edge.from].push({
      node: edge.to,
      weight: edge.weight,
    })

    adjacencyList[edge.to].push({
      node: edge.from,
      weight: edge.weight,
    })
  })

  return adjacencyList
}