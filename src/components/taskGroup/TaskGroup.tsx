import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDroppable } from '@dnd-kit/core';
import {
  useSortable,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './TaskGroup.scss';
import { deleteGroup, editGroupName } from '../../store/slices';
import { CardEdit } from '../cardEdit';
import { TaskCard } from '../taskCard';
import { NewTask } from '../newTask';
import { CardButtons } from '../cardButtons';
import { DraggableItem } from '../draggableItem';
import type { RootState } from '../../store/store';
import type { TaskGroupInterface } from '../../store/types';

interface TaskGroupProps {
  group: TaskGroupInterface;
}

export const TaskGroup = ({ group }: TaskGroupProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(group.name);
  const dispatch = useDispatch();
  const tasksCounted = useSelector((state: RootState) => state.board.tasks).filter(task => task.owner === group.id);
  const tasks = tasksCounted.filter(task => !task.subtaskOf);
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: group.id,
    data: {
      type: 'group',
      owner: group.owner,
      name: group.name,
    },
  });

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: group.id,
    data: {
      type: 'group',
      owner: group.owner,
      name: group.name,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleGroupNameChange = (value: string) => {
    setGroupName(value);
  }

  const handleEditGroupButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isEditing && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    setIsEditing(true);
  }

  const handleCancel = () => {
    setIsEditing(false);
    setGroupName(group.name);
  }

  const handleEditGroup = () => {
    if (groupName.length === 0) {
      handleCancel();
      return null;
    }
    dispatch(
      editGroupName({
        id: group.id,
        name: groupName,
      })
    );
    setIsEditing(false);
  }

  const handleDeleteGroup = () => {
    dispatch(deleteGroup(group.id));
  }

  return (
    <div
      ref={setDroppableNodeRef}
      className='task-group-container'
    >
      <DraggableItem
        ref={setNodeRef}
        id={group.id}
        className='task-group'
        style={style}
        {...attributes}
        {...listeners}
      >
        {isEditing ? (
          <CardEdit
            value={groupName}
            handleNameChange={handleGroupNameChange}
            handleEditEnd={handleCancel}
            handleEditCancel={handleCancel}
            withButtons={true}
            buttonText='Save changes'
            buttonAction={handleEditGroup}
          />
        ) : (
          <div className='task-group__name'>
            <h4>{group.name}</h4>
            <div className='task-group__buttons'>
              <CardButtons
                handleEditCardButton={handleEditGroupButton}
                handleDeleteCardButton={handleDeleteGroup}
              />
            </div>
            <div className='tasks-completion-count'>
              {tasksCounted.filter(task => task.completed).length}/{tasksCounted.length}
            </div>
          </div>
        )}
        <div className='task-group__list'>
          <SortableContext 
            id={`sortable-context-tasks--${group.id}`}
            items={tasks.map((i) => i?.id)}
            strategy={rectSortingStrategy}
          >
          {tasks?.length
            ? tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
              />
            ))
            : null}
          </SortableContext>
          <NewTask id={group.id} />
        </div>
      </DraggableItem>
    </div>
  );
}
