import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import NodeItem from './NodeItem';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const MindMap = () => {
  const nodes = useSelector((state: RootState) => state.mindmap.nodes);

  return (
    <Container>
      {nodes.map(node => (
        <NodeItem key={node.id} node={node} />
      ))}
    </Container>
  );
};

export default MindMap;
