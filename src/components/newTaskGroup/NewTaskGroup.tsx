import './NewTaskGroup.scss';
import { CardEdit } from '../cardEdit';
import { AddNewButton } from '../addNewButton';
import { Plus } from '../../assets/icons';
import { useCardAdd } from '../../utils/useCardAdd';

interface NewTaskGroupProps {
  id: string;
}

export const NewTaskGroup = ({ id }: NewTaskGroupProps) => {
  const {
    isEditing,
    recordName,
    handleClickAddNew,
    handleRecordNameChange,
    handleCancel,
    handleCreateRecord,
  } = useCardAdd({ type: 'groups', id });
  return (
    <div className='add-group'>
      {isEditing && (
        <CardEdit
          value={recordName}
          placeholder='Title of the new list...'
          handleNameChange={handleRecordNameChange}
          handleEditEnd={handleCancel}
          classExtension='new-group'
          handleEditCancel={handleCancel}
          withButtons={true}
          buttonText='Add list'
          buttonAction={handleCreateRecord}
        />
      )}
      {!isEditing && (
        <AddNewButton
          handleClickAddNew={handleClickAddNew}
          text='Add another list'
          icon={<Plus />}
        />
      )}
    </div>
  );
}
