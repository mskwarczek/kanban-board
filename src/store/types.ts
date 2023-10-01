export interface TaskInterface {
  id: string;
  name: string;
  owner: string;
  completed: boolean;
  subtaskOf?: string;
}

export interface TaskGroupInterface {
  id: string;
  name: string;
  position: number;
  owner: string;
}

export interface WorkspaceInterface {
  id: string;
  name: string;
  position: number;
}

export interface BoardInterface {
  workspaces: WorkspaceInterface[];
  groups: TaskGroupInterface[];
  tasks: TaskInterface[];
  isEdited: boolean;
  isCreatingNewWorkspace: boolean;
  selectedWorkspace?: string;
}
