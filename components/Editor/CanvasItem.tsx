import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { ComponentInstance, ComponentType } from '../../types';
import { useStore } from '../../store';
import { UserCircleIcon } from '@phosphor-icons/react';
import { generateBadgeUrl } from '../../lib/markdown';
import { SOCIAL_PLATFORMS } from '../../constants';

interface CanvasItemProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: (id: string) => void;
  hasSeparator?: boolean;
}

// Visual Renderer: Renders a "WYSIWYG-like" preview for the Builder Mode
// Visual Renderer: Renders a "WYSIWYG-like" preview for the Builder Mode
// Wrapped in React.memo to prevent unnecessary re-renders during dragging
const ComponentRenderer = React.memo(({ component }: { component: ComponentInstance }) => {
  const { type, props } = component;
  const globalUsername = useStore((state) => state.githubUsername);

  switch (type) {
    case ComponentType.HEADING: {
      const level = props.level || 1;
      const Tag = (`h${level}`) as any;
      const alignClass = props.align === 'center' ? 'text-center' : props.align === 'right' ? 'text-right' : 'text-left';
      const sizes: Record<number, string> = {
        1: 'text-3xl font-extrabold tracking-tight',
        2: 'text-2xl font-bold tracking-tight',
        3: 'text-xl font-bold',
        4: 'text-lg font-bold',
        5: 'text-base font-bold',
        6: 'text-sm font-bold',
      };
      return (
        <div className={`p-4 ${alignClass}`}>
          <Tag className={`${sizes[level] || sizes[1]} text-foreground`}>{props.content}</Tag>
        </div>
      );
    }

    case ComponentType.HEADER: {
      const alignClass = props.align === 'center' ? 'text-center' : 'text-left';
      return (
        <div className={`p-4 ${alignClass}`}>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2 justify-center">
            {props.title} 
          </h1>
          <p className="text-muted mt-2 text-lg">{props.subtitle}</p>
        </div>
      );
    }
    
    case ComponentType.TEXT:
      return (
        <div className="p-4 text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {props.content}
        </div>
      );

    case ComponentType.LIST: {
      const ListTag = props.type === 'ordered' ? 'ol' : 'ul';
      const listClass = props.type === 'ordered' ? 'list-decimal ml-6' : 'list-disc ml-6';
      return (
        <div className="p-4">
          <ListTag className={`${listClass} text-foreground/90 space-y-1`}>
            {(props.items || []).map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ListTag>
        </div>
      );
    }

    case ComponentType.BREAKER: {
      return (
        <div className="p-4 flex items-center justify-center">
          {props.variant === 'line' ? (
            <hr className="w-full border-border" />
          ) : (
            <div className="h-8 w-full" />
          )}
        </div>
      );
    }


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

    case ComponentType.CORE_STATS:
    case ComponentType.STREAK_STATS:
    case ComponentType.REPO_CARD: {
      if (!globalUsername) {
        return (
          <div className="p-4 flex justify-center">
            <div className="w-full max-w-md h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted bg-surface/50">
               <UserCircleIcon size={32} className="mb-2 opacity-50" />
               <span className="text-sm font-medium text-foreground/80">Global Username Missing</span>
               <span className="text-[10px] opacity-60 mt-1">Set your username in the sidebar to enable stats.</span>
            </div>
          </div>
        );
      }

      const { theme, hideBorder, showIcons, showRank, repo } = props;
      const params = new URLSearchParams();
      let baseUrl = '';

      if (type === ComponentType.CORE_STATS) {
        baseUrl = 'https://github-readme-stats.vercel.app/api';
        params.append('username', globalUsername);
        if (showIcons) params.append('show_icons', 'true');
        if (showRank) params.append('show_rank', 'true');
      } else if (type === ComponentType.STREAK_STATS) {
        baseUrl = 'https://github-readme-streak-stats.herokuapp.com/';
        params.append('user', globalUsername);
      } else if (type === ComponentType.REPO_CARD) {
        baseUrl = 'https://github-readme-stats.vercel.app/api/pin/';
        params.append('username', globalUsername);
        params.append('repo', repo || 'github-readme-studio');
      }

      if (theme) params.append('theme', theme);
      if (hideBorder) params.append('hide_border', 'true');

      return (
        <div className="p-4 flex justify-center overflow-hidden">
           <img 
            src={`${baseUrl}?${params.toString()}`} 
            alt="GitHub Stats" 
            className="rounded-lg max-w-full"
            loading="lazy"
           />
        </div>
      );
    }

    case ComponentType.TECH_STACK:
      return (
        <div className="p-4">
           <h3 className="text-xl font-bold text-foreground mb-3 font-mono">Tech Stack</h3>
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
           {(props.items || []).map((item: any, i: number) => {
              if (!item.username) return null;
              const platformId = (item.platform || '').toLowerCase();
              const platformConfig = SOCIAL_PLATFORMS.find(p => p.id.toLowerCase() === platformId) || 
                                    { label: item.platform, color: '181717', logo: platformId };
              
              const badgeUrl = `https://img.shields.io/badge/-${encodeURIComponent(platformConfig.label)}-${platformConfig.color}?style=${props.style}&logo=${platformConfig.logo.toLowerCase()}&logoColor=white`;
              return (
                <img key={i} src={badgeUrl} alt={item.platform} className="h-7" />
              );
           })}
           {(props.items || []).every((i: any) => !i.username) && (
              <span className="text-sm text-muted italic">Add usernames in the inspector...</span>
           )}
        </div>
      );
    
    case ComponentType.IMAGE: {
       const alignClass = props.align === 'center'
         ? 'justify-center'
         : props.align === 'right'
           ? 'justify-end'
           : 'justify-start';
       return (
         <div className={`p-4 flex ${alignClass}`}>
            <img 
              src={props.src} 
              alt={props.alt} 
              className="max-w-full rounded-md border border-border bg-background" 
              style={{ maxHeight: '200px', objectFit: 'cover' }}
            />
         </div>
       );
    }

    case ComponentType.MARKDOWN:
       return (
         <div className="p-4 font-mono text-sm text-muted bg-surface/50 rounded border border-dashed border-border overflow-hidden">
            {props.markdown}
         </div>
       );

    case ComponentType.PROJECT_DEMO:
      return (
        <div className="p-4 flex flex-col items-center text-center gap-3">
          <h3 className="text-lg font-semibold text-foreground">{props.title || 'Project Demo'}</h3>
          <div className="w-full flex justify-center">
            {props.gifUrl ? (
              <img 
                src={props.gifUrl} 
                alt="Project Demo" 
                className="max-w-full rounded-md border border-border bg-background" 
                style={{ maxHeight: '260px', objectFit: 'contain' }}
              />
            ) : (
              <div className="w-full max-w-md h-40 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted bg-surface/50 text-sm">
                Paste a GIF URL to preview
              </div>
            )}
          </div>
        </div>
      );

    case ComponentType.BLOCKQUOTE:
      return (
        <div className="p-4">
          <blockquote className="border-l-4 border-primary/50 pl-4 py-1 text-muted italic">
            {props.content}
          </blockquote>
        </div>
      );

    case ComponentType.CODE_BLOCK:
      return (
        <div className="p-4">
          <div className="rounded-md overflow-hidden bg-[#0d1117] border border-border">
            {props.language && (
               <div className="px-3 py-1 text-xs text-muted bg-white/5 border-b border-border font-mono">
                 {props.language}
               </div>
            )}
            <pre className="p-3 text-sm font-mono text-gray-300 overflow-x-auto">
              <code>{props.code}</code>
            </pre>
          </div>
        </div>
      );

    case ComponentType.LINK:
      return (
        <div className="p-4">
           <a href={props.url} className="text-primary hover:underline font-medium" onClick={(e) => e.preventDefault()}>
             {props.label || props.url}
           </a>
        </div>
      );

    case ComponentType.IMAGE_LINK:
      return (
        <div className={`p-4 flex ${props.align === 'center' ? 'justify-center' : props.align === 'right' ? 'justify-end' : 'justify-start'}`}>
           <a href={props.url} className="block transition-opacity hover:opacity-80" onClick={(e) => e.preventDefault()}>
             <img src={props.src} alt={props.alt} className="max-w-full rounded-md border border-border" style={{ maxHeight: '200px' }} />
           </a>
        </div>
      );

    case ComponentType.TABLE:
      return (
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                {(props.headers || []).map((h: string, i: number) => (
                  <th key={i} className={`p-2 font-medium text-foreground ${(props.align || 'left') === 'center' ? 'text-center' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(props.rows || []).map((row: string[], i: number) => (
                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-surface/30">
                  {row.map((cell: string, j: number) => (
                     <td key={j} className={`p-2 text-foreground/80 ${(props.align || 'left') === 'center' ? 'text-center' : 'text-left'}`}>
                       {cell}
                     </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case ComponentType.DETAILS:
      return (
        <div className="p-4">
           <details className="group border border-border rounded-lg bg-surface/30 open:bg-surface/50 transition-colors">
             <summary className="cursor-pointer p-3 font-medium flex items-center gap-2 select-none group-open:border-b group-open:border-border">
               <span className="opacity-70 group-hover:opacity-100 transition-opacity">▶</span>
               {props.summary}
             </summary>
             <div className="p-3 text-sm text-foreground/80 whitespace-pre-wrap">
               {props.content}
             </div>
           </details>
        </div>
      );

    case ComponentType.BADGE: {
      const { label, message, color, style, logo, logoColor } = props;
      const url = `https://img.shields.io/badge/${encodeURIComponent(label || '')}-${encodeURIComponent(message || '')}-${color}?style=${style}&logo=${logo}&logoColor=${logoColor || 'white'}`;
      return (
        <div className="p-4 flex justify-center">
           <img src={url} alt={`${label} - ${message}`} className="h-7" />
        </div>
      );
    }

    case ComponentType.SVG:
      return (
        <div className="p-4 flex justify-center">
          <img 
            src={props.src} 
            alt={props.alt} 
            className="max-w-full rounded-md" 
            style={{ maxHeight: props.maxHeight || '300px' }} 
          />
        </div>
      );

    default:
      return <div className="p-4 text-red-500">Unknown Component</div>;

  }
});

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
    // Fixed: Use translate3d instead of CSS.Transform.toString to avoid "scale" distortion.
    // This ensures components don't look squashed when swapping slots of different sizes.
    transform: transform ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)` : undefined,
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.9 : 1,
    willChange: isDragging ? 'transform' : 'auto',
  };

  // Determine width
  const isImage = component.type === ComponentType.IMAGE;
  const widthProp = isImage ? component.props.widthMode : component.props.width;
  const isHalf = widthProp === 'half';

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-component-id={component.id}
      className={`group relative rounded-xl border-2 bg-surface flex-shrink-0 flex flex-col cursor-grab active:cursor-grabbing
        ${isSelected ? 'border-primary ring-1 ring-primary shadow-lg shadow-primary/10' : 'border-transparent hover:border-surface-hover'}
        ${isDragging ? 'shadow-2xl ring-4 ring-primary/20 border-primary scale-[1.01]' : 'transition-shadow duration-200'}
        ${isHalf ? 'w-[calc(50%-0.5rem)]' : 'w-full'}
        mb-4
      `}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(component.id);
      }}
    >
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

