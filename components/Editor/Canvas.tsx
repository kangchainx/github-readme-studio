import { 
  SortableContext, 
  rectSortingStrategy 
} from '@dnd-kit/sortable';
import { useStore } from '../../store';
import { CanvasItem } from './CanvasItem';
import { generateMarkdown } from '../../lib/markdown';
import { marked } from 'marked'; // Use marked for robust parsing
import { GhostIcon } from '@phosphor-icons/react';

const Canvas = () => {
  const { components, selectedId, selectComponent, editorMode, githubUsername, themeMode } = useStore();

  // handleDragEnd moved to App.tsx

  // 1. Preview Mode: Render Final Markdown Output using marked and github-markdown-css + tailwind prose
  if (editorMode === 'preview') {
    const markdown = generateMarkdown(components, githubUsername);
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
    const markdown = generateMarkdown(components, githubUsername);
    return (
      <div className="flex-1 bg-background p-6 overflow-hidden flex flex-col">
        <div className="flex-1 rounded-lg border border-border bg-surface/50 p-1 overflow-hidden shadow-inner">
           <textarea
             className="w-full h-full bg-transparent p-4 font-mono text-sm text-foreground resize-none focus:outline-none custom-scrollbar"
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
  const isLight = themeMode === 'light';
  const canvasBackground = isLight
    ? 'radial-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px)'
    : 'radial-gradient(#27272a 1px, transparent 1px)';

  return (
    <div 
      className={`flex-1 overflow-y-auto p-8 flex custom-scrollbar bg-background transition-all duration-300 ${components.length === 0 ? 'items-center justify-center' : 'justify-center'}`}
      onClick={() => selectComponent(null)}
      style={{ backgroundImage: canvasBackground, backgroundSize: '20px 20px' }}
    >
      <div className={`w-full max-w-3xl ${components.length === 0 ? 'h-full flex items-center justify-center' : 'pb-20'}`}>
        {components.length === 0 ? (
          <div className="w-full max-w-md flex flex-col items-center justify-center aspect-[4/3] border-2 border-dashed border-border rounded-3xl bg-surface/30 text-muted animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-surface p-4 rounded-2xl shadow-xl mb-6 ring-1 ring-border">
              <GhostIcon size={48} className="opacity-50" weight="duotone" />
            </div>
            <p className="text-xl font-semibold text-foreground mb-1">It's quiet in here...</p>
            <p className="text-sm opacity-60">Click a component on the left to get started.</p>
          </div>
        ) : (
          <SortableContext 
            items={components.map((c) => c.id)} 
            strategy={rectSortingStrategy}
          >
            <div className="flex flex-wrap gap-4 items-start">
              {components.map((component) => (
                <CanvasItem 
                  key={component.id} 
                  component={component} 
                  isSelected={selectedId === component.id}
                  onSelect={selectComponent}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};

export default Canvas;
