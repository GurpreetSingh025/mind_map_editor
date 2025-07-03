import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface NodeType {
  id: string;
  parentId: string | null;
  label: string;
  collapsed: boolean;
  position: { x: number; y: number };
}

interface MindMapState {
  nodes: NodeType[];
}

const initialState: MindMapState = {
  nodes: [
    {
      id: 'root',
      parentId: null,
      label: 'Root',
      collapsed: false,
      position: { x: 300, y: 50 },
    },
  ],
};

const mindMapSlice = createSlice({
  name: 'mindmap',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<{ parentId: string }>) => {
      const parent = state.nodes.find(n => n.id === action.payload.parentId);
      const id = Date.now().toString();
      const offset = 50;

      state.nodes.push({
        id,
        parentId: action.payload.parentId,
        label: 'New Node',
        collapsed: false,
        position: {
          x: (parent?.position.x ?? 100) + offset,
          y: (parent?.position.y ?? 100) + offset,
        },
      });
    },
    updatePosition: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) node.position = { x: action.payload.x, y: action.payload.y };
    },
    toggleCollapse: (state, action: PayloadAction<string>) => {
      const node = state.nodes.find(n => n.id === action.payload);
      if (node) node.collapsed = !node.collapsed;
    },
    renameNode: (state, action: PayloadAction<{ id: string; label: string }>) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) node.label = action.payload.label;
    },
  },
});

export const { addNode, updatePosition, toggleCollapse, renameNode } = mindMapSlice.actions;
export default mindMapSlice.reducer;
