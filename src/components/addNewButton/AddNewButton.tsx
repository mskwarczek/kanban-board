import './AddNewButton.scss';

interface AddNewButtonProps {
  text: string;
  handleClickAddNew: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  icon?: React.ReactNode;
  classExtension?: string;
  disabled?: boolean;
}

export const AddNewButton = ({
  text,
  handleClickAddNew,
  icon,
  classExtension = '',
  disabled = false,
}: AddNewButtonProps) => {
  return (
    <button
      className={`add-new-button ${classExtension}`}
      onClick={e => handleClickAddNew(e)}
      disabled={disabled}
    >
      <span>
        {icon ? icon : null}
      </span>
      <span>{text}</span>
    </button>
  )
}
