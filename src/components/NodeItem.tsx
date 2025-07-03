import React, { useRef, useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import type { NodeType } from '../store/mindMapSlice';
import {
  addNode,
  renameNode,
  toggleCollapse,
  updatePosition,
} from '../store/mindMapSlice';
import styled from 'styled-components';

interface Props {
  node: NodeType;
}

const NodeBox = styled.div<{ x: number; y: number; isRoot: boolean }>`
  position: absolute;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  min-width: 160px;
  max-width: 220px;
  padding: 12px 14px;
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

  .label {
    margin-bottom: 12px;
    word-wrap: break-word;
  }

  input {
    width: 100%;
    font-size: 14px;
    padding: 5px;
    border: 1px solid #aaa;
    border-radius: 6px;
    outline: none;
    margin-bottom: 12px;
  }

  .button-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  button {
    flex: 1;
    padding: 4px 6px;
    font-size: 12px;
    background: #ffffff;
    border: 1px solid #bbb;
    border-radius: 5px;
    cursor: pointer;

    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 4px;

    &:hover {
      background: #f0f0f0;
    }
  }

  .arrow {
    font-size: 12px;
    line-height: 1;
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

  const handleAddNode = () => {
    if (node.collapsed) {
      dispatch(toggleCollapse(node.id)); // Auto-expand if collapsed
    }
    dispatch(addNode({ parentId: node.id }));
  };

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
        <div className="label">{node.label}</div>
      )}

      <div className="button-row">
        <button onClick={handleAddNode}>＋</button>
        <button onClick={() => dispatch(toggleCollapse(node.id))}>
          {node.collapsed ? (
            <>
              Expand <span className="arrow">▸</span>
            </>
          ) : (
            <>
              Collapse <span className="arrow">▾</span>
            </>
          )}
        </button>
      </div>
    </NodeBox>
  );
};

export default NodeItem;
