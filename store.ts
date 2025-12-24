import { create } from 'zustand';
import { AppState, ComponentInstance, ComponentType, EditorMode, ComponentProps } from './types';
import { COMPONENT_DEFINITIONS } from './constants';
import { v4 as uuidv4 } from 'uuid';

// Helper to reorder array
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Helper to get system theme
const getSystemTheme = (): 'dark' | 'light' => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

export const useStore = create<AppState>((set) => ({
  components: [
    // Initial State: Empty
  ],
  selectedId: null,
  editorMode: 'builder', // Default to Builder (Low-code) mode
  githubUsername: '',
  themeMode: getSystemTheme(), // Default to system preference
  showSeparators: true, // Default to true

  setGithubUsername: (username: string) => set({ githubUsername: username }),

  addComponent: (type: ComponentType, initialProps?: ComponentProps) => set((state) => {
    const def = COMPONENT_DEFINITIONS.find((c) => c.type === type);
    if (!def && !initialProps) return state; // Allow adding even if not in defs if props provided, or rely on defs

    // Deep clone defaults
    let newProps = def ? JSON.parse(JSON.stringify(def.defaultProps)) : {};
    
    // Merge with initialProps if provided
    if (initialProps) {
      newProps = { ...newProps, ...initialProps };
    }
    
    // Dynamic logic: Inject username into Header if available
    if (type === ComponentType.HEADER && state.githubUsername) {
      newProps.title = `Hi there, I'm ${state.githubUsername} 👋`;
    }

    const newComponent: ComponentInstance = {
      id: uuidv4(),
      type,
      props: newProps,
    };

    return {
      components: [...state.components, newComponent],
      selectedId: newComponent.id, // Auto-select new component
      editorMode: 'builder' // Switch back to builder when adding
    };
  }),

  removeComponent: (id: string) => set((state) => ({
    components: state.components.filter((c) => c.id !== id),
    selectedId: state.selectedId === id ? null : state.selectedId
  })),

  updateComponentProps: (id: string, newProps) => set((state) => ({
    components: state.components.map((c) => 
      c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c
    )
  })),

  reorderComponents: (oldIndex: number, newIndex: number) => set((state) => ({
    components: reorder(state.components, oldIndex, newIndex)
  })),

  selectComponent: (id: string | null) => set({ selectedId: id }),
  
  setEditorMode: (mode: EditorMode) => set({ editorMode: mode }),
  
  toggleTheme: () => set((state) => {
    const newMode = state.themeMode === 'dark' ? 'light' : 'dark';
    return { themeMode: newMode };
  }),

  toggleSeparators: () => set((state) => ({ showSeparators: !state.showSeparators })),
  
  importConfig: (json: string) => {
    try {
      const data = JSON.parse(json);
      // Support legacy exports or full state exports
      if (Array.isArray(data)) {
         set({ components: data, selectedId: null });
      } else if (data.components) {
         set({ 
            components: data.components, 
            githubUsername: data.githubUsername || '', 
            selectedId: null,
            showSeparators: data.showSeparators !== undefined ? data.showSeparators : true
         });
      }
    } catch (e) {
      console.error("Failed to import config", e);
    }
  }
}));
