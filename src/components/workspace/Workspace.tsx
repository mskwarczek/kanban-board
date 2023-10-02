import { useSelector } from 'react-redux';
import {  
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

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
      <SortableContext 
        id={'sortable-context-groups'}
        items={groups.map((i) => i?.id)}
        strategy={horizontalListSortingStrategy}
      >
        {groups?.length
          ? groups.map(group => (
            <TaskGroup
              key={group.id}
              group={group}
            />
          ))
          : null}
        </SortableContext>
      <NewTaskGroup id={id} />
    </div>
  );
}
