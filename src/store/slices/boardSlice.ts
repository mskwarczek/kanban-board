import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'

import { createId } from '../../utils/createId';
import type {
  BoardInterface,
  WorkspaceInterface,
  TaskGroupInterface,
  TaskInterface
} from '../types';

// const initialState: BoardInterface | Record<string, never> = {
//   workspaces: [],
//   groups: [],
//   tasks: [],
//   isEdited: false,
//   isCreatingNewWorkspace: false,
//   selectedWorkspace: undefined,
// };

const testState: BoardInterface | Record<string, never> = {
  workspaces: [{
    id: 'workspace-1',
    name: 'Test workspace 1',
    position: Infinity,
  }],
  groups: [{
    id: 'group-00',
    name: 'Test group normal length',
    position: Infinity,
    owner: 'workspace-1',
  }],
  tasks: [{
      id: 'task-000',
      name: 'Test task normal length',
      owner: 'group-00',
      completed: false,
    }, {
      id: 'task-001',
      name: 'This is a task with very long name using typical english words intended to to see if it is displayed correctly',
      owner: 'group-00',
      completed: false,
    }, {
      id: 'task-002',
      name: 'Thhheeeeesssseeeee aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaarrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrreeeeeeeeeeeeeeeeeeeeeeeeeeeee lllllllllllllllllllllllllloooooooooooooooonnnnnnnngggggggg wwwwwwwwwwwwwwwwwwooooooooooorrrrrrrdddddddddsssssssss',
      owner: 'group-00',
      completed: false,
    },
  ],
  isEdited: false,
  isCreatingNewWorkspace: false,
  selectedWorkspace: undefined,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState: testState,
  reducers: {
    createWorkspace(state, action: PayloadAction<{
      name: string;
    }>) {
      const workspaceId = createId('workspace');
      const newWorkspace: WorkspaceInterface = {
        id: workspaceId,
        name: action.payload.name,
        position: Infinity,
      }
      state.workspaces.push(newWorkspace);
      state.selectedWorkspace = workspaceId;
    },
    editWorkspaceName(state, action: PayloadAction<{
      id: string;
      name: string;
    }>) {
      const workspaceIndex = state.workspaces.findIndex(workspace => workspace.id === action.payload.id);
      if (workspaceIndex !== -1) state.workspaces[workspaceIndex].name = action.payload.name;
    },
    deleteWorkspace(state, action: PayloadAction<string>) {
      state.workspaces = state.workspaces.filter(workspace => workspace.id !== action.payload);
      state.selectedWorkspace = '';
    },
    createGroup(state, action: PayloadAction<{
      name: string;
      owner: string;
    }>) {
      const newGroup: TaskGroupInterface = {
        id: createId('group'),
        name: action.payload.name,
        owner: action.payload.owner,
        position: Infinity,
      }
      state.groups.push(newGroup);
    },
    editGroupName(state, action: PayloadAction<{
      id: string;
      name: string;
    }>) {
      const groupIndex = state.groups.findIndex(group => group.id === action.payload.id);
      if (groupIndex !== -1) state.groups[groupIndex].name = action.payload.name;
    },
    deleteGroup(state, action: PayloadAction<string>) {
      state.groups = state.groups.filter(group => group.id !== action.payload);
    },
    createTask(state, action: PayloadAction<{
      name: string;
      owner: string;
    }>) {
      const newTask: TaskInterface = {
        id: createId('task'),
        name: action.payload.name,
        owner: action.payload.owner,
        completed: false,
      }
      state.tasks.push(newTask);
    },
    editTaskName(state, action: PayloadAction<{
      id: string;
      name: string;
    }>) {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload.id);
      if (taskIndex !== -1) state.tasks[taskIndex].name = action.payload.name;
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    setEditing(state, action: PayloadAction<boolean>) {
      state.isEdited = action.payload;
    },
    setCreatingNewWorkspace(state, action: PayloadAction<boolean>) {
      state.isCreatingNewWorkspace = action.payload;
    },
    selectWorkspace(state, action: PayloadAction<string>) {
      state.selectedWorkspace = action.payload;
    },
  },
});


export const {
  createWorkspace,
  editWorkspaceName,
  deleteWorkspace,
  createGroup,
  editGroupName,
  deleteGroup,
  createTask,
  editTaskName,
  deleteTask,
  setEditing,
  setCreatingNewWorkspace,
  selectWorkspace,
} = boardSlice.actions;
