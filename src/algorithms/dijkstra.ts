import MinHeap from
'../dataStructures/MinHeap'

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

  
  const visitedOrder: number[] = []
  const minHeap = new MinHeap()

  // Initialize all nodes
  for (const node in graph) {

    const numericNode = Number(node)

    distances[numericNode] = Infinity

    previous[numericNode] = null

    
  }

  // Start node distance = 0
  distances[startNode] = 0
  minHeap.insert({
  node: startNode,
  distance: 0,
})

while (!minHeap.isEmpty()) {

  const minNode =
    minHeap.extractMin()

  if (!minNode) {
    break
  }

  const currentNode =
    minNode.node

  visitedOrder.push(
    currentNode
  )

  graph[currentNode].forEach(
    (neighbor) => {

      const tentativeDistance =
        distances[currentNode] +
        neighbor.weight

      if (
        tentativeDistance <
        distances[neighbor.node]
      ) {

        distances[neighbor.node] =
          tentativeDistance

        previous[neighbor.node] =
          currentNode

        minHeap.insert({
          node: neighbor.node,

          distance:
            tentativeDistance,
        })
      }
    }
  )
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