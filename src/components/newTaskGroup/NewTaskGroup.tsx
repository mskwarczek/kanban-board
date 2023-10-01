import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './NewTaskGroup.scss';
import { createGroup } from '../../store/slices';
import { CardEdit } from '../cardEdit';
import { AddNewButton } from '../addNewButton';
import type { RootState } from '../../store/store';

interface NewTaskGroupProps {
  id: string;
}

export const NewTaskGroup = ({ id }: NewTaskGroupProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [groupName, setGroupName] = useState('');
  const dispatch = useDispatch();
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);

  const handleClickAddNew = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!isAdding && !isBoardEdited) e.nativeEvent.stopImmediatePropagation();
    setIsAdding(true);
  }

  const handleGroupNameChange = (value: string) => {
    setGroupName(value);
  }

  const handleCreateGroup = () => {
    if (groupName.length === 0) {
      setIsAdding(false);
      return null;
    }
    dispatch(
      createGroup({
        name: groupName,
        owner: id,
      })
    );
    setIsAdding(false);
    setGroupName('');
  }

  return (
    <div className='add-group'>
      {isAdding && (
        <CardEdit
          value={groupName}
          placeholder='Title of the new list...'
          handleNameChange={handleGroupNameChange}
          handleEditEnd={handleCreateGroup}
          classExtension='new-group'
        />
      )}
      {!isAdding && (
        <AddNewButton
          handleClickAddNew={handleClickAddNew}
          text='Add another list'
        />
      )}
    </div>
  )
}
