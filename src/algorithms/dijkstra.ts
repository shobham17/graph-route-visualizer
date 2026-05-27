type AdjacencyList = Record<
  number,
  { node: number; weight: number }[]
>

type DijkstraResult = {
  distances: Record<number, number>
  previous: Record<number, number | null>
  visitedOrder: number[]
}

export function dijkstra(
  graph: AdjacencyList,
  startNode: number
): DijkstraResult {

  const distances: Record<number, number> = {}

  const previous: Record<number, number | null> = {}

  const unvisited = new Set<number>()
  const visitedOrder: number[] = []

  // Initialize all nodes
  for (const node in graph) {

    const numericNode = Number(node)

    distances[numericNode] = Infinity

    previous[numericNode] = null

    unvisited.add(numericNode)
  }

  // Start node distance = 0
  distances[startNode] = 0

  while (unvisited.size > 0) {

    let currentNode: number | null = null

    // Find node with minimum distance
    unvisited.forEach((node) => {

      if (
        currentNode === null ||
        distances[node] <
        distances[currentNode]
      ) {
        currentNode = node
      }
    })

    if (currentNode === null) {
      break
    }

    unvisited.delete(currentNode)
    visitedOrder.push(currentNode)

    // Explore neighbors
    graph[currentNode].forEach((neighbor) => {

      const tentativeDistance =
        distances[currentNode!] +
        neighbor.weight

      if (
        tentativeDistance <
        distances[neighbor.node]
      ) {

        distances[neighbor.node] =
          tentativeDistance

        previous[neighbor.node] =
          currentNode
      }
    })
  }

 return {
  distances,
  previous,
  visitedOrder,
}
}

export function reconstructPath(
  previous: Record<number, number | null>,
  destinationNode: number
) {

  const path: number[] = []

  let currentNode: number | null =
    destinationNode

  while (currentNode !== null) {

    path.unshift(currentNode)

    currentNode =
      previous[currentNode]
  }

  return path
}