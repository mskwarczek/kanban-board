import './CardButtons.scss';
import { Edit, Trash } from '../../assets/icons';

interface CardButtonsProps {
  handleEditCardButton: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDeleteCardButton: () => void;
}

export const CardButtons = ({ handleEditCardButton, handleDeleteCardButton }: CardButtonsProps) => {
  return (
    <div className='task-buttons'>
      <button className='task-buttons__button' onClick={handleEditCardButton}>
        <Edit />
      </button>
      <button className='task-buttons__button' onClick={handleDeleteCardButton}>
        <Trash />
      </button>
    </div>
  )
}
