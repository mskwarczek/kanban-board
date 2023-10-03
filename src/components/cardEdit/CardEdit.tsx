import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './CardEdit.scss';
import { AddNewButton } from '../addNewButton';
import { Close } from '../../assets/icons';
import { setEditing } from '../../store/slices';
import type { RootState } from '../../store/store';

interface CardEditProps {
  value: string;
  handleNameChange: (value: string) => void;
  handleEditEnd: () => void;
  handleEditCancel?: () => void;
  withButtons?: boolean;
  buttonText?: string;
  buttonAction?: () => void;
  placeholder?: string;
  icon?: React.ReactNode;
  classExtension?: string;
}

export const CardEdit = ({
  value,
  handleNameChange,
  handleEditEnd,
  handleEditCancel,
  withButtons,
  buttonText,
  buttonAction,
  placeholder,
  icon,
  classExtension = '',
}: CardEditProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isBoardEdited = useSelector((state: RootState) => state.board.isEdited);
  const dispatch = useDispatch();

  const handleClick = useCallback((e: MouseEvent) => {
    if (ref.current && e.target instanceof Element && !ref.current.contains(e.target)) {
      handleEditEnd();
    }
  }, [handleEditEnd]);
  
  useEffect(() => {
    document.addEventListener('click', handleClick);
    if (!isBoardEdited) dispatch(setEditing(true));
    return () => {
      document.removeEventListener('click', handleClick);
      if (isBoardEdited) dispatch(setEditing(false));
    };
  }, [handleClick, dispatch, isBoardEdited]);

  if (!withButtons) return (
    <div className={`card-edit ${classExtension}`} ref={ref}>
      {icon ? icon : false}
      <input
        className={`card-edit__input ${classExtension}`}
        value={value}
        placeholder={placeholder}
        onChange={e => handleNameChange(e.currentTarget.value)}
        autoFocus
      />
    </div>
  )

  return (
    <div className={`card-edit card-edit--with-buttons ${classExtension}`} ref={ref}>
      <div className='card-edit__input-wrapper'>
        {icon ? icon : false}
        <input
          className={`card-edit__input ${classExtension}`}
          value={value}
          placeholder={placeholder}
          onChange={e => handleNameChange(e.currentTarget.value)}
          autoFocus
        />
      </div>
      <div className={'card-edit--with-buttons__buttons'}>
        {value.length === 0 ? (
          <AddNewButton
            handleClickAddNew={() => null}
            text={buttonText || ''}
            classExtension='card-edit-button'
            disabled={true}
          />
          ) : (
          <AddNewButton
            handleClickAddNew={buttonAction ? buttonAction : () => null}
            text={buttonText || ''}
            classExtension='card-edit-button card-edit-button--ready'
          />
        )}
        <button className='' onClick={handleEditCancel}><Close /></button>
      </div>
    </div>
  )
}
