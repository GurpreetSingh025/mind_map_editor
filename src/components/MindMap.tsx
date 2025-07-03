import { useAppSelector } from '../store/hooks';
import NodeItem from './NodeItem';
import styled from 'styled-components';
import type { NodeType } from '../store/mindMapSlice';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

// Helper: check if any ancestor is collapsed
const isVisible = (node: NodeType, nodes: NodeType[]): boolean => {
  let current = node;
  while (current.parentId) {
    const parent = nodes.find(n => n.id === current.parentId);
    if (!parent) break;
    if (parent.collapsed) return false;
    current = parent;
  }
  return true;
};

const MindMap = () => {
  const nodes = useAppSelector(state => state.mindmap.nodes);
  const visibleNodes = nodes.filter(node => isVisible(node, nodes));

  return (
    <Container>
      {/* SVG layer behind nodes */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
      >
        {visibleNodes.map(child => {
          if (!child.parentId) return null;

          const parent = nodes.find(n => n.id === child.parentId);
          if (!parent || !isVisible(parent, nodes)) return null;

          const parentX = parent.position.x + 75; // Adjust to center of node box
          const parentY = parent.position.y + 25;
          const childX = child.position.x + 75;
          const childY = child.position.y + 25;

          return (
            <line
              key={`${parent.id}-${child.id}`}
              x1={parentX}
              y1={parentY}
              x2={childX}
              y2={childY}
              stroke="#888"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {visibleNodes.map((node: NodeType) => (
        <NodeItem key={node.id} node={node} />
      ))}
    </Container>
  );
};

export default MindMap;
