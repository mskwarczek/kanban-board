import './TaskCheckbox.scss';
import { Check } from '../../assets/icons';

interface TaskCheckboxProps {
  checked: boolean;
  handleClick: () => void;
}

export const TaskCheckbox = ({ checked, handleClick }: TaskCheckboxProps) => {
  return (
    <div
      className={`task-checkbox ${checked ? 'task-checkbox--checked' : ''}`}
      onClick={handleClick}
    >
      {checked && <Check color='#FFFFFF' isSmall={true} />}
    </div>
  );
}
