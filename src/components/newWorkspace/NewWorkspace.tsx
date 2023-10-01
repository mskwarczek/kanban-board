import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './NewWorkspace.scss';
import { createWorkspace, setCreatingNewWorkspace } from '../../store/slices';
import { CardEdit } from '../cardEdit';
import { AddNewButton } from '../addNewButton';
import { WorkspaceIcon } from '../workspaceIcon';
import { Check, Plus } from '../../assets/icons';
import type { RootState } from '../../store/store';

export const NewWorkspace = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);
  const dispatch = useDispatch();

  const handleClickAddNew = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isAdding && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    dispatch(setCreatingNewWorkspace(true));
    setIsAdding(true);
  }

  const handleWorkspaceNameChange = (value: string) => {
    setWorkspaceName(value);
  }

  const handleCreateCancel = () => {
    dispatch(setCreatingNewWorkspace(false));
    setIsAdding(false);
    setWorkspaceName('');
  }

  const handleCreateWorkspace = () => {
    dispatch(
      createWorkspace({
        name: workspaceName,
      })
    );
    dispatch(setCreatingNewWorkspace(false));
    setIsAdding(false);
    setWorkspaceName('');
  }

  return (
    <div className='add-workspace'>
      {isAdding && (
        <CardEdit
          value={workspaceName}
          placeholder='Workspace name'
          handleNameChange={handleWorkspaceNameChange}
          handleEditEnd={handleCreateCancel}
          icon={<WorkspaceIcon
            name={workspaceName}
            classExtension='new-workspace'
          />}
          classExtension='new-workspace'
        />
      )}
      {!isAdding && (
        <AddNewButton
          handleClickAddNew={handleClickAddNew}
          text='Create workspace'
          icon={<Plus color='#001C39' />}
          classExtension='new-workspace'
        />
      )}
      {isAdding && workspaceName.length === 0 && (
        <AddNewButton
          handleClickAddNew={() => null}
          text='Save new workspace'
          icon={<Check />}
          classExtension='new-workspace new-workspace--adding'
          disabled={true}
        />
      )}
      {isAdding && workspaceName.length > 0 && (
        <AddNewButton
          handleClickAddNew={handleCreateWorkspace}
          text='Save new workspace'
          icon={<Check color='#FFFFFF' />}
          classExtension='new-workspace new-workspace--ready'
        />
      )}
    </div>
  )
}
