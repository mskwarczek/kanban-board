import './NewWorkspace.scss';
import { CardEdit } from '../cardEdit';
import { AddNewButton } from '../addNewButton';
import { WorkspaceIcon } from '../workspaceIcon';
import { Check, Plus } from '../../assets/icons';
import { useCardAdd } from '../../utils/useCardAdd';

export const NewWorkspace = () => {
  const {
    isEditing,
    recordName,
    handleClickAddNew,
    handleRecordNameChange,
    handleCancel,
    handleCreateRecord,
  } = useCardAdd({ type: 'workspaces' });

  return (
    <div className='add-workspace'>
      {isEditing && (
        <CardEdit
          value={recordName}
          placeholder='Workspace name'
          handleNameChange={handleRecordNameChange}
          handleEditEnd={handleCancel}
          icon={<WorkspaceIcon
            name={recordName}
            classExtension='new-workspace'
          />}
          classExtension='new-workspace'
        />
      )}
      {!isEditing && (
        <AddNewButton
          handleClickAddNew={handleClickAddNew}
          text='Create workspace'
          icon={<Plus color='#001C39' />}
          classExtension='new-workspace'
        />
      )}
      {isEditing && recordName.length === 0 && (
        <AddNewButton
          handleClickAddNew={() => null}
          text='Save new workspace'
          icon={<Check />}
          classExtension='new-workspace new-workspace--adding'
          disabled={true}
        />
      )}
      {isEditing && recordName.length > 0 && (
        <AddNewButton
          handleClickAddNew={handleCreateRecord}
          text='Save new workspace'
          icon={<Check color='#FFFFFF' />}
          classExtension='new-workspace new-workspace--ready'
        />
      )}
    </div>
  );
}
