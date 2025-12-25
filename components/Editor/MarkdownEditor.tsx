import React, { useRef } from 'react';
import { 
  TextB, 
  TextItalic, 
  Link, 
  Code, 
  ListBullets, 
  ListNumbers,
  Quotes
} from '@phosphor-icons/react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  rows = 4
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (type: 'bold' | 'italic' | 'link' | 'code' | 'list' | 'numlist' | 'quote') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let replacement = '';

    switch (type) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`;
        break;
      case 'link':
        replacement = `[${selectedText || 'link text'}](https://)`;
        break;
      case 'code':
        replacement = `\`${selectedText || 'code'}\``;
        break;
      case 'list':
        replacement = `\n- ${selectedText || 'item'}`;
        break;
      case 'numlist':
        replacement = `\n1. ${selectedText || 'item'}`;
        break;
      case 'quote':
        replacement = `\n> ${selectedText || 'quote'}`;
        break;
    }

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    
    // Try to using execCommand to preserve undo/redo stack
    // This is the most reliable way to maintain native undo history in a textarea
    try {
      textarea.focus();
      if (!document.execCommand('insertText', false, replacement)) {
        // Fallback if execCommand fails
        onChange(newValue);
      }
    } catch {
      onChange(newValue);
    }

    // Focus back and set cursor
    setTimeout(() => {
      textarea.focus();
      // If we provided a placeholder like 'bold text', select it
      if (!selectedText && replacement.includes('text')) {
        const placeholder = replacement.match(/(text|link|item|quote|code)/)?.[0] || '';
        const offset = replacement.indexOf(placeholder);
        textarea.setSelectionRange(start + offset, start + offset + placeholder.length);
      } else if (!selectedText) {
        // Just move cursor to the end of replacement
        const newPos = start + replacement.length;
        textarea.setSelectionRange(newPos, newPos);
      } else {
        // Text was selected, move cursor to the end of the new selection
        const newPos = start + replacement.length;
        textarea.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  return (
    <div className={`flex flex-col border border-border rounded-md bg-surface overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-1 border-b border-border bg-surface/50">
        <ToolbarButton onClick={() => applyFormat('bold')} title="Bold">
          <TextB size={16} weight="bold" />
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat('italic')} title="Italic">
          <TextItalic size={16} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton onClick={() => applyFormat('link')} title="Insert Link">
          <Link size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat('code')} title="Inline Code">
          <Code size={16} />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-1" />
        <ToolbarButton onClick={() => applyFormat('list')} title="Bullet List">
          <ListBullets size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat('numlist')} title="Numbered List">
          <ListNumbers size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => applyFormat('quote')} title="Blockquote">
          <Quotes size={16} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none resize-y min-h-[100px] text-foreground placeholder:text-muted"
      />
    </div>
  );
};

const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode; title: string }> = ({ 
  onClick, 
  children, 
  title 
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="p-1.5 rounded hover:bg-surface-hover text-muted hover:text-foreground transition-colors flex items-center justify-center"
  >
    {children}
  </button>
);
