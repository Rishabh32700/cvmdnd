import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

const defaultNodes = [

  {
    id: '1',
    type:"processing",
    data: { label: 'hello 1' },
    position: { x: 0, y: 100 },
    sourcePosition: "right",
  },
  {
    id: '2',
    data: { label: 'hello 2' },
    position: { x: 100, y: 100 },
    targetPosition: "left",
    sourcePosition: "right",
  },
    {
    id: '3',
    type:"processing",
    data: { label: 'hello 3' },
    position: { x: 200, y: 100 },
    sourcePosition: "left",
  },
    {
    id: '4',
    type:"input",
    data: { label: 'hello 4' },
    position: { x: 300, y: 200 },
  },
    {
    id: '5',
    data: { label: 'hello 5' },
    position: { x: 300, y: 400 },
    targetPosition: "left",
    sourcePosition:'bottom'
  },
  {
    id: '6',
    data: { label: 'hello 6' },
    position: { x: 500, y: 500 },
    targetPosition: "right",
    sourcePosition: "left",
  },
    {
    id: '7',
    data: { label: 'hello 7' },
    position: { x: 600, y: 200 },
    targetPosition: "right",
    sourcePosition:'bottom'
  },
    {
    id: '8',
    type:'output',
    data: { label: 'hello 8' },
    position: { x: 600, y: 400 },
  },
];

const defaultEdges = [];

function Flow() {
  return <ReactFlow defaultNodes={defaultNodes} defaultEdges={defaultEdges} fitView />;
}

export default Flow;
