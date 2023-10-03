import './NewTask.scss';
import { CardEdit } from '../cardEdit';
import { AddNewButton } from '../addNewButton';
import { Plus } from '../../assets/icons';
import { useCardAdd } from '../../utils/useCardAdd';

interface NewTaskProps {
  id: string;
}

export const NewTask = ({ id }: NewTaskProps) => {
  const {
    isEditing,
    recordName,
    handleClickAddNew,
    handleRecordNameChange,
    handleCancel,
    handleCreateRecord,
  } = useCardAdd({ type: 'tasks', id });

  return (
    <div className='add-task'>
      {isEditing && (
        <div>
          <CardEdit
            value={recordName}
            placeholder='Title of the new card...'
            handleNameChange={handleRecordNameChange}
            handleEditEnd={handleCancel}
            handleEditCancel={handleCancel}
            withButtons={true}
            buttonText='Add card'
            buttonAction={handleCreateRecord}
          />
        </div>
      )}
      <AddNewButton
        handleClickAddNew={handleClickAddNew}
        text='Add a card'
        icon={<Plus />}
      />
    </div>
  );
}
