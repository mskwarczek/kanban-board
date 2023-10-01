import { useSelector } from 'react-redux';

import './Workspace.scss';
import { TaskGroup } from '../taskGroup';
import { NewTaskGroup } from '../newTaskGroup';
import type { RootState } from '../../store/store';

interface WorkspaceProps {
  id: string;
}

export const Workspace = ({ id }: WorkspaceProps) => {
  const groups = useSelector((state: RootState) => state.board.groups).filter(group => group.owner === id);

  return (
    <div className='workspace'>
      {groups?.length
        ? groups.map(group => (
          <TaskGroup
            key={group.id}
            group={group}
          />
        ))
        : null}
      <NewTaskGroup id={id} />
    </div>
  )
}
