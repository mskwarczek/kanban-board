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
  pointerWithin,
  closestCorners,
  DragOverlay,
  CollisionDetection,
} from '@dnd-kit/core';

import './App.scss';
import { WorkspacesSidebar } from './components/workspacesSidebar';
import { Workspace } from './components/workspace';
import { DraggableItem } from './components/draggableItem';
import {
  editGroupPosition,
  editWorkspacePosition,
  selectWorkspace,
  moveTaskToDifferentGroup,
  moveTaskToDifferentWorkspace,
  moveGroupToDifferentWorkspace,
} from './store/slices';
import type { RootState } from './store/store';

export const App = () => {
  const [dragId, setDragId] = useState<string|number|null>(null);
  const [dragName, setDragName] = useState<string>('');
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
    const activeDragName = active.data.current?.name;
    setDragId(active.id);
    if (activeDragName) setDragName(activeDragName);
  }

  const handleDragCancel = () => {
    setDragId(null);
    setDragName('');
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeType = active.data.current?.type;
    const overType = over?.data.current?.type;

    if (activeType === 'task' && (overType === 'task' || overType === 'group')) {
      const overId = over?.id;
      if (!overId) return;

      const activeContainer = active.id;
      const overContainer = over.data.current?.sortable?.containerId || over.id;

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

    if ((activeType === 'task' || activeType === 'group') && overType === 'workspace') {
      if (over?.id) {
        dispatch(selectWorkspace(over.id.toString()));
        if (activeType === 'task') {
          dispatch(
            moveTaskToDifferentWorkspace({
              activeId: active.id.toString(),
              overWorkspace: over.id.toString(),
            })
          );
        }
        if (activeType === 'group') {
          dispatch(
            moveGroupToDifferentWorkspace({
              activeId: active.id.toString(),
              overWorkspace: over.id.toString(),
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
      } 
    }
    setDragId(null);
    setDragName('');
  }
  const collisionDetectionAlgorithm: CollisionDetection = ({
    ...args
  }) => {
    const activeType = args.active.data.current?.type;
    if (activeType === 'subtasks') return [];
    if (activeType === 'task') {
      const pointerCollisions = pointerWithin(args);
      const workspacePointerCollisions = pointerCollisions.filter(elem => elem.data?.droppableContainer.data.current?.type === 'workspace');
      if (workspacePointerCollisions.length > 0) return workspacePointerCollisions;
      const cornerCollisions = closestCorners(args);
      const groupCornerCollisions = cornerCollisions.filter(elem => elem.data?.droppableContainer.data.current?.type === 'group');
      if (groupCornerCollisions.length > 0) return groupCornerCollisions;
    }
    if (activeType === 'group') {
      const pointerCollisions = pointerWithin(args);
      if (pointerCollisions.length > 0) {
        const workspacePointerCollisions = pointerCollisions.filter(elem => elem.data?.droppableContainer.data.current?.type === 'workspace');
        if (workspacePointerCollisions.length > 0) return workspacePointerCollisions;
        const groupPointerCollisions = pointerCollisions.filter(elem => elem.data?.droppableContainer.data.current?.type === 'group');
        if (groupPointerCollisions.length > 0) return groupPointerCollisions;
      }
    }
    return closestCorners(args);
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
          {dragId ? <DraggableItem id={setDragId.toString()}><div className='draggable-item-overlay'>{dragName}</div></DraggableItem> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
