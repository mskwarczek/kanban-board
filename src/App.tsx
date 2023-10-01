import { useSelector } from 'react-redux';

import './App.scss';
import { WorkspacesSidebar } from './components/workspacesSidebar';
import { Workspace } from './components/workspace';
import type { RootState } from './store/store';

export const App = () => {
  const {
    workspaces,
    selectedWorkspace,
    isCreatingNewWorkspace,
  } = useSelector((state: RootState) => state.board);

  return (
    <div className='container'>
      <WorkspacesSidebar
        workspaces={workspaces}
        selectedWorkspace={selectedWorkspace}
        isCreatingNewWorkspace={isCreatingNewWorkspace}
      />
      {selectedWorkspace && <Workspace id={selectedWorkspace} />}
    </div>
  )
}
