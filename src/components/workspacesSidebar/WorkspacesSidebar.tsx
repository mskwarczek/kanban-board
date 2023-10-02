import {  
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import './WorkspacesSidebar.scss';
import { UserProfile } from '../userProfile';
import { WorkspaceSettings } from '../workspaceSettings';
import { WorkspaceCard } from '../workspaceCard';
import { NewWorkspace } from '../newWorkspace';
import type { WorkspaceInterface } from '../../store/types';

interface WorkspacesSidebarProps {
  workspaces: WorkspaceInterface[];
  isCreatingNewWorkspace: boolean;
  selectedWorkspace?: string;
}

export const WorkspacesSidebar = ({
  workspaces,
  selectedWorkspace,
  isCreatingNewWorkspace,
}: WorkspacesSidebarProps) => {
  return (
    <div className='workspaces'>
      <div className='workspaces-header'>
        <SortableContext 
          id={'sortable-context-workspaces'}
          items={workspaces.map((i) => i?.id)}
          strategy={verticalListSortingStrategy}
        >
          {workspaces?.length
            ? workspaces.map(workspace => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                isActive={!isCreatingNewWorkspace && (workspace.id === selectedWorkspace)}
              />
            ))
            : null}
        </SortableContext>
        <NewWorkspace />
      </div>
      <div className='workspaces-main'></div>
      <div className='workspaces-footer'>
        <UserProfile />
        <WorkspaceSettings/>
      </div>
    </div>
  );
}
