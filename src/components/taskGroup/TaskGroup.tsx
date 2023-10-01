import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './TaskGroup.scss';
import { deleteGroup, editGroupName } from '../../store/slices';
import { CardEdit } from '../cardEdit';
import { TaskCard } from '../taskCard';
import { NewTask } from '../newTask';
import { CardButtons } from '../cardButtons';
import type { RootState } from '../../store/store';
import type { TaskGroupInterface } from '../../store/types';

interface TaskGroupProps {
  group: TaskGroupInterface;
}

export const TaskGroup = ({ group }: TaskGroupProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(group.name);
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.board.tasks).filter(task => task.owner === group.id);
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);

  const handleGroupNameChange = (value: string) => {
    setGroupName(value);
  }

  const handleEditGroupButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isEditing && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    setIsEditing(true);
  }

  const handleEditGroup = () => {
    if (groupName.length === 0) {
      setIsEditing(false);
      setGroupName(group.name);
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
    <div className='task-group'>
      {isEditing ? (
        <CardEdit
          value={groupName}
          handleNameChange={handleGroupNameChange}
          handleEditEnd={handleEditGroup}
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
        </div>
      )}
      <div className='task-group__list'>
        {tasks?.length
          ? tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))
          : null}
        <NewTask id={group.id} />
      </div>
    </div>
  )
}
