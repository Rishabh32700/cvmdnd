import React from 'react';

export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, JSON.stringify({
        id: '1',
        type: "processing",
        data: { label: 'hello 1' },
        position: { x: 0, y: 100 },
        sourcePosition: "right",
      }))} draggable>
        1
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, JSON.stringify({
        id: '2',
        data: { label: 'hello 2' },
        position: { x: 100, y: 100 },
        targetPosition: "left",
        sourcePosition: "right",
      }))} draggable>
        2
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, JSON.stringify({
        id: '3',
        type: "processing",
        data: { label: 'hello 3' },
        position: { x: 200, y: 100 },
        sourcePosition: "left",
      }))} draggable>
        3
      </div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, JSON.stringify({
        id: '4',
        type: "input",
        data: { label: 'hello 4' },
        position: { x: 300, y: 200 },
      }))} draggable>
        4
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, JSON.stringify({
        id: '5',
        data: { label: 'hello 5' },
        position: { x: 300, y: 400 },
        targetPosition: "left",
        sourcePosition: 'bottom'
      }))} draggable>
        5
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, JSON.stringify({
        id: '6',
        data: { label: 'hello 6' },
        position: { x: 500, y: 500 },
        targetPosition: "right",
        sourcePosition: "left",
      }))} draggable>
        6
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, JSON.stringify({
        id: '7',
        data: { label: 'hello 7' },
        position: { x: 600, y: 200 },
        targetPosition: "right",
        sourcePosition: 'bottom'
      }))} draggable>
        7
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, JSON.stringify({
        id: '8',
        type: 'output',
        data: { label: 'hello 8' },
        position: { x: 600, y: 400 },
      }))} draggable>
        8
      </div>
    </aside>
  );
};
