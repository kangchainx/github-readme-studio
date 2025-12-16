import React from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy 
} from '@dnd-kit/sortable';
import { useStore } from '../../store';
import { CanvasItem } from './CanvasItem';
import { generateMarkdown } from '../../lib/markdown';
import { marked } from 'marked'; // Use marked for robust parsing
import * as PhosphorIcons from '@phosphor-icons/react';
import { ComponentType } from '../../types';

const Canvas = () => {
  const { components, selectedId, reorderComponents, selectComponent, updateComponentProps, editorMode, githubUsername, showSeparators } = useStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const oldIndex = components.findIndex((c) => c.id === active.id);
    const newIndex = components.findIndex((c) => c.id === over.id);

    if (active.id !== over.id) {
       // Check for potential auto-layout logic (Side by side)
       const activeNodeRect = active.rect.current.translated;
       const overElement = document.getElementById(over.id as string);
       
       let triggerResize = false;
       let isLeft = false;

       if (activeNodeRect && overElement) {
         const overRect = overElement.getBoundingClientRect();
         const activeCenterX = activeNodeRect.left + activeNodeRect.width / 2;
         const overLeftLimit = overRect.left + overRect.width * 0.3;
         const overRightLimit = overRect.left + overRect.width * 0.7;

         if (activeCenterX < overLeftLimit) {
           triggerResize = true;
           isLeft = true;
         } else if (activeCenterX > overRightLimit) {
           triggerResize = true;
           isLeft = false; // Right
         }
       }

       if (triggerResize) {
          const activeComponent = components[oldIndex];
          const overComponent = components[newIndex];
          const activeWidthKey = activeComponent.type === ComponentType.IMAGE ? 'widthMode' : 'width';
          const overWidthKey = overComponent.type === ComponentType.IMAGE ? 'widthMode' : 'width';

          updateComponentProps(active.id as string, { [activeWidthKey]: 'half' });
          updateComponentProps(over.id as string, { [overWidthKey]: 'half' });

          let targetIndex = newIndex;
          if (isLeft) {
            if (oldIndex < newIndex) targetIndex = newIndex - 1;
            else targetIndex = newIndex;
          } else {
            if (oldIndex < newIndex) targetIndex = newIndex;
            else targetIndex = newIndex + 1;
          }
          reorderComponents(oldIndex, targetIndex);
       } else {
          reorderComponents(oldIndex, newIndex);
       }
    }
  };

  // 1. Preview Mode: Render Final Markdown Output using marked and github-markdown-css + tailwind prose
  if (editorMode === 'preview') {
    const markdown = generateMarkdown(components, githubUsername, showSeparators);
    // Parse markdown to HTML
    const htmlContent = marked.parse(markdown) as string;

    return (
      <div className="flex-1 bg-background overflow-y-auto p-8 flex justify-center custom-scrollbar">
        <div className="w-full max-w-4xl">
           <article 
             className="markdown-body prose prose-zinc dark:prose-invert max-w-none w-full !bg-transparent"
             dangerouslySetInnerHTML={{ __html: htmlContent }} 
           />
        </div>
      </div>
    );
  }

  // 2. Source Mode: Render Raw Markdown
  if (editorMode === 'source') {
    const markdown = generateMarkdown(components, githubUsername, showSeparators);
    return (
      <div className="flex-1 bg-zinc-950 p-6 overflow-hidden flex flex-col">
        <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-1 overflow-hidden shadow-inner">
           <textarea
             className="w-full h-full bg-transparent p-4 font-mono text-sm text-zinc-300 resize-none focus:outline-none custom-scrollbar"
             value={markdown}
             readOnly // Currently one-way binding from components -> markdown
             spellCheck={false}
           />
        </div>
        <p className="text-xs text-muted mt-2 text-center">
          This shows the generated Markdown based on your components. To edit structure, switch back to Builder mode.
        </p>
      </div>
    );
  }

  // 3. Builder Mode (Default): Low-Code, Drag and Drop, Visual
  return (
    <div 
      className="flex-1 bg-zinc-950/50 overflow-y-auto p-8 flex justify-center custom-scrollbar" 
      onClick={() => selectComponent(null)}
      style={{ backgroundImage: 'radial-gradient(#27272a 1px, transparent 1px)', backgroundSize: '20px 20px' }}
    >
      <div className="w-full max-w-3xl pb-20">
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-zinc-500">
            <PhosphorIcons.Ghost size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">It's quiet in here...</p>
            <p className="text-sm">Click a component on the left to get started.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={components.map((c) => c.id)} 
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-4 items-start">
                {components.map((component, index) => (
                  <CanvasItem 
                    key={component.id} 
                    component={component} 
                    isSelected={selectedId === component.id}
                    onSelect={selectComponent}
                    hasSeparator={showSeparators && index < components.length - 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default Canvas;