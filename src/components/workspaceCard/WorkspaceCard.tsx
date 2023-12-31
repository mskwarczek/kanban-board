
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './WorkspaceCard.scss';
import {
  selectWorkspace,
  deleteWorkspace,
  editWorkspaceName,
} from '../../store/slices';
import { CardButtons } from '../cardButtons';
import { CardEdit } from '../cardEdit';
import { WorkspaceIcon } from '../workspaceIcon';
import { DraggableItem } from '../draggableItem';
import type { RootState } from '../../store/store';
import type { WorkspaceInterface } from '../../store/types';

interface WorkspaceCardProps {
  workspace: WorkspaceInterface;
  isActive: boolean;
}

export const WorkspaceCard = ({ workspace, isActive }: WorkspaceCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const dispatch = useDispatch();
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: workspace.id,
    data: {
      type: 'workspace',
      name: workspace.name,
    },
  }); 

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSelectWorkspace = () => {
    dispatch(selectWorkspace(workspace.id));
  }

  const handleWorkspaceNameChange = (value: string) => {
    setWorkspaceName(value);
  }

  const handleEditWorkspaceButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isEditing && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    setIsEditing(true);
  }

  const handleCancel = () => {
    setIsEditing(false);
    setWorkspaceName(workspace.name);
  }

  const handleEditWorkspace = () => {
    if (workspaceName.length === 0) {
      handleCancel();
      return null;
    }
    dispatch(
      editWorkspaceName({
        id: workspace.id,
        name: workspaceName,
      })
    );
    setIsEditing(false);
  }

  const handleDeleteWorkspace = () => {
    dispatch(deleteWorkspace(workspace.id));
  }

  if (isEditing) return (
    <CardEdit
      value={workspaceName}
      handleNameChange={handleWorkspaceNameChange}
      handleEditEnd={handleCancel}
      icon={<WorkspaceIcon name={workspaceName} classExtension='edit-workspace' />}
      classExtension='edit-workspace'
      handleEditCancel={handleCancel}
      withButtons={true}
      buttonText='Save changes'
      buttonAction={handleEditWorkspace}
    />
  )

  return (
    <DraggableItem
      ref={setNodeRef}
      id={workspace.id}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        className={`workspace-card ${isActive ? 'workspace-card--active' : ''}`}
        onClick={handleSelectWorkspace}
      >
        <WorkspaceIcon name={workspace.name} classExtension={isActive ? 'workspace-active' : ''} />
        <div className={`workspace-card__name ${isActive ? 'workspace-card__name--active' : ''}`}>
          {workspace.name}
        </div>
        <div className='workspace-card__buttons'>
          <CardButtons
            handleEditCardButton={handleEditWorkspaceButton}
            handleDeleteCardButton={handleDeleteWorkspace}
          />
        </div>
      </div>
    </DraggableItem>
  );
}
