import MapView from '../map/MapView'

import { useState } from 'react'
import {
  dijkstra,
  reconstructPath,
} from '../algorithms/dijkstra'

import {
  buildAdjacencyList,
} from '../utils/graphUtils'

import type {
  NodePosition,
  Edge,
} from '../types/graph'

function HomePage() {
  const [nodes, setNodes] =
    useState<NodePosition[]>([])

  const [edges, setEdges] =
    useState<Edge[]>([])

  const [mode, setMode] = useState<
    'edge' | 'source' | 'destination'
    >('edge')

  const [sourceNode, setSourceNode] =
  useState<number | null>(null)

  const [destinationNode, setDestinationNode] =
  useState<number | null>(null)  

  const [shortestPath, setShortestPath] =
  useState<number[]>([])

  const [shortestDistance, setShortestDistance] =
  useState<number | null>(null)

  const algorithm = 'Dijkstra'

  const [visitedNodes, setVisitedNodes] =
  useState(0)

  const [animatedVisitedNodes,setAnimatedVisitedNodes] = useState<number[]>([])

  

  function handleRunDijkstra() {

  if (
    sourceNode === null ||
    destinationNode === null
  ) {

    alert(
      'Please select source and destination nodes'
    )

    return
  }

  if (nodes.length < 2) {

  alert(
    'Create at least 2 nodes'
  )

  return
}

if (edges.length < 1) {

  alert(
    'Create at least 1 edge'
  )

  return
}

if (sourceNode === destinationNode) {

  alert(
    'Source and destination cannot be same'
  )

  return
}

  const adjacencyList =
    buildAdjacencyList(
      nodes.map((node) => node.id),
      edges
    )

  
  setAnimatedVisitedNodes([])
  const result = dijkstra(
    adjacencyList,
    sourceNode
  )

  const computedPath =
    reconstructPath(
      result.previous,
      destinationNode
    )


setShortestPath(computedPath)
setShortestDistance(
  result.distances[destinationNode]
)
setVisitedNodes(
  Object.keys(result.distances).length
)

result.visitedOrder.forEach(
  (nodeId, index) => {

    setTimeout(() => {

      setAnimatedVisitedNodes(
        (prev) => [
          ...prev,
          nodeId,
        ]
      )

    }, index * 400)
  }
)

  }
  
  function handleClearGraph() {

  setNodes([])

  setEdges([])

  setShortestPath([])

  setShortestDistance(null)

  setSourceNode(null)

  setDestinationNode(null)
  setVisitedNodes(0)

setAnimatedVisitedNodes([])

  setMode('edge')
}

  return (
    <div style={styles.container}>

      <header style={styles.header}>
        GraphRoute Visualizer
      </header>

      <div style={styles.mainContent}>

        <aside style={styles.sidebar}>
          <h2>Controls</h2>

          <button
  style={{
    ...styles.button,

    ...(mode === 'edge'
      ? styles.activeButton
      : {}),
  }}
  onClick={() => setMode('edge')}
>
  Edge Mode
</button>

<button
  style={{
    ...styles.button,

    ...(mode === 'source'
      ? styles.activeButton
      : {}),
  }}
  onClick={() => setMode('source')}
>
  Select Source
</button>

<button
  style={{
    ...styles.button,

    ...(mode === 'destination'
      ? styles.activeButton
      : {}),
  }}
  onClick={() => setMode('destination')}
>
  Select Destination
</button>

<div
  style={{
    ...styles.button,

    background: '#1e293b',

    textAlign: 'center',
  }}
>
  Algorithm: Dijkstra
</div>

<button
  style={styles.button}
  onClick={handleRunDijkstra}
>
  Run Dijkstra
</button>

<button
  style={styles.button}
  onClick={handleClearGraph}
>
  Clear Graph
</button>

<hr />

<p style={{ margin: '6px 0' }}>
  Nodes: {nodes.length}
</p>

<p style={{ margin: '6px 0' }}>
  Edges: {edges.length}
</p>

<p style={{ margin: '6px 0' }}>
  Current Mode: {mode}
</p>

<p style={{ margin: '6px 0' }}>
  Algorithm: {algorithm}
</p>

<p style={{ margin: '6px 0' }}>
  Visited Nodes: {visitedNodes}
</p>

<p style={{ margin: '6px 0' }}>
  Source:
  {sourceNode !== null
    ? ` N${nodes.findIndex(
        (n) => n.id === sourceNode
      ) + 1}`
    : ' None'}
</p>

<p style={{ margin: '6px 0' }}>
  Destination:
  {destinationNode !== null
    ? ` N${nodes.findIndex(
        (n) => n.id === destinationNode
      ) + 1}`
    : ' None'}
</p>

<p style={{ margin: '6px 0' }}>
  Source:
  {sourceNode
    ? ' Selected'
    : ' Not Selected'}
</p>

<p style={{ margin: '6px 0' }}>
  Destination:
  {destinationNode
    ? ' Selected'
    : ' Not Selected'}
</p>

    <hr />

<p style={{ margin: '6px 0' }}>
  Shortest Distance:
  {shortestDistance !== null
    ? ` ${shortestDistance.toFixed(2)}`
    : ' --'}
</p>

<p style={{ margin: '6px 0' }}>
  Path:
  {shortestPath.length > 0
    ? shortestPath
        .map((nodeId) => {

          const index =
            nodes.findIndex(
              (n) => n.id === nodeId
            )

          return `N${index + 1}`
        })
        .join(' → ')
    : ' --'}
</p>

        <hr />

<p
  style={{
    fontSize: '12px',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: '18px',
  }}
>
  Built with React,
  TypeScript, Leaflet &
  Dijkstra Algorithm
</p>

        </aside>

        <main style={styles.mapArea}>
          <MapView
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
        
            mode={mode}
            setMode={setMode}
            shortestPath={shortestPath}
            sourceNode={sourceNode}
            destinationNode={destinationNode}
            animatedVisitedNodes={animatedVisitedNodes}
            setSourceNode={setSourceNode}
            setDestinationNode={setDestinationNode}
            />
        </main>

      </div>
    </div>
  )
}

