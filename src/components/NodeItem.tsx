import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import type { NodeType } from '../store/mindMapSlice';
import { addNode, renameNode, toggleCollapse, updatePosition } from '../store/mindMapSlice';
import styled from 'styled-components';

interface Props {
  node: NodeType;
}

const NodeBox = styled.div<{ x: number; y: number }>`
  position: absolute;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  background: #fff;
  border: 1px solid #aaa;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: move;
  user-select: none;
`;

const NodeItem = ({ node }: Props) => {
  const dispatch = useAppDispatch();
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...node.position };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      dispatch(updatePosition({ id: node.id, x: startPos.x + dx, y: startPos.y + dy }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <NodeBox
      x={node.position.x}
      y={node.position.y}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={node.label}
          onChange={e => dispatch(renameNode({ id: node.id, label: e.target.value }))}
          onBlur={() => setEditing(false)}
        />
      ) : (
        <div>{node.label}</div>
      )}
      <div style={{ marginTop: '4px' }}>
        <button onClick={() => dispatch(addNode({ parentId: node.id }))}>+</button>
        <button onClick={() => dispatch(toggleCollapse(node.id))}>
          {node.collapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
    </NodeBox>
  );
};

export default NodeItem;
