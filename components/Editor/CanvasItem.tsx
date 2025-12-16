import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ComponentInstance, ComponentType } from '../../types';
import { useStore } from '../../store';
import * as PhosphorIcons from '@phosphor-icons/react';
import { generateBadgeUrl } from '../../lib/markdown';

interface CanvasItemProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: (id: string) => void;
  hasSeparator?: boolean;
}

// Visual Renderer: Renders a "WYSIWYG-like" preview for the Builder Mode
const ComponentRenderer: React.FC<{ component: ComponentInstance }> = ({ component }) => {
  const { type, props } = component;
  const globalUsername = useStore((state) => state.githubUsername);

  switch (type) {
    case ComponentType.HEADER:
      return (
        <div className={`text-${props.align} p-4`}>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 justify-center">
            {props.title} 
          </h1>
          <p className="text-muted mt-2 text-lg">{props.subtitle}</p>
        </div>
      );
    
    case ComponentType.TEXT:
      return (
        <div className="p-4 text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {props.content}
        </div>
      );

    case ComponentType.TEXT_WITH_IMAGE:
      return (
        <div className={`flex flex-col md:flex-row gap-6 p-4 items-start ${props.imageAlign === 'left' ? 'md:flex-row-reverse' : ''}`}>
           <div className="flex-1 min-w-0">
             <h3 className="text-xl font-bold text-foreground mb-2">{props.heading}</h3>
             <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap break-words">{props.content}</p>
           </div>
           <div className="shrink-0">
             <img 
              src={props.imageSrc} 
              width={props.imageWidth} 
              alt="Visual"
              className="rounded-lg border border-border bg-background" 
             />
           </div>
        </div>
      );

    case ComponentType.STATS: {
      const targetUser = (props.useGlobalUsername && globalUsername) ? globalUsername : (props.username || 'github');
      
      if (!targetUser) {
        return (
          <div className="p-4 flex justify-center">
            <div className="w-full max-w-md h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted bg-surface/50">
               <PhosphorIcons.UserCircle size={32} className="mb-2 opacity-50" />
               <span className="text-sm">Please enter a GitHub username</span>
            </div>
          </div>
        );
      }

      const params = new URLSearchParams();
      if (props.variant === 'streak') {
         params.append('user', targetUser);
      } else {
         params.append('username', targetUser);
      }

      if (props.theme) params.append('theme', props.theme);
      if (props.hideBorder) params.append('hide_border', 'true');
      
      let baseUrl = 'https://github-readme-stats.vercel.app/api';
      
      if (props.variant === 'languages') {
         baseUrl = 'https://github-readme-stats.vercel.app/api/top-langs/';
         params.append('layout', 'compact');
      } else if (props.variant === 'streak') {
         baseUrl = 'https://github-readme-streak-stats.herokuapp.com/';
      } else {
         if (props.showIcons) params.append('show_icons', 'true');
         if (props.showRank) params.append('show_rank', 'true');
      }

      return (
        <div className="p-4 flex justify-center overflow-hidden">
           <img 
            src={`${baseUrl}?${params.toString()}`} 
            alt="Stats Preview" 
            className="rounded-lg max-w-full"
            loading="lazy"
           />
        </div>
      );
    }

    case ComponentType.TECH_STACK:
      return (
        <div className="p-4">
           <h3 className="text-xl font-bold text-foreground mb-3">Tech Stack</h3>
           <div className="flex flex-wrap gap-2">
              {(props.technologies || []).map((t: string) => {
                 const badgeUrl = generateBadgeUrl(t, props.style || 'for-the-badge');
                 return (
                   <img key={t} src={badgeUrl} alt={t} className="h-7" />
                 );
              })}
              {(props.technologies || []).length === 0 && (
                <span className="text-sm text-muted italic">Select technologies in the inspector...</span>
              )}
           </div>
        </div>
      );

    case ComponentType.SOCIALS:
      return (
        <div className="p-4 flex justify-center gap-2 flex-wrap">
           {(props.items || []).map((t: any, i: number) => (
              <div key={i} className="px-3 py-1.5 bg-surface rounded text-xs text-foreground border border-border flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                {t.platform}
              </div>
           ))}
        </div>
      );
    
    case ComponentType.IMAGE:
       return (
         <div className={`p-4 flex justify-${props.align === 'center' ? 'center' : 'start'}`}>
            <img 
              src={props.src} 
              alt={props.alt} 
              className="max-w-full rounded-md border border-border bg-background" 
              style={{ maxHeight: '200px', objectFit: 'cover' }}
            />
         </div>
       );

    case ComponentType.MARKDOWN:
       return (
         <div className="p-4 font-mono text-sm text-muted bg-surface/50 rounded border border-dashed border-border overflow-hidden">
            {props.markdown}
         </div>
       );

    default:
      return <div className="p-4 text-red-500">Unknown Component</div>;
  }
}

export const CanvasItem: React.FC<CanvasItemProps> = ({ component, isSelected, onSelect, hasSeparator }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  // Determine width
  const isImage = component.type === ComponentType.IMAGE;
  const widthProp = isImage ? component.props.widthMode : component.props.width;
  const isHalf = widthProp === 'half';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border-2 transition-all duration-200 bg-surface flex-shrink-0 flex flex-col
        ${isSelected ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/10' : 'border-transparent hover:border-surface-hover'}
        ${isHalf ? 'w-[calc(50%-0.5rem)]' : 'w-full'}
        ${hasSeparator ? 'mb-4' : 'mb-4'}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
    >
      {/* Drag Handle - Only visible on hover or selected */}
      <div 
        className={`absolute left-1/2 -top-3 -translate-x-1/2 p-1.5 rounded-md bg-surface-hover text-muted cursor-grab active:cursor-grabbing hover:text-foreground shadow-sm border border-border transition-opacity z-10 ${isSelected || 'opacity-0 group-hover:opacity-100'}`}
        {...attributes} 
        {...listeners}
      >
        <PhosphorIcons.DotsSixVertical size={16} weight="bold" />
      </div>

      {/* Content */}
      <div className="min-h-[60px]">
        <ComponentRenderer component={component} />
      </div>

      {/* Separator Visual (if enabled) */}
      {hasSeparator && !isDragging && (
        <div className="px-4 pb-2 w-full">
           <hr className="border-border border-dashed" />
        </div>
      )}

      {/* Type Badge */}
      <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-muted bg-surface border border-border pointer-events-none">
        {component.type}
      </div>

      {/* Width indicator (optional) */}
      {isHalf && (
        <div className="absolute left-2 top-2 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 pointer-events-none">
          1/2
        </div>
      )}
    </div>
  );
};
