import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDraggable } from '@dnd-kit/core';

import './TaskCard.scss';
import { deleteTask, editTaskName } from '../../store/slices';
import { CardButtons } from '../cardButtons';
import { CardEdit } from '../cardEdit';
import { DraggableItem } from '../draggableItem';
import type { RootState } from '../../store/store';
import type { TaskInterface } from '../../store/types';

interface TaskCardProps {
  task: TaskInterface;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState(task.name);
  const dispatch = useDispatch();
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);

  const {
    attributes,
    listeners,
    setNodeRef,
  } = useDraggable({
    id: task.id,
    data: {
      type: 'task',
      owner: task.owner,
      name: task.name,
    },
  });

  const handleTaskNameChange = (value: string) => {
    setTaskName(value);
  }

  const handleEditTaskButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isEditing && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    setIsEditing(true);
  }

  const handleCancel = () => {
    setIsEditing(false);
    setTaskName(task.name);
  }

  const handleEditTask = () => {
    if (taskName.length === 0) {
      handleCancel();
      return null;
    }
    dispatch(
      editTaskName({
        id: task.id,
        name: taskName,
      })
    )
    setIsEditing(false);
  }

  const handleDeleteTask = () => {
    dispatch(deleteTask(task.id));
  };

  if (isEditing) return (
    <CardEdit
      value={taskName}
      handleNameChange={handleTaskNameChange}
      handleEditEnd={handleCancel}
      handleEditCancel={handleCancel}
      withButtons={true}
      buttonText='Save changes'
      buttonAction={handleEditTask}
    />
  );

  return (
    <DraggableItem
      ref={setNodeRef}
      id={task.id}
      {...attributes}
      {...listeners}
    >
      <div className={`task-card ${task.subtaskOf ? 'task-card--subtask' : ''}`}>
        <div className='task-card__name'>
          {task.name}
        </div>
        <div className='task-card__buttons'>
          <CardButtons
            handleEditCardButton={handleEditTaskButton}
            handleDeleteCardButton={handleDeleteTask}
          />
        </div>
      </div>
    </DraggableItem>
  );
}
