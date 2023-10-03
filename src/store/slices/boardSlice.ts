import { createSlice } from '@reduxjs/toolkit';
import { arrayMove } from '@dnd-kit/sortable';
import type { PayloadAction } from '@reduxjs/toolkit'

import { createId } from '../../utils/createId';
import type {
  BoardInterface,
  WorkspaceInterface,
  TaskGroupInterface,
  TaskInterface
} from '../types';

const initialState: BoardInterface | Record<string, never> = {
  workspaces: [{
    id: 'workspace-100',
    name: 'Acme Corp Workspace',
  }],
  groups: [{
    id: 'group-100',
    name: 'Working on',
    owner: 'workspace-100',
  }, {
    id: 'group-200',
    name: 'Review',
    owner: 'workspace-100',
  }],
  tasks: [{
    id: 'task-100',
    name: 'Create a video for Acme',
    owner: 'group-100',
    completed: true,
  }, {
    id: 'task-200',
    name: 'Review Acme PDF',
    owner: 'group-100',
    completed: false,
  }, {
    id: 'task-300',
    name: 'Social Media posts for Acme',
    owner: 'group-200',
    completed: false,
  }, {
    id: 'task-400',
    name: 'Facebook Campaign',
    owner: 'group-200',
    completed: true,
  }, {
    id: 'task-500',
    name: 'TikTok Profile Setup',
    owner: 'group-200',
    completed: false,
  }, {
    id: 'task-600',
    name: 'Review Acme PDF',
    owner: 'group-200',
    completed: false,
    subtaskOf: 'task-500',
  }, {
    id: 'task-700',
    name: 'Create a video for Acme',
    owner: 'group-200',
    completed: false,
    subtaskOf: 'task-500',
  }, {
    id: 'task-800',
    name: 'Marketing list',
    owner: 'group-200',
    completed: false,
  }, {
    id: 'task-900',
    name: 'Company video',
    owner: 'group-200',
    completed: false,
  }],
  isEdited: false,
  isCreatingNewWorkspace: false,
  selectedWorkspace: 'workspace-100',
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    createWorkspace(state, action: PayloadAction<{
      name: string;
    }>) {
      const workspaceId = createId('workspace');
      const newWorkspace: WorkspaceInterface = {
        id: workspaceId,
        name: action.payload.name,
      }
      state.workspaces.push(newWorkspace);
      state.groups.push({
        id: createId('group'),
        name: 'Working on',
        owner: workspaceId,
      }, {
        id: createId('group'),
        name: 'Review',
        owner: workspaceId,
      });
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
      const groups = state.groups.filter(group => group.owner === action.payload).map(group => group.id);
      state.tasks = state.tasks.filter(task => !groups.includes(task.owner));
      state.groups = state.groups.filter(group => group.owner !== action.payload);
      state.selectedWorkspace = '';
    },
    editWorkspacePosition(state, action: PayloadAction<{
      activeId: string;
      overId: string;
    }>) {
      const oldIndex = state.workspaces.findIndex(workspace => workspace.id === action.payload.activeId);
      const newIndex = state.workspaces.findIndex(workspace => workspace.id === action.payload.overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSorting = arrayMove(state.workspaces, oldIndex, newIndex);
        state.workspaces = newSorting;
      }
    },
    editGroupPosition(state, action: PayloadAction<{
      activeId: string;
      overId: string;
    }>) {
      const oldIndex = state.groups.findIndex(group => group.id === action.payload.activeId);
      const newIndex = state.groups.findIndex(group => group.id === action.payload.overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newSorting = arrayMove(state.groups, oldIndex, newIndex);
        state.groups = newSorting;
      }
    },
    moveTaskToDifferentGroup(state, action: PayloadAction<{
      activeId: string;
      overGroup: string;
    }>) {
      const oldIndex = state.tasks.findIndex(task => task.id === action.payload.activeId);
      if (oldIndex !== -1) {
        state.tasks.forEach(task => {
          if (task.subtaskOf === action.payload.activeId) task.owner = action.payload.overGroup;
        })
        state.tasks[oldIndex].owner = action.payload.overGroup;
      }
    },
    createGroup(state, action: PayloadAction<{
      name: string;
      owner: string;
    }>) {
      const newGroup: TaskGroupInterface = {
        id: createId('group'),
        name: action.payload.name,
        owner: action.payload.owner,
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
      state.tasks = state.tasks.filter(task => task.owner !== action.payload);
    },
    createTask(state, action: PayloadAction<{
      name: string;
      owner: string;
      completed: boolean;
      subtaskOf?: string;
    }>) {
      const newTask: TaskInterface = {
        id: createId('task'),
        name: action.payload.name,
        owner: action.payload.owner,
        completed: action.payload.completed,
        subtaskOf: action.payload.subtaskOf || undefined,
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
    toggleTaskComplete(state, action: PayloadAction<string>) {
      const taskIndex = state.tasks.findIndex(task => task.id === action.payload);
      if (taskIndex !== -1) {
        const taskStatus = state.tasks[taskIndex].completed;
        state.tasks[taskIndex].completed = !taskStatus;
      }
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
  toggleTaskComplete,
  setEditing,
  setCreatingNewWorkspace,
  selectWorkspace,
  editWorkspacePosition,
  editGroupPosition,
  moveTaskToDifferentGroup,
} = boardSlice.actions;
