import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  rectIntersection,
  pointerWithin,
  DragOverlay,
  CollisionDetection,
} from '@dnd-kit/core';

import './App.scss';
import { WorkspacesSidebar } from './components/workspacesSidebar';
import { Workspace } from './components/workspace';
import { DraggableItem } from './components/draggableItem';
import { editTaskPosition, editGroupPosition, editWorkspacePosition, moveTaskToDifferentGroup } from './store/slices';
import type { RootState } from './store/store';

export const App = () => {
  const [activeId, setActiveId] = useState<string|number|null>(null);
  const {
    workspaces,
    selectedWorkspace,
    isCreatingNewWorkspace,
  } = useSelector((state: RootState) => state.board);
  const dispatch = useDispatch();

  const dndSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,
      },
    }),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  }

  const handleDragCancel = () => setActiveId(null);

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeType = active.data.current?.type;
    const overType = over?.data.current?.type;

    if (activeType === 'task' && (overType === 'task' || overType === 'group')) {
      const overId = over?.id;
      if (!overId) return;

      const activeContainer = active.data.current?.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId || over.id;
      
      if (activeContainer !== overContainer) {
        const overGroup = overType === 'group'
          ? over.id
          : overType === 'task'
          ? over.data.current?.owner
          : undefined;

        if (active.id && overGroup) {
          dispatch(
            moveTaskToDifferentGroup({
              activeId: active.id.toString(),
              overGroup: overGroup,
            })
          );
        }
      }
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      if (active.data.current?.type === 'workspace') {
        dispatch(
          editWorkspacePosition({
            activeId: active.id.toString(),
            overId: over.id.toString(),
          })
        );
      } else if (active.data.current?.type === 'group') {
        const overId = over.data.current?.type === 'group'
          ? over.id
          : over.data.current?.type === 'task'
          ? over.data.current?.owner
          : undefined;
        if (overId) {
          dispatch(
            editGroupPosition({
              activeId: active.id.toString(),
              overId,
            })
          );
        }
      } else if (active.data.current?.type === 'task') {
        dispatch(
          editTaskPosition({
            activeId: active.id.toString(),
            overId: over.id.toString(),
          })
        );
      }
    }
    setActiveId(null);
  }
  const collisionDetectionAlgorithm: CollisionDetection = ({
    ...args
  }) => {
    const activeType = args.active.data.current?.type;
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      if (activeType === 'group') {
        return pointerCollisions.filter(elem => elem.data?.droppableContainer.data.current?.type === 'group');
      }
      return pointerCollisions;
    }
    return rectIntersection(args);
  }

  return (
    <DndContext
        id='dnd-context'
        sensors={dndSensors}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={collisionDetectionAlgorithm}
      >
      <div className='container'>
        <WorkspacesSidebar
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          isCreatingNewWorkspace={isCreatingNewWorkspace}
        />
        {selectedWorkspace && <Workspace id={selectedWorkspace} />}
        <DragOverlay>
          {activeId ? <DraggableItem id={activeId.toString()}/> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
