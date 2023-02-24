import React, { useState, useRef, useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useStoreApi,
} from "reactflow";
import "reactflow/dist/style.css";

import Sidebar from "./Sidebar";

import "./index.css";
import BasicModal from "./Modal";

const initialNodes = [
  {
    id: "1",
    type: "output",
    data: { label: "camp name" },
    position: { x: 5, y: 5 },
  },
  {
    id: "2",
    type: "processing",
    data: { label: "processing name" },
    position: { x: 200, y: 200 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const store = useStoreApi();
  const MIN_DISTANCE = 150;
  const tags = [
    { tagName: "tag1" },
    { tagName: "tag2" },
    { tagName: "tag3" },
    { tagName: "tag4" },
  ];




  const getClosestEdge = useCallback((node) => {
    console.log("getclosestnode");
    const initialSetNodes = store.setState(initialNodes)
    
    const { nodeInternals } = store.getState();
    console.log("nodeInternals", nodeInternals, store);
    const storeNodes = Array.from(nodeInternals.values());
console.log("storeNodes", storeNodes);
    const closestNode = storeNodes.reduce(
      (res, n) =>
       {
        console.log("node.id", node.id);
        if (n.id !== node.id) {
          console.log("inifclosestNode");
          const dx = n.positionAbsolute.x - node.positionAbsolute.x;
          const dy = n.positionAbsolute.y - node.positionAbsolute.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n;
          }
        }
        console.log("outifclosestNode :: ", res);
        
        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: null,
        name:"rishb ah"
      }
      );
      console.log("outoutifclosestNode")
      console.log("closestNode", closestNode)

    if (!closestNode.node) {
      console.log("nulll");
      return null;
    }

    const closeNodeIsSource = closestNode.node.positionAbsolute.x < node.positionAbsolute.x;

    return {
      id: `${node.id}-${closestNode.node.id}`,
      source: closeNodeIsSource ? closestNode.node.id : node.id,
      target: closeNodeIsSource ? node.id : closestNode.node.id,
    };
  }, []);


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      console.log(JSON.parse(type));
      const finalData = JSON.parse(type);
      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type: finalData.type && finalData.type,
        position,
        data: finalData.data,
        sourcePosition: finalData.sourcePosition && finalData.sourcePosition,
        targetPosition: finalData.targetPosition && finalData.targetPosition,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );


  const onNodeDrag = useCallback(
    (_, node) => {
      console.log("nodeDrag")
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (
          closeEdge &&
          !nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)
        ) {
          closeEdge.className = 'temp';
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
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (closeEdge) {
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge]
  );


  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
          style={{
            border: "2px solid red",
            height: "100vh",
            width: "100vw",
            display: "flex",
            flexDirection: "column",
          }}>
          <div style={{ border: "2px solid red" }}>
            {tags.map((ele, idx) => {
              return (
                <>
                  <div
                    style={{
                      border: "2px solid red",
                      display: "inline-block",
                      padding: "1rem 3rem",
                      margin: "1rem",
                    }}
                    onClick={() => {
                      setOpenModal(true);
                    }}>
                    {ele.tagName}
                  </div>
                </>
              );
            })}
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeDragStop={onNodeDragStop}
            onNodeDrag={onNodeDrag}

            fitView>
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      </ReactFlowProvider>
      {openModal ? (
        <>
          <BasicModal openModal={openModal} setOpenModal={setOpenModal} />
        </>
      ) : null}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDFlow />
  </ReactFlowProvider>
);
