// Supported Component Types
export enum ComponentType {
  HEADER = 'header',
  TEXT = 'text',
  TEXT_WITH_IMAGE = 'text_with_image',
  CORE_STATS = 'core_stats',
  STREAK_STATS = 'streak_stats',
  REPO_CARD = 'repo_card',
  TECH_STACK = 'tech_stack',
  SOCIALS = 'socials',
  IMAGE = 'image',
  MARKDOWN = 'markdown',
  PROJECT_DEMO = 'project_demo',
  HEADING = 'heading',
  LIST = 'list',
  BREAKER = 'breaker',
  BADGE = 'badge',
  TABLE = 'table',
  DETAILS = 'details',
  CODE_BLOCK = 'code_block',
  BLOCKQUOTE = 'blockquote',
  SVG = 'svg',
  LINK = 'link',
  IMAGE_LINK = 'image_link',
}

// Global Editor Modes
export type EditorMode = 'builder' | 'preview' | 'source';

// Base interface for all component properties
export interface ComponentProps {
  [key: string]: any;
}

// The core data model for a component instance on the canvas
export interface ComponentInstance {
  id: string;
  type: ComponentType;
  props: ComponentProps;
}

// Configuration for the component library (Left Sidebar)
export interface ComponentDefinition {
  type: ComponentType;
  category: 'basic' | 'advanced';
  label: string;
  icon: string; // Icon name for display
  description: string;
  defaultProps: ComponentProps;
}

// Application Store State
export interface AppState {
  components: ComponentInstance[];
  selectedId: string | null;
  editorMode: EditorMode; // Replaced isPreviewMode
  githubUsername: string;
  
  // Global Settings
  themeMode: 'dark' | 'light';
  showSeparators: boolean;
  
  // Actions
  setGithubUsername: (username: string) => void;
  addComponent: (type: ComponentType, initialProps?: ComponentProps) => void;
  removeComponent: (id: string) => void;
  updateComponentProps: (id: string, props: Partial<ComponentProps>) => void;
  reorderComponents: (oldIndex: number, newIndex: number) => void;
  selectComponent: (id: string | null) => void;
  setEditorMode: (mode: EditorMode) => void; // New action
  toggleTheme: () => void;
  toggleSeparators: () => void;
  importConfig: (json: string) => void;
}
