import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      owner: task.owner,
    },
  }); 

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTaskNameChange = (value: string) => {
    setTaskName(value);
  }

  const handleEditTaskButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isEditing && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    setIsEditing(true);
  }

  const handleEditTask = () => {
    if (taskName.length === 0) {
      setIsEditing(false);
      setTaskName(task.name);
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
      handleEditEnd={handleEditTask}
    />
  );

  return (
    <DraggableItem
    ref={setNodeRef}
    id={task.id}
    style={style}
    {...attributes}
    {...listeners}
  >
    <div className='task-card'>
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
