import { useEffect } from 'react';

import './NewTask.scss';
import { CardEdit } from '../cardEdit';
import { AddNewButton } from '../addNewButton';
import { Plus } from '../../assets/icons';
import { useCardAdd } from '../../utils/useCardAdd';

interface NewTaskProps {
  id: string;
  subtaskOf?: string;
  activeateOnInit?: boolean
}

export const NewTask = ({
  id,
  subtaskOf,
  activeateOnInit,
}: NewTaskProps) => {
  const {
    isEditing,
    recordName,
    isComplete,
    setIsEditing,
    handleClickAddNew,
    handleRecordNameChange,
    handleCancel,
    handleCreateRecord,
    toggleComplete,
  } = useCardAdd({
    type: 'tasks',
    id,
    data: { subtaskOf }
  });

  useEffect(() => {
    if (activeateOnInit && !isEditing) {
      setIsEditing(true);
    }
  }, [activeateOnInit, isEditing, setIsEditing]);

  return (
    <div className='add-task'>
      {isEditing && (
        <div>
          <CardEdit
            value={recordName}
            placeholder={subtaskOf ? 'New subtask' : 'Title of the new card...'}
            handleNameChange={handleRecordNameChange}
            handleEditEnd={handleCancel}
            handleEditCancel={handleCancel}
            withButtons={true}
            buttonText={subtaskOf ? 'Add subtask' :'Add card'}
            buttonAction={handleCreateRecord}
            withCheckbox={true}
            checkboxStatus={isComplete}
            handleCheckboxClick={toggleComplete}
          />
        </div>
      )}
      <AddNewButton
        handleClickAddNew={handleClickAddNew}
        text={subtaskOf ? 'Add a subtask' : 'Add a card'}
        icon={<Plus />}
      />
    </div>
  );
}
