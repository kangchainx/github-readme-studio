import React, { useState } from 'react';
import { useStore } from '../../store';
import { ComponentType } from '../../types';
import { Button, Input, Label, Textarea, Select, Switch } from '../ui/UIComponents';
import { 
  TrashIcon, 
  XIcon, 
  CursorClickIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  FadersIcon,
  PlusIcon
} from '@phosphor-icons/react';
import { BADGE_STYLES, GITHUB_THEMES, SOCIAL_PLATFORMS } from '../../constants';
import { TECH_CATEGORIES, ALL_TECHS } from '../../data/techStack';
import { generateBadgeUrl } from '../../lib/markdown';
import { MarkdownEditor } from './MarkdownEditor';

const Inspector = () => {
  const { components, selectedId, updateComponentProps, removeComponent } = useStore();
  const [techSearch, setTechSearch] = useState('');
  
  const selectedComponent = components.find(c => c.id === selectedId);

  if (!selectedComponent) {
    return (
      <div className="w-80 border-l border-border bg-background flex flex-col items-center justify-center text-muted p-6 text-center">
        <CursorClickIcon size={32} className="mb-3 opacity-50" />
        <p className="text-sm">Select a component on the canvas to edit its properties.</p>
      </div>
    );
  }

  const { props, type } = selectedComponent;

  const handleChange = (key: string, value: any) => {
    updateComponentProps(selectedComponent.id, { [key]: value });
  };

  const updateProps = (newProps: Record<string, any>) => {
    updateComponentProps(selectedComponent.id, newProps);
  };

  const toggleTech = (tech: string) => {
    const current = props.technologies || [];
    if (current.includes(tech)) {
      handleChange('technologies', current.filter((t: string) => t !== tech));
    } else {
      handleChange('technologies', [...current, tech]);
    }
  };


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
              <MarkdownEditor value={props.title} onChange={(val) => handleChange('title', val)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Subtitle</Label>
              <MarkdownEditor value={props.subtitle} onChange={(val) => handleChange('subtitle', val)} rows={3} />
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

      case ComponentType.HEADING:
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Level</Label>
                <div className="flex bg-surface rounded-md p-1 border border-border">
                  {[1, 2, 3, 4, 5, 6].map((l) => (
                    <button
                      key={l}
                      onClick={() => handleChange('level', l)}
                      className={`flex-1 text-xs py-1.5 rounded-sm transition-colors ${props.level === l ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
                    >
                      H{l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <MarkdownEditor value={props.content} onChange={(val) => handleChange('content', val)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Align</Label>
                <Select value={props.align} onChange={(e) => handleChange('align', e.target.value)}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </Select>
              </div>
            </div>
            {renderWidthSelector()}
          </>
        );

      case ComponentType.TEXT:
        return (
           <>
             <div className="space-y-2">
                <Label>Paragraph Content</Label>
                <MarkdownEditor 
                  value={props.content} 
                  onChange={(val) => handleChange('content', val)} 
                  rows={8}
                />
             </div>
             {renderWidthSelector()}
           </>
        );

      case ComponentType.LIST:
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>List Style</Label>
                <Select value={props.type} onChange={(e) => handleChange('type', e.target.value)}>
                  <option value="unordered">Unordered (Bullets)</option>
                  <option value="ordered">Ordered (Numbers)</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>List Items</Label>
                <div className="space-y-2">
                   {(props.items || []).map((item: string, idx: number) => (
                     <div key={idx} className="flex gap-2">
                       <Input 
                         value={item} 
                         onChange={(e) => {
                           const newItems = [...(props.items || [])];
                           newItems[idx] = e.target.value;
                           handleChange('items', newItems);
                         }} 
                       />
                       <button 
                         onClick={() => {
                           const newItems = [...(props.items || [])];
                           newItems.splice(idx, 1);
                           handleChange('items', newItems);
                         }}
                         className="p-2 text-muted hover:text-red-500 transition-colors"
                       >
                         <TrashIcon size={16} />
                       </button>
                     </div>
                   ))}
                   <Button 
                     variant="secondary" 
                     size="sm" 
                     className="w-full gap-2"
                     onClick={() => handleChange('items', [...(props.items || []), 'New Item'])}
                   >
                     <PlusIcon size={14} /> Add Item
                   </Button>
                </div>
              </div>
            </div>
            {renderWidthSelector()}
          </>
        );
      
      case ComponentType.BLOCKQUOTE:
        return (
           <>
             <div className="space-y-2">
                <Label>Quote Content</Label>
                <MarkdownEditor 
                  value={props.content} 
                  onChange={(val) => handleChange('content', val)} 
                  rows={3}
                />
             </div>
             {renderWidthSelector()}
           </>
        );

      case ComponentType.CODE_BLOCK:
        return (
           <>
             <div className="space-y-2">
                <Label>Language</Label>
                <Select value={props.language} onChange={(e) => handleChange('language', e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="json">JSON</option>
                  <option value="bash">Bash</option>
                  <option value="markdown">Markdown</option>
                  <option value="yaml">YAML</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </Select>
             </div>
             <div className="space-y-2">
                <Label>Code</Label>
                <Textarea 
                  className="min-h-[200px] font-mono text-xs" 
                  value={props.code} 
                  onChange={(e) => handleChange('code', e.target.value)} 
                />
             </div>
             {renderWidthSelector()}
           </>
        );

      case ComponentType.LINK:
        return (
           <>
             <div className="space-y-2">
                <Label>Label</Label>
                <Input value={props.label} onChange={(e) => handleChange('label', e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label>URL</Label>
                <Input value={props.url} onChange={(e) => handleChange('url', e.target.value)} />
             </div>
             {renderWidthSelector()}
           </>
        );

      case ComponentType.IMAGE_LINK:
        return (
           <>
             <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={props.src} onChange={(e) => handleChange('src', e.target.value)} />
             </div>
             <div className="space-y-2">
                <Label>Target URL</Label>
                <Input value={props.url} onChange={(e) => handleChange('url', e.target.value)} />
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
             {renderWidthSelector()}
           </>
        );

      case ComponentType.DETAILS:
        return (
           <>
             <div className="space-y-2">
                <Label>Summary (Clickable Text)</Label>
                <MarkdownEditor value={props.summary} onChange={(val) => handleChange('summary', val)} rows={2} />
             </div>
             <div className="space-y-2">
                <Label>Hidden Content</Label>
                <MarkdownEditor 
                  value={props.content} 
                  onChange={(val) => handleChange('content', val)} 
                  rows={5}
                />
             </div>
             {renderWidthSelector()}
           </>
        );

      case ComponentType.TABLE: {
        // Helper to ensure rows have correct column count
        const headers = props.headers || [];
        const rows = props.rows || [];
        
        const updateRowCell = (rowIndex: number, colIndex: number, value: string) => {
           const newRows = [...rows];
           const newRow = [...(newRows[rowIndex] || [])];
           newRow[colIndex] = value;
           newRows[rowIndex] = newRow;
           handleChange('rows', newRows);
        };

        const addRow = () => {
           const newRow = new Array(headers.length).fill('');
           handleChange('rows', [...rows, newRow]);
        };
        
        const removeRow = (index: number) => {
           const newRows = [...rows];
           newRows.splice(index, 1);
           handleChange('rows', newRows);
        };

        const updateHeader = (index: number, value: string) => {
           const newHeaders = [...headers];
           newHeaders[index] = value;
           handleChange('headers', newHeaders);
        };

        const addColumn = () => {
            handleChange('headers', [...headers, 'New Col']);
            const newRows = rows.map((r: string[]) => [...r, '']);
            handleChange('rows', newRows);
        };

        const removeColumn = (index: number) => {
            const newHeaders = [...headers];
            newHeaders.splice(index, 1);
            handleChange('headers', newHeaders);
            
            const newRows = rows.map((r: string[]) => {
               const newRow = [...r];
               newRow.splice(index, 1);
               return newRow;
            });
            handleChange('rows', newRows);
        };

        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <Label>Columns (Headers)</Label>
                   <Button variant="secondary" size="sm" onClick={addColumn} className="h-6 text-[10px] px-2">
                     + Add Col
                   </Button>
                 </div>
                 <div className="space-y-2">
                    {headers.map((h: string, i: number) => (
                      <div key={i} className="flex gap-1">
                        <Input 
                          value={h} 
                          onChange={(e) => updateHeader(i, e.target.value)}
                          className="text-xs h-7 font-bold"
                          placeholder={`Header ${i+1}`}
                        />
                        <button onClick={() => removeColumn(i)} className="p-1 text-muted hover:text-red-500">
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <Label>Rows Data</Label>
                   <Button variant="secondary" size="sm" onClick={addRow} className="h-6 text-[10px] px-2">
                     + Add Row
                   </Button>
                 </div>
                 <div className="space-y-3">
                   {rows.map((row: string[], rowIndex: number) => (
                     <div key={rowIndex} className="p-2 bg-surface rounded border border-border relative group">
                        <button 
                          onClick={() => removeRow(rowIndex)}
                          className="absolute -right-2 -top-2 bg-background border border-border rounded-full p-1 text-muted hover:text-red-500 hover:border-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <TrashIcon size={12} weight="bold" />
                        </button>
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
                           {headers.map((_: any, colIndex: number) => (
                             <div key={colIndex}> 
                               <Input 
                                 value={row[colIndex] || ''}
                                 onChange={(e) => updateRowCell(rowIndex, colIndex, e.target.value)}
                                 className="text-xs h-7 px-1.5"
                                 placeholder="..."
                               />
                             </div>
                           ))}
                        </div>
                     </div>
                   ))}
                 </div>
                 {rows.length === 0 && (
                   <div className="text-center p-4 border border-dashed border-border rounded-lg text-muted text-xs">
                     No rows. Click "Add Row" to start.
                   </div>
                 )}
              </div>

               <div className="space-y-2">
               <Label>Alignment</Label>
               <Select value={props.align} onChange={(e) => handleChange('align', e.target.value)}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
               </Select>
             </div>
            </div>
            {renderWidthSelector()}
          </>
        );
      }

      case ComponentType.BADGE:
        return (
          <>
            <div className="space-y-2">
               <Label>Label</Label>
               <Input value={props.label} onChange={(e) => handleChange('label', e.target.value)} />
            </div>
            <div className="space-y-2">
               <Label>Message</Label>
               <Input value={props.message} onChange={(e) => handleChange('message', e.target.value)} />
            </div>
            <div className="space-y-2">
               <Label>Color</Label>
               <Input value={props.color} onChange={(e) => handleChange('color', e.target.value)} />
            </div>
            <div className="space-y-2">
               <Label>Logo (Optional)</Label>
               <Input value={props.logo} onChange={(e) => handleChange('logo', e.target.value)} placeholder="github, twitter..." />
            </div>
            <div className="space-y-2">
               <Label>Logo Color</Label>
               <Input value={props.logoColor} onChange={(e) => handleChange('logoColor', e.target.value)} placeholder="white" />
            </div>
            <div className="space-y-2">
               <Label>Style</Label>
               <Select value={props.style} onChange={(e) => handleChange('style', e.target.value)}>
                 {BADGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
               </Select>
            </div>
            {renderWidthSelector()}
          </>
        );

      case ComponentType.SVG:
        return (
          <>
             <div className="space-y-2">
               <Label>SVG/GIF URL</Label>
               <Input value={props.src} onChange={(e) => handleChange('src', e.target.value)} />
             </div>
             <div className="space-y-2">
               <Label>Alt Text</Label>
               <Input value={props.alt} onChange={(e) => handleChange('alt', e.target.value)} />
             </div>
             <div className="space-y-2">
               <Label>Max Height</Label>
               <Input value={props.maxHeight} onChange={(e) => handleChange('maxHeight', e.target.value)} placeholder="300px" />
             </div>
             {renderWidthSelector()}
          </>
        );

      case ComponentType.BREAKER:
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Separator Variant</Label>
                <Select value={props.variant} onChange={(e) => handleChange('variant', e.target.value)}>
                  <option value="line">Horizontal Line (hr)</option>
                  <option value="spacer">Empty Space (Gap)</option>
                </Select>
              </div>
            </div>
            {renderWidthSelector()}
          </>
        );


      case ComponentType.TEXT_WITH_IMAGE:
        return (
           <>
            <div className="space-y-2">
               <Label>Heading</Label>
               <MarkdownEditor value={props.heading} onChange={(val) => handleChange('heading', val)} rows={2} />
            </div>
            <div className="space-y-2">
               <Label>Content</Label>
               <MarkdownEditor 
                 value={props.content} 
                 onChange={(val) => handleChange('content', val)} 
                 rows={5}
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

      case ComponentType.CORE_STATS:
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex bg-surface rounded-md p-1 border border-border flex-wrap gap-1">
              {GITHUB_THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => updateProps({ theme })}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${props.theme === theme ? 'bg-primary text-primary-foreground' : 'hover:bg-surface-hover text-muted'}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Icons</Label>
            <Switch 
              checked={props.showIcons} 
              onCheckedChange={(showIcons) => updateProps({ showIcons })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Show Rank</Label>
            <Switch 
              checked={props.showRank} 
              onCheckedChange={(showRank) => updateProps({ showRank })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Hide Border</Label>
            <Switch 
              checked={props.hideBorder} 
              onCheckedChange={(hideBorder) => updateProps({ hideBorder })}
            />
          </div>
        </div>
      );

    case ComponentType.ABOUT_ME:
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input 
              value={(props.titleIcon || '') + (props.titleIcon ? ' ' : '') + (props.title || '')} 
              onChange={(e) => {
                const val = e.target.value;
                // Try to extract emoji/icon from the beginning
                const match = val.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✨🚀🛠️🤝📂]+)\s*(.*)$/u);
                if (match) {
                  updateProps({ titleIcon: match[1], title: match[2] });
                } else {
                  updateProps({ titleIcon: '', title: val });
                }
              }} 
              className="font-bold"
              placeholder="✨ About Me"
            />
          </div>
          <div className="space-y-2">
            <Label>Introduction</Label>
            <MarkdownEditor
              value={props.content || ''}
              onChange={(content) => updateProps({ content })}
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="p-3 border border-border rounded-lg bg-surface/50 space-y-3">
             <div className="flex items-center justify-between">
               <Label>Show Image</Label>
               <Switch 
                 checked={props.showImage !== false} 
                 onCheckedChange={(checked) => updateProps({ showImage: checked })}
               />
             </div>
             
             {props.showImage !== false && (
               <>
                 <div className="space-y-2">
                    <Label>Image / GIF URL</Label>
                    <Input value={props.imageSrc || ''} onChange={(e) => updateProps({ imageSrc: e.target.value })} placeholder="Image URL" />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                       <Label>Width (px)</Label>
                       <Input 
                         type="number" 
                         value={props.imageWidth || '300'} 
                         onChange={(e) => updateProps({ imageWidth: e.target.value })} 
                         min="50"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label>Align</Label>
                       <Select value={props.imageAlign || 'right'} onChange={(e) => handleChange('imageAlign', e.target.value)}>
                         <option value="left">Left</option>
                         <option value="right">Right</option>
                       </Select>
                    </div>
                 </div>
               </>
             )}
          </div>
          
          {renderWidthSelector()}
        </div>
      );

    case ComponentType.STREAK_STATS:
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex bg-surface rounded-md p-1 border border-border flex-wrap gap-1">
              {GITHUB_THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => updateProps({ theme })}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${props.theme === theme ? 'bg-primary text-primary-foreground' : 'hover:bg-surface-hover text-muted'}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Hide Border</Label>
            <Switch 
              checked={props.hideBorder} 
              onCheckedChange={(hideBorder) => updateProps({ hideBorder })}
            />
          </div>
        </div>
      );

    case ComponentType.REPO_CARD:
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Repo Name</Label>
            <Input 
              value={props.repo || ''} 
              onChange={(e) => updateProps({ repo: e.target.value })}
              placeholder="e.g. github-readme-studio"
            />
          </div>
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex bg-surface rounded-md p-1 border border-border flex-wrap gap-1">
              {GITHUB_THEMES.map(theme => (
                <button
                  key={theme}
                  onClick={() => updateProps({ theme })}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${props.theme === theme ? 'bg-primary text-primary-foreground' : 'hover:bg-surface-hover text-muted'}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label>Hide Border</Label>
            <Switch 
              checked={props.hideBorder} 
              onCheckedChange={(hideBorder) => updateProps({ hideBorder })}
            />
          </div>
        </div>
      );

      case ComponentType.TECH_STACK:
      {
        const activeTechs = props.technologies || [];
        
        return (
          <>
            <div className="space-y-4">
               <div className="space-y-2">
                <Label>Section Title</Label>
                <Input 
                  value={(props.titleIcon || '') + (props.titleIcon ? ' ' : '') + (props.title || '')} 
                  onChange={(e) => {
                    const val = e.target.value;
                    const match = val.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✨🚀🛠️🤝📂]+)\s*(.*)$/u);
                    if (match) {
                      updateProps({ titleIcon: match[1], title: match[2] });
                    } else {
                      updateProps({ titleIcon: '', title: val });
                    }
                  }}
                  placeholder="🛠️ Tech Stack"
                />
              </div>
              <div className="space-y-2">
                 <Label>Badge Style</Label>
                 <Select value={props.style} onChange={(e) => handleChange('style', e.target.value)}>
                   {BADGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                 </Select>
              </div>
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
                      <XIcon size={12} className="text-white" weight="bold" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Picker */}
            <div className="space-y-2 mt-4 pt-4 border-t border-border">
               <Label>Add Technologies</Label>
               <div className="relative">
                 <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
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
                          {activeTechs.includes(tech) && <CheckIcon size={12} />}
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

      case ComponentType.PROJECT_DEMO:
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input 
              value={(props.titleIcon || '') + (props.titleIcon ? ' ' : '') + (props.title || '')} 
              onChange={(e) => {
                const val = e.target.value;
                const match = val.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✨🚀🛠️🤝📂]+)\s*(.*)$/u);
                if (match) {
                  updateProps({ titleIcon: match[1], title: match[2] });
                } else {
                  updateProps({ titleIcon: '', title: val });
                }
              }}
              placeholder="🚀 My Project"
            />
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label>Projects</Label>
               <Button 
                 variant="secondary" 
                 size="sm" 
                 className="h-7 text-[10px] px-2"
                 onClick={() => updateProps({ 
                   projects: [...(props.projects || []), { title: '', image: '', link: '' }] 
                 })}
               >
                 + Add Project
               </Button>
             </div>
             {(props.projects || []).map((project: any, idx: number) => (
               <div key={idx} className="space-y-2 p-3 border border-border rounded-lg bg-surface/50">
                 <div className="flex items-center justify-end">
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="shrink-0 text-red-500 hover:text-red-400 h-6 w-6"
                     onClick={() => {
                       const newProjects = props.projects.filter((_: any, i: number) => i !== idx);
                       updateProps({ projects: newProjects });
                     }}
                   >
                     <TrashIcon size={14} />
                   </Button>
                 </div>
                 <div className="space-y-2">
                   <Input 
                     value={project.title || ''} 
                     onChange={(e) => {
                       const newProjects = [...props.projects];
                       newProjects[idx] = { ...newProjects[idx], title: e.target.value };
                       updateProps({ projects: newProjects });
                     }}
                     placeholder="Project Title"
                     className="h-8 text-xs font-bold"
                   />
                   <Input 
                     value={project.image || ''} 
                     onChange={(e) => {
                       const newProjects = [...props.projects];
                       newProjects[idx] = { ...newProjects[idx], image: e.target.value };
                       updateProps({ projects: newProjects });
                     }}
                     placeholder="Image / GIF URL"
                     className="h-8 text-xs"
                   />
                   <Input 
                     value={project.link || ''} 
                     onChange={(e) => {
                       const newProjects = [...props.projects];
                       newProjects[idx] = { ...newProjects[idx], link: e.target.value };
                       updateProps({ projects: newProjects });
                     }}
                     placeholder="Project Link (Optional)"
                     className="h-8 text-xs"
                   />
                 </div>
               </div>
             ))}
          </div>
          {renderWidthSelector()}
        </div>
      );

    case ComponentType.SOCIALS:
      return (
        <div className="space-y-4">
           <div className="space-y-2">
             <Label>Section Title</Label>
             <Input 
               value={(props.titleIcon || '') + (props.titleIcon ? ' ' : '') + (props.title || '')} 
               onChange={(e) => {
                 const val = e.target.value;
                 const match = val.match(/^([\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✨🚀🛠️🤝📂]+)\s*(.*)$/u);
                 if (match) {
                   updateProps({ titleIcon: match[1], title: match[2] });
                 } else {
                   updateProps({ titleIcon: '', title: val });
                 }
               }}
               placeholder="🤝 Connect with me"
             />
           </div>
          <div className="space-y-2">
            <Label>Style</Label>
            <Select value={props.style} onChange={(e) => handleChange('style', e.target.value)}>
              {BADGE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Platforms</Label>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-7 text-[10px] px-2"
                onClick={() => updateProps({ items: [...(props.items || []), { platform: 'github', username: '' }] })}
              >
                + Add Link
              </Button>
            </div>
            {(props.items || []).map((item: any, idx: number) => (
              <div key={idx} className="space-y-2 p-3 border border-border rounded-lg bg-surface/50">
                <div className="flex items-center justify-between gap-2">
                  <Select 
                    value={item.platform} 
                    onChange={(e) => {
                      const newItems = [...props.items];
                      newItems[idx] = { ...newItems[idx], platform: e.target.value };
                      updateProps({ items: newItems });
                    }}
                    className="flex-1"
                  >
                    {SOCIAL_PLATFORMS.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </Select>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="shrink-0 text-red-500 hover:text-red-400 h-8 w-8"
                    onClick={() => {
                      const newItems = props.items.filter((_: any, i: number) => i !== idx);
                      updateProps({ items: newItems });
                    }}
                  >
                    <TrashIcon size={14} />
                  </Button>
                </div>
                <Input 
                  value={item.username || ''} 
                  onChange={(e) => {
                    const newItems = [...props.items];
                    newItems[idx] = { ...newItems[idx], username: e.target.value };
                    updateProps({ items: newItems });
                  }}
                  placeholder="Username / Profile ID"
                  className="h-8 text-xs"
                />
              </div>
            ))}
          </div>
          {renderWidthSelector()}
        </div>
      );

      case ComponentType.MARKDOWN:
        return (
          <>
            <div className="space-y-2">
              <MarkdownEditor 
                value={props.markdown} 
                onChange={(val) => handleChange('markdown', val)} 
                rows={15}
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
          <FadersIcon size={18} />
          Properties
        </h2>
        <Button 
          variant="danger" 
          size="sm"
          className="h-9 w-9 p-0 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          onClick={() => removeComponent(selectedComponent.id)}
          title="Remove Component"
        >
          <TrashIcon size={22} weight="fill" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {renderFields()}
      </div>
    </div>
  );
};

export default Inspector;
