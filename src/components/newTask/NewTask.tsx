import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './NewTask.scss';
import { createTask } from '../../store/slices';
import { CardEdit } from '../cardEdit';
import { AddNewButton } from '../addNewButton';
import type { RootState } from '../../store/store';

interface NewTaskProps {
  id: string;
}

export const NewTask = ({ id }: NewTaskProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [taskName, setTaskName] = useState('');
  const dispatch = useDispatch();
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);

  const handleClickAddNew = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isAdding && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    setIsAdding(true);
  }

  const handleTaskNameChange = (value: string) => {
    setTaskName(value);
  }

  const handleCreateTask = () => {
    if (taskName.length === 0) {
      setIsAdding(false);
      return null;
    }
    dispatch(
      createTask({
        name: taskName,
        owner: id,
      })
    )
    setIsAdding(false);
    setTaskName('');
  }

  return (
    <div className='add-task'>
      {isAdding && (
        <div>
          <CardEdit
            value={taskName}
            placeholder='Title of the new card...'
            handleNameChange={handleTaskNameChange}
            handleEditEnd={handleCreateTask}
          />
        </div>
      )}
      <AddNewButton
        handleClickAddNew={handleClickAddNew}
        text='Add a card'
      />
    </div>
  )
}
