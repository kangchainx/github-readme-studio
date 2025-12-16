import React, { useState } from 'react';
import { useStore } from '../../store';
import { ComponentType } from '../../types';
import { Button, Input, Label, Textarea, Select } from '../ui/UIComponents';
import * as PhosphorIcons from '@phosphor-icons/react';
import { BADGE_STYLES, GITHUB_THEMES } from '../../constants';
import { TECH_CATEGORIES, ALL_TECHS } from '../../data/techStack';
import { generateBadgeUrl } from '../../lib/markdown';

const Inspector = () => {
  const { components, selectedId, updateComponentProps, removeComponent, githubUsername } = useStore();
  const [techSearch, setTechSearch] = useState('');
  
  const selectedComponent = components.find(c => c.id === selectedId);

  if (!selectedComponent) {
    return (
      <div className="w-80 border-l border-border bg-background flex flex-col items-center justify-center text-muted p-6 text-center">
        <PhosphorIcons.CursorClick size={32} className="mb-3 opacity-50" />
        <p className="text-sm">Select a component on the canvas to edit its properties.</p>
      </div>
    );
  }

  const { props, type } = selectedComponent;

  const handleChange = (key: string, value: any) => {
    updateComponentProps(selectedComponent.id, { [key]: value });
  };

  const toggleTech = (tech: string) => {
    const current = props.technologies || [];
    if (current.includes(tech)) {
      handleChange('technologies', current.filter((t: string) => t !== tech));
    } else {
      handleChange('technologies', [...current, tech]);
    }
  };

  const getStatsUrl = (variant: string, theme: string, user: string) => {
     if (variant === 'streak') {
       return `https://github-readme-streak-stats.herokuapp.com/?user=${user}&theme=${theme}&hide_border=true`;
     } else if (variant === 'languages') {
       return `https://github-readme-stats.vercel.app/api/top-langs/?username=${user}&theme=${theme}&hide_border=true&layout=compact`;
     }
     return `https://github-readme-stats.vercel.app/api?username=${user}&theme=${theme}&hide_border=true&hide_rank=true&hide_title=true`;
  }

  // Common Width Selector
  const renderWidthSelector = (key = 'width') => (
    <div className="space-y-2 mb-4 pt-4 border-t border-border">
      <Label>Layout Width</Label>
      <div className="flex bg-surface rounded-md p-1 border border-border">
        <button
          onClick={() => handleChange(key, 'full')}
          className={`flex-1 text-xs py-1.5 rounded-sm transition-colors ${props[key] === 'full' || !props[key] ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
        >
          Full Width
        </button>
        <button
          onClick={() => handleChange(key, 'half')}
          className={`flex-1 text-xs py-1.5 rounded-sm transition-colors ${props[key] === 'half' ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
        >
          1/2 (Half)
        </button>
      </div>
      <p className="text-[10px] text-muted">
        If two "Half" components are next to each other, they will be displayed side-by-side.
      </p>
    </div>
  );

  const renderFields = () => {
    switch (type) {
      case ComponentType.HEADER:
        return (
          <>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={props.title} onChange={(e) => handleChange('title', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <Textarea value={props.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Align</Label>
              <Select value={props.align} onChange={(e) => handleChange('align', e.target.value)}>
                <option value="left">Left</option>
                <option value="center">Center</option>
              </Select>
            </div>
            {renderWidthSelector()}
          </>
        );

      case ComponentType.TEXT:
        return (
           <>
             <div className="space-y-2">
                <Label>Content</Label>
                <Textarea 
                  className="min-h-[200px] font-mono" 
                  value={props.content} 
                  onChange={(e) => handleChange('content', e.target.value)} 
                />
             </div>
             {renderWidthSelector()}
           </>
        );

      case ComponentType.TEXT_WITH_IMAGE:
        return (
           <>
            <div className="space-y-2">
               <Label>Heading</Label>
               <Input value={props.heading} onChange={(e) => handleChange('heading', e.target.value)} />
            </div>
            <div className="space-y-2">
               <Label>Content</Label>
               <Textarea 
                 className="min-h-[150px]" 
                 value={props.content} 
                 onChange={(e) => handleChange('content', e.target.value)} 
               />
            </div>
            <div className="space-y-2 border-t border-border pt-4">
               <Label>Image / GIF URL</Label>
               <Input value={props.imageSrc} onChange={(e) => handleChange('imageSrc', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Image Width (px)</Label>
                  <Input value={props.imageWidth} onChange={(e) => handleChange('imageWidth', e.target.value)} />
               </div>
               <div className="space-y-2">
                  <Label>Image Position</Label>
                  <Select value={props.imageAlign} onChange={(e) => handleChange('imageAlign', e.target.value)}>
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                  </Select>
               </div>
            </div>
            {renderWidthSelector()}
           </>
        );

      case ComponentType.STATS: {
        const demoUser = githubUsername || 'github';
        const currentVariant = props.variant || 'stats';

        return (
          <>
            <div className="space-y-2 mb-4 p-3 bg-surface rounded border border-border">
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  checked={props.useGlobalUsername !== false} 
                  onChange={(e) => handleChange('useGlobalUsername', e.target.checked)} 
                />
                <Label className="mb-0">Use Global Username</Label>
              </div>
              
              {props.useGlobalUsername === false && (
                <div className="space-y-1">
                   <Label>Override Username</Label>
                   <Input value={props.username} onChange={(e) => handleChange('username', e.target.value)} placeholder="github" />
                </div>
              )}
            </div>

            <div className="space-y-2 mb-4">
               <Label>Card Type</Label>
               <Select value={currentVariant} onChange={(e) => handleChange('variant', e.target.value)}>
                  <option value="stats">General Stats</option>
                  <option value="streak">Streak Stats</option>
                  <option value="languages">Top Languages</option>
               </Select>
            </div>

            <div className="space-y-2">
               <Label>Theme Selector</Label>
               <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1 custom-scrollbar bg-surface rounded-lg border border-border">
                 {GITHUB_THEMES.map(t => (
                   <button 
                     key={t}
                     onClick={() => handleChange('theme', t)}
                     className={`relative rounded overflow-hidden border transition-all ${props.theme === t ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-muted'}`}
                   >
                     <img 
                       src={getStatsUrl(currentVariant, t, demoUser)}
                       alt={t}
                       className="w-full h-auto object-cover opacity-90 hover:opacity-100"
                       loading="lazy"
                     />
                     <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-center py-1 truncate px-1 text-white">
                       {t}
                     </div>
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4 mt-4">
               {currentVariant !== 'streak' && currentVariant !== 'languages' && (
                 <>
                   <div className="flex items-center gap-2">
                      <input type="checkbox" checked={props.showIcons} onChange={(e) => handleChange('showIcons', e.target.checked)} />
                      <Label>Show Icons</Label>
                   </div>
                   <div className="flex items-center gap-2">
                      <input type="checkbox" checked={props.showRank} onChange={(e) => handleChange('showRank', e.target.checked)} />
                      <Label>Show Rank</Label>
                   </div>
                 </>
               )}
               <div className="flex items-center gap-2">
                  <input type="checkbox" checked={props.hideBorder} onChange={(e) => handleChange('hideBorder', e.target.checked)} />
                  <Label>Hide Border</Label>
               </div>
            </div>
            {renderWidthSelector()}
          </>
        );
      }

      case ComponentType.TECH_STACK:
      {
        const activeTechs = props.technologies || [];
        
        return (
          <>
            <div className="space-y-2">
               <Label>Badge Style</Label>
               <Select value={props.style} onChange={(e) => handleChange('style', e.target.value)}>
                 {BADGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
               </Select>
            </div>
            
            {/* Selected Techs */}
            <div className="space-y-2 mt-4">
              <Label>Selected Technologies ({activeTechs.length})</Label>
              <div className="flex flex-wrap gap-2 p-2 bg-surface rounded-lg border border-border min-h-[50px]">
                {activeTechs.length === 0 && (
                   <span className="text-xs text-muted italic p-1">No technologies selected</span>
                )}
                {activeTechs.map((tech: string) => (
                  <button 
                    key={tech} 
                    onClick={() => toggleTech(tech)}
                    className="relative group transition-transform hover:scale-105"
                    title="Click to remove"
                  >
                    <img 
                      src={generateBadgeUrl(tech, props.style || 'for-the-badge')} 
                      alt={tech} 
                      className="h-6" 
                    />
                    <div className="absolute inset-0 bg-red-900/80 items-center justify-center rounded opacity-0 group-hover:opacity-100 flex transition-opacity">
                      <PhosphorIcons.X size={12} className="text-white" weight="bold" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Picker */}
            <div className="space-y-2 mt-4 pt-4 border-t border-border">
               <Label>Add Technologies</Label>
               <div className="relative">
                 <PhosphorIcons.MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
                 <Input 
                   value={techSearch} 
                   onChange={(e) => setTechSearch(e.target.value)} 
                   placeholder="Search (e.g., React, Python...)"
                   className="pl-8"
                 />
               </div>
               
               <div className="h-80 overflow-y-auto custom-scrollbar border border-border rounded-lg bg-surface/50 mt-2">
                  {techSearch ? (
                    <div className="p-2 space-y-1">
                      {ALL_TECHS.filter(t => t.toLowerCase().includes(techSearch.toLowerCase())).map(tech => (
                        <button
                          key={tech}
                          onClick={() => toggleTech(tech)}
                          className={`w-full text-left px-3 py-2 rounded text-xs flex items-center justify-between ${activeTechs.includes(tech) ? 'bg-primary/20 text-primary' : 'hover:bg-surface-hover text-foreground'}`}
                        >
                          <span>{tech}</span>
                          {activeTechs.includes(tech) && <PhosphorIcons.Check size={12} />}
                        </button>
                      ))}
                      {ALL_TECHS.filter(t => t.toLowerCase().includes(techSearch.toLowerCase())).length === 0 && (
                        <div className="p-4 text-center text-xs text-muted">No matches found</div>
                      )}
                    </div>
                  ) : (
                    <div className="p-2 space-y-4">
                      {Object.entries(TECH_CATEGORIES).map(([category, items]) => (
                        <div key={category}>
                          <h4 className="text-[10px] uppercase font-bold text-muted mb-2 px-1 tracking-wider sticky top-0 bg-background/90 py-1 backdrop-blur-sm z-10 border-b border-border/50">{category}</h4>
                          <div className="grid grid-cols-2 gap-1">
                             {items.map(tech => (
                               <button
                                 key={tech}
                                 onClick={() => toggleTech(tech)}
                                 className={`px-2 py-1.5 rounded text-xs text-left truncate transition-colors ${activeTechs.includes(tech) ? 'bg-primary/20 text-primary font-medium' : 'bg-surface hover:bg-surface-hover text-muted hover:text-foreground'}`}
                                 title={tech}
                               >
                                 {tech}
                               </button>
                             ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>
            {renderWidthSelector()}
          </>
        );
      }

      case ComponentType.IMAGE:
        return (
          <>
             <div className="space-y-2">
               <Label>Image URL</Label>
               <Input value={props.src} onChange={(e) => handleChange('src', e.target.value)} />
             </div>
             <div className="space-y-2">
               <Label>Alt Text</Label>
               <Input value={props.alt} onChange={(e) => handleChange('alt', e.target.value)} />
             </div>
             <div className="space-y-2">
               <Label>Alignment</Label>
               <Select value={props.align} onChange={(e) => handleChange('align', e.target.value)}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
               </Select>
             </div>
             {renderWidthSelector('widthMode')}
          </>
        );

      case ComponentType.SOCIALS:
        return (
           <div className="space-y-4">
              <Label>Social Links</Label>
              {(props.items || []).map((item: any, idx: number) => (
                <div key={idx} className="flex gap-2 items-center p-2 bg-surface rounded border border-border">
                   <div className="flex-1 space-y-1">
                      <Input 
                        placeholder="Platform" 
                        value={item.platform} 
                        onChange={(e) => {
                          const newItems = [...props.items];
                          newItems[idx].platform = e.target.value;
                          handleChange('items', newItems);
                        }}
                        className="h-7 text-xs"
                      />
                      <Input 
                        placeholder="Username" 
                        value={item.username} 
                        onChange={(e) => {
                           const newItems = [...props.items];
                           newItems[idx].username = e.target.value;
                           handleChange('items', newItems);
                        }}
                        className="h-7 text-xs"
                      />
                   </div>
                   <button 
                     onClick={() => {
                        const newItems = [...props.items];
                        newItems.splice(idx, 1);
                        handleChange('items', newItems);
                     }}
                     className="text-muted hover:text-red-400 p-1"
                   >
                     <PhosphorIcons.TrashSimple size={14} />
                   </button>
                </div>
              ))}
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full"
                onClick={() => handleChange('items', [...(props.items || []), { platform: 'twitter', username: '' }])}
              >
                + Add Link
              </Button>
              {renderWidthSelector()}
           </div>
        );

      case ComponentType.MARKDOWN:
        return (
          <>
            <div className="space-y-2">
              <Label>Raw Markdown</Label>
              <Textarea 
                className="min-h-[300px] font-mono text-xs" 
                value={props.markdown} 
                onChange={(e) => handleChange('markdown', e.target.value)} 
              />
            </div>
            {renderWidthSelector()}
          </>
        );

      default:
        return <div className="text-sm text-muted">No properties available.</div>;
    }
  };

  return (
    <div className="w-80 border-l border-border bg-background flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <PhosphorIcons.Faders size={18} />
          Properties
        </h2>
        <Button 
          variant="danger" 
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => removeComponent(selectedComponent.id)}
          title="Remove Component"
        >
          <PhosphorIcons.TrashSimple size={14} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {renderFields()}
      </div>
    </div>
  );
};

export default Inspector;
