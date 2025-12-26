import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { ComponentInstance, ComponentType } from '../../types';
import { useStore } from '../../store';
import { UserCircleIcon } from '@phosphor-icons/react';
import { generateBadgeUrl } from '../../lib/markdown';
import { SOCIAL_PLATFORMS } from '../../constants';
import { marked } from 'marked';

interface CanvasItemProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: (id: string) => void;
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
          <Tag 
            className={`${sizes[level] || sizes[1]} text-foreground`}
            dangerouslySetInnerHTML={{ __html: marked.parseInline(props.content || '') }}
          />
        </div>
      );
    }

    case ComponentType.HEADER: {
      const alignClass = props.align === 'center' ? 'text-center' : 'text-left';
      return (
        <div className={`p-4 ${alignClass}`}>
          <h1 
            className="text-3xl font-bold text-foreground flex items-center gap-2 justify-center"
            dangerouslySetInnerHTML={{ __html: marked.parseInline(props.title || '') }}
          />
          <p 
            className="text-muted mt-2 text-lg"
            dangerouslySetInnerHTML={{ __html: marked.parseInline(props.subtitle || '') }}
          />
        </div>
      );
    }
    
    case ComponentType.TEXT:
      return (
        <div 
          className="p-4 text-foreground/90 whitespace-pre-wrap leading-relaxed prose prose-zinc dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: marked.parse(props.content || '') }}
        />
      );

    case ComponentType.LIST: {
      const ListTag = props.type === 'ordered' ? 'ol' : 'ul';
      const listClass = props.type === 'ordered' ? 'list-decimal ml-6' : 'list-disc ml-6';
      return (
        <div className="p-4">
          <ListTag className={`${listClass} text-foreground/90 space-y-1 prose prose-zinc dark:prose-invert max-w-none`}>
            {(props.items || []).map((item: string, i: number) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: marked.parseInline(item || '') }} />
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
             <h3 
               className="text-xl font-bold text-foreground mb-2"
               dangerouslySetInnerHTML={{ __html: marked.parseInline(props.heading || '') }}
             />
             <div 
               className="text-foreground/80 leading-relaxed whitespace-pre-wrap break-words prose prose-zinc dark:prose-invert max-w-none text-sm"
               dangerouslySetInnerHTML={{ __html: marked.parse(props.content || '') }}
             />
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
           {props.title && (
             <h3 className="text-xl font-bold text-foreground mb-3 font-mono">
               {props.titleIcon && <span className="mr-2">{props.titleIcon}</span>}
               {props.title}
             </h3>
           )}
           <div className="flex flex-wrap gap-2 justify-center">
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
        <div className="p-4">
           {props.title && (
             <h3 className="text-xl font-bold text-foreground mb-3 font-mono">
               {props.titleIcon && <span className="mr-2">{props.titleIcon}</span>}
               {props.title}
             </h3>
           )}
           <div className="flex justify-center gap-2 flex-wrap">
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

    case ComponentType.PROJECT_DEMO: {
      // Backward compatibility hook
      const projects = props.projects || (props.gifUrl ? [{ title: props.title, image: props.gifUrl, link: '' }] : []);
      const gridCols = projects.length > 1 ? 'grid-cols-2' : 'grid-cols-1';

      return (
        <div className="p-4 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-foreground text-left">
             {props.titleIcon && <span className="mr-2">{props.titleIcon}</span>}
             {props.title || 'Project Showcase'}
          </h3>
          <div className={`grid ${gridCols} gap-4 w-full`}>
            {projects.length > 0 ? (
              projects.map((proj: any, i: number) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="rounded-md border border-border bg-background overflow-hidden">
                     <img 
                       src={proj.image} 
                       alt={proj.title} 
                       className="w-full h-auto object-cover" 
                       style={{ maxHeight: '200px' }}
                     />
                  </div>
                  {proj.title && <div className="text-center text-sm font-medium">{proj.title}</div>}
                </div>
              ))
            ) : (
               <div className="w-full col-span-full h-40 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-muted bg-surface/50 text-sm">
                 Add projects in the inspector
               </div>
            )}
          </div>
        </div>
      );
    }



    case ComponentType.ABOUT_ME: {
      return (
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
             <h3 className="text-xl font-bold text-foreground font-mono">
               {props.titleIcon && <span className="mr-2">{props.titleIcon}</span>}
               {props.title || 'About Me'}
             </h3>
          </div>
          <div className={`flex gap-6 ${props.imageAlign === 'left' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
             <div className="flex-1 text-sm text-foreground/90 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                <ComponentRenderer component={{ ...props, type: ComponentType.MARKDOWN, props: { markdown: props.content, type: ComponentType.MARKDOWN } }} />
             </div>
             {props.showImage !== false && props.imageSrc && (
               <div className="shrink-0 rounded-lg overflow-hidden border border-border bg-surface/50 shadow-sm" style={{ width: `${props.imageWidth || 300}px` }}>
                 <img src={props.imageSrc} alt="About Me" className="w-full h-auto" />
               </div>
             )}
          </div>
        </div>
      );
    }

    case ComponentType.BLOCKQUOTE:
      return (
        <div className="p-4">
          <blockquote 
            className="border-l-4 border-primary/50 pl-4 py-1 text-muted italic prose prose-zinc dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: marked.parse(props.content || '') }}
          />
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
               <span dangerouslySetInnerHTML={{ __html: marked.parseInline(props.summary || '') }} />
             </summary>
             <div 
               className="p-3 text-sm text-foreground/80 whitespace-pre-wrap prose prose-zinc dark:prose-invert max-w-none"
               dangerouslySetInnerHTML={{ __html: marked.parse(props.content || '') }}
             />
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

export const CanvasItem: React.FC<CanvasItemProps> = ({ component, isSelected, onSelect }) => {
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

