import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDraggable } from '@dnd-kit/core';

import './TaskCard.scss';
import { deleteTask, editTaskName, toggleTaskComplete } from '../../store/slices';
import { CardButtons } from '../cardButtons';
import { CardEdit } from '../cardEdit';
import { DraggableItem } from '../draggableItem';
import { TaskCheckbox } from '../taskCheckbox';
import { NewTask } from '../newTask';
import { ArrowDown, ArrowRight } from '../../assets/icons';
import type { RootState } from '../../store/store';
import type { TaskInterface } from '../../store/types';

interface TaskCardProps {
  task: TaskInterface;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState(task.name);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const dispatch = useDispatch();
  const subtasks = useSelector((state: RootState) => state.board.tasks).filter(t => t.subtaskOf === task.id);
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
  }

  const toggleComplete = () => {
    dispatch(toggleTaskComplete(task.id));
  }

  const toggleSubtasks = () => {
    setShowSubtasks(prevState => !prevState)
  }

  if (isEditing) return (
    <CardEdit
      value={taskName}
      handleNameChange={handleTaskNameChange}
      handleEditEnd={handleCancel}
      handleEditCancel={handleCancel}
      withButtons={true}
      buttonText='Save changes'
      buttonAction={handleEditTask}
      withCheckbox={true}
      checkboxStatus={task.completed}
      handleCheckboxClick={toggleComplete}
    />
  );

  return (
    <DraggableItem
      ref={setNodeRef}
      id={task.id}
      {...attributes}
      {...listeners}
    >
      <div className={`task-card ${task.subtaskOf ? 'task-card--subtask' : ''} ${showSubtasks || subtasks.length ? 'task-card--with-subtasks' : ''}`}>
        <div className='task-card__name'>
          {!task.subtaskOf && (
            <div
              className={`task-card__subtasks-arrow ${showSubtasks || subtasks.length ? 'task-card__subtasks-arrow--show' : ''}`}
              onClick={toggleSubtasks}
            >
              {showSubtasks
                ? <ArrowDown />
                : <ArrowRight />}
            </div>
          )}
          <TaskCheckbox
            checked={task.completed}
            handleClick={toggleComplete}
          />
          {task.name}
          {subtasks.length > 0 && <div className='tasks-completion-count'>
              {subtasks.filter(task => task.completed).length}/{subtasks.length}
          </div>}
        </div>
        <div className='task-card__buttons'>
          <CardButtons
            handleEditCardButton={handleEditTaskButton}
            handleDeleteCardButton={handleDeleteTask}
          />
        </div>
      </div>
      {showSubtasks && <div className='task-subtasks'>
        {subtasks.length
          ? subtasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))
          : null}
        <NewTask
          id={task.owner}
          subtaskOf={task.id}
          activeateOnInit={subtasks.length === 0}
        />
      </div>}
    </DraggableItem>
  );
}
