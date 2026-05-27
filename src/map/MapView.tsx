import React, { useState } from 'react'

import L from 'leaflet'

import markerIcon2x from
'leaflet/dist/images/marker-icon-2x.png'

import markerIcon from
'leaflet/dist/images/marker-icon.png'

import markerShadow from
'leaflet/dist/images/marker-shadow.png'

delete (
  L.Icon.Default.prototype as any
)._getIconUrl

L.Icon.Default.mergeOptions({

  iconRetinaUrl: markerIcon2x,

  iconUrl: markerIcon,

  shadowUrl: markerShadow,
})

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMapEvents,
} from 'react-leaflet'

import type {
  NodePosition,
  Edge,
} from '../types/graph'

type MapViewProps = {
  nodes: NodePosition[]

  setNodes: React.Dispatch<
    React.SetStateAction<NodePosition[]>
  >
  shortestPath: number[]
  edges: Edge[]
  
  animatedVisitedNodes: number[]
  setEdges: React.Dispatch<
    React.SetStateAction<Edge[]>
  >

  mode: 'edge' | 'source' | 'destination'

  setMode: React.Dispatch<
    React.SetStateAction<
      'edge' | 'source' | 'destination'
    >
  >

  sourceNode: number | null
  destinationNode: number | null

  setSourceNode: React.Dispatch<
    React.SetStateAction<number | null>
  >

  setDestinationNode: React.Dispatch<
    React.SetStateAction<number | null>
  >
}

function MapClickHandler({
  onAddNode,
}: {
  onAddNode: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onAddNode(
        e.latlng.lat,
        e.latlng.lng
      )
    },
  })

  return null
}

function MapView({
  nodes,
  setNodes,
  edges,
  setEdges,
  shortestPath,
  mode,
  setMode,
 
  sourceNode,
  destinationNode,
  animatedVisitedNodes,

  setSourceNode,
  setDestinationNode,
}: MapViewProps) {

  const [selectedNode, setSelectedNode] =
    useState<NodePosition | null>(null)

  function addNode(lat: number, lng: number) {

    const newNode: NodePosition = {
      id: Date.now(),
      lat,
      lng,
    }

    setNodes((prev) => [...prev, newNode])
  }

  function calculateDistance(
    node1: NodePosition,
    node2: NodePosition
  ) {

    const dx = node1.lat - node2.lat
    const dy = node1.lng - node2.lng

    return Math.sqrt(dx * dx + dy * dy)
  }

  

  function handleNodeClick(node: NodePosition) {

    if (mode === 'source') {

      setSourceNode(node.id)
      setMode('edge')

      console.log(
        'Source Selected:',
        node.id
      )

      return
    }

    if (mode === 'destination') {

      setDestinationNode(node.id)
      setMode('edge')

      console.log(
        'Destination Selected:',
        node.id
      )

      return
    }

    console.log('Clicked Node:', node)

    if (selectedNode === null) {

      console.log('First Node Selected')

      setSelectedNode(node)

      return
    }

    if (selectedNode.id === node.id) {
      return
    }

    console.log('Creating Edge')

    const distance = calculateDistance(
      selectedNode,
      node
    )
    const edgeAlreadyExists =
  edges.some((edge) => {

    return (
      (
        edge.from === selectedNode.id &&
        edge.to === node.id
      ) ||

      (
        edge.from === node.id &&
        edge.to === selectedNode.id
      )
    )
  })

if (edgeAlreadyExists) {

  console.log('Edge already exists')

  setSelectedNode(null)

  return
}
    const newEdge: Edge = {
      from: selectedNode.id,
      to: node.id,
      weight: Number(distance.toFixed(3)),
    }

    setEdges((prev) => [...prev, newEdge])

    

    setSelectedNode(null)
  }

  return (
    <MapContainer
      center={[21.2514, 81.6296]}
      zoom={13}
      style={{
        height: '100%',
        width: '100%',
      }}
    >

      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onAddNode={addNode} />

      {/* Render Nodes */}
      {nodes.map((node) => (

        <Marker
        draggable={true}
  key={node.id}
  position={[
    node.lat,
    node.lng,
  ]}
  eventHandlers={{
    dblclick: () => {

  // Remove node
  setNodes((prev) =>
    prev.filter(
      (n) => n.id !== node.id
    )
  )

  // Remove connected edges
  setEdges((prev) =>
    prev.filter(
      (edge) =>

        edge.from !== node.id &&
        edge.to !== node.id
    )
  )

  // Remove source selection
  if (sourceNode === node.id) {
    setSourceNode(null)
  }

  // Remove destination selection
  if (
    destinationNode === node.id
  ) {
    setDestinationNode(null)
  }
},
    dragend: (e) => {

  const marker =
    e.target

  const position =
    marker.getLatLng()

  setNodes((prevNodes) =>
    prevNodes.map((n) => {

      if (n.id === node.id) {

        return {
          ...n,
          lat: position.lat,
          lng: position.lng,
        }
      }

      return n
    })
  )
},
    click: (e) => {

      e.originalEvent.stopPropagation()

      handleNodeClick(node)
    },
  }}
>
  <Tooltip permanent direction="top">

  {
  animatedVisitedNodes.includes(
  node.id)
    ? `⚡ N${nodes.indexOf(node) + 1}`
    : `N${nodes.indexOf(node) + 1}`
}

</Tooltip>
</Marker>
      ))}

      {/* Render Edges */}
      {edges.map((edge, index) => {

        const fromNode = nodes.find(
          (node) => node.id === edge.from
        )

        const toNode = nodes.find(
          (node) => node.id === edge.to
        )

        if (!fromNode || !toNode) {
          return null
        }
        
        function isEdgeInShortestPath(
  from: number,
  to: number
) {

  for (
    let i = 0;
    i < shortestPath.length - 1;
    i++
  ) {

    const current =
      shortestPath[i]

    const next =
      shortestPath[i + 1]

    const matches =
      (
        current === from &&
        next === to
      ) ||
      (
        current === to &&
        next === from
      )

    if (matches) {

      console.log(
        'MATCHED EDGE:',
        from,
        to
      )

      return true
    }
  }

  return false
}
console.log(shortestPath)

console.log(
  edge.from,
  edge.to,
  isEdgeInShortestPath(
    edge.from,
    edge.to
  )
)

        return (
  <Polyline
    smoothFactor={5}
    key={index}
    positions={[
      [
        fromNode.lat,
        fromNode.lng,
      ] as [number, number],

      [
        toNode.lat,
        toNode.lng,
      ] as [number, number],
    ]}
    pathOptions={{
  color: isEdgeInShortestPath(
    edge.from,
    edge.to
  )
    ? '#ef4444'
    : '#3b82f6',

  dashArray: isEdgeInShortestPath(
  edge.from,
  edge.to
)
  ? undefined
  : '6',

  weight: isEdgeInShortestPath(
    edge.from,
    edge.to
  )
    ? 10
    : 3,

  opacity: isEdgeInShortestPath(
    edge.from,
    edge.to
  )
    ? 1
    : 0.7,
}}
  >
    <Tooltip sticky>
      Weight: {edge.weight}
    </Tooltip>
  </Polyline>
)
      })}

    </MapContainer>
  )
}

export default MapView