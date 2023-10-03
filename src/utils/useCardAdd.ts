import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  createTask,
  createGroup,
  createWorkspace,
  setCreatingNewWorkspace,
} from '../store/slices';
import type { RootState } from '../store/store';

interface UseCardEditInterface {
  type: 'tasks'|'groups'|'workspaces';
  id?: string;
  data?: {
    subtaskOf?: string;
  }
}

export const useCardAdd = ({ type, id, data }: UseCardEditInterface) => {
  const [isEditing, setIsEditing] = useState(false);
  const [recordName, setRecordName] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const dispatch = useDispatch();
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);

  const handleClickAddNew = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isEditing && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    if (type === 'workspaces') dispatch(setCreatingNewWorkspace(true));
    setIsEditing(true);
  }

  const handleRecordNameChange = (value: string) => {
    setRecordName(value);
  }

  const handleCancel = () => {
    if (type === 'workspaces') dispatch(setCreatingNewWorkspace(false));
    setIsEditing(false);
    setRecordName('');
  }

  const handleCreateRecord = () => {
    if (recordName.length === 0) {
      setIsEditing(false);
      return null;
    }
    if (type === 'tasks' && id) {
      dispatch(
        createTask({
          name: recordName,
          owner: id,
          completed: isComplete,
          subtaskOf: data?.subtaskOf,
        })
      )
    } else if (type === 'groups' && id) {
      dispatch(
        createGroup({
          name: recordName,
          owner: id,
        })
      );
    } else if (type === 'workspaces') {
      dispatch(
        createWorkspace({
          name: recordName,
        })
      );
    }
    handleCancel();
  }

  const toggleComplete = () => {
    setIsComplete(prevState => !prevState);
  }

  return {
    isEditing,
    recordName,
    isComplete,
    isBoardEdited,
    setIsEditing,
    setRecordName,
    handleClickAddNew,
    handleRecordNameChange,
    handleCancel,
    handleCreateRecord,
    toggleComplete,
  }
}
