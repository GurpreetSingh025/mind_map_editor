import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import type { NodeType } from '../store/mindMapSlice';
import { addNode, renameNode, toggleCollapse, updatePosition } from '../store/mindMapSlice';
import styled from 'styled-components';

interface Props {
  node: NodeType;
}

const NodeBox = styled.div<{ x: number; y: number; isRoot: boolean }>`
  position: absolute;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  min-width: 140px;
  max-width: 200px;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  background: ${p => (p.isRoot ? '#e0f7fa' : '#f3f4f6')};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid ${p => (p.isRoot ? '#00acc1' : '#ccc')};
  color: #333;
  cursor: move;
  user-select: none;
  z-index: 10;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  input {
    width: 100%;
    font-size: 14px;
    padding: 4px;
    border: 1px solid #aaa;
    border-radius: 6px;
    outline: none;
  }

  button {
    margin: 4px 2px;
    padding: 2px 6px;
    font-size: 12px;
    background: #ffffff;
    border: 1px solid #bbb;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #f0f0f0;
    }
  }
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

  const isRoot = node.parentId === null;

  return (
    <NodeBox
      x={node.position.x}
      y={node.position.y}
      isRoot={isRoot}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <input
          ref={inputRef}
          value={node.label}
          onChange={e => dispatch(renameNode({ id: node.id, label: e.target.value }))}
          onBlur={() => setEditing(false)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setEditing(false);
            }
          }}
        />
      ) : (
        <div>{node.label}</div>
      )}
      <div style={{ marginTop: '6px' }}>
        <button onClick={() => dispatch(addNode({ parentId: node.id }))}>+</button>
        <button onClick={() => dispatch(toggleCollapse(node.id))}>
          {node.collapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
    </NodeBox>
  );
};

export default NodeItem;
