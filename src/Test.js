import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  useStoreApi
} from "reactflow";

import "reactflow/dist/style.css";
import "./style.css";

// import { initialEdges, initialNodes } from "./nodes-and-edges";

const MIN_DISTANCE = 150;

const Flow = () => {
  const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
      borderRadius: '100%',
      backgroundColor: '#fff',
      width: 50,
      height: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
  
  const initialNodes = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: {
        label: '⬛️',
      },
      ...nodeDefaults,
    },
    {
      id: '2',
      position: { x: 250, y: -100 },
      data: {
        label: '🟩',
      },
      ...nodeDefaults,
    },
    {
      id: '3',
      position: { x: 250, y: 100 },
      data: {
        label: '🟧',
      },
      ...nodeDefaults,
    },
    {
      id: '4',
      position: { x: 500, y: 0 },
      data: {
        label: '🟦',
      },
      ...nodeDefaults,
    },
  ];
  
  const initialEdges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
    },
    {
      id: 'e1-3',
      source: '1',
      target: '3',
    },
  ];
  const store = useStoreApi();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const getClosestEdge = useCallback((node) => {
    const { nodeInternals } = store.getState();

    console.log("nodeInternals", nodeInternals, store);
    const storeNodes = Array.from(nodeInternals.values());
    console.log("storeNodes",nodeInternals, nodeInternals.values(), storeNodes);

    const closestNode = storeNodes.reduce(
      (res, n) => {
        if (n.id !== node.id) {
          console.log("node.id", node.id)
          const dx = n.positionAbsolute.x - node.positionAbsolute.x;
          const dy = n.positionAbsolute.y - node.positionAbsolute.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n;
          }
        }
        console.log("closestNode :: ", res);
        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: null
      }
    );

    if (!closestNode.node) {
      return null;
    }

    const closeNodeIsSource =
      closestNode.node.positionAbsolute.x < node.positionAbsolute.x;

    return {
      id: `${node.id}-${closestNode.node.id}`,
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      target: closeNodeIsSource ? node.id : closestNode.node.id
    };
  }, []);

  const onNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          closeEdge.className = "temp";
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");

        if (closeEdge) {
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onConnect={onConnect}
      fitView
    >
      <Background variant={BackgroundVariant.Cross} gap={50} />
    </ReactFlow>
  );
};

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