const styles = {
  
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },

  header: {
  height: '70px',

  background: '#0f172a',

  color: 'white',

  display: 'flex',

  alignItems: 'center',

  paddingLeft: '24px',

  fontSize: '28px',

  fontWeight: 'bold',

  letterSpacing: '1px',

  boxShadow:
    '0 2px 10px rgba(0,0,0,0.3)',

  zIndex: 1000,
},

  mainContent: {
    flex: 1,
    display: 'flex',
  },

  sidebar: {
  position: 'absolute' as const,
  maxHeight: '85vh',
  transition: '0.3s',
  overflowY: 'auto' as const,
  top: '80px',
  left: '20px',

  width: '250px',

  background: 'rgba(17, 24, 39, 0.85)',

  backdropFilter: 'blur(12px)',

  borderRadius: '20px',

  padding: '16px',

  display: 'flex',
  flexDirection: 'column' as const,

  gap: '6px',

  color: 'white',

  zIndex: 1000,

  boxShadow:
    '0 8px 32px rgba(0,0,0,0.35)',
},

  button: {
  background: '#2563eb',
  boxShadow:
  '0 4px 12px rgba(0,0,0,0.2)',

  color: 'white',

  border: 'none',

  padding: '12px',

  borderRadius: '10px',

  cursor: 'pointer',

  fontSize: '15px',

  fontWeight: 600,

  transition: '0.2s',
},

  activeButton: {
  background: '#22c55e',

  transform: 'scale(1.03)',

  boxShadow:
    '0 0 15px rgba(34,197,94,0.6)',
},

  mapArea: {
    flex: 1,
    background:
  'linear-gradient(to bottom, #0f172a, #111827)',
  },
}

export default HomePage