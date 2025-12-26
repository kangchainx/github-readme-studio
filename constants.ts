import { ComponentDefinition, ComponentType } from './types';

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  // --- BASIC COMPONENTS ---
  {
    type: ComponentType.HEADING,
    category: 'basic',
    label: 'Heading',
    icon: 'TextH',
    description: 'Markdown heading (H1 - H6).',
    defaultProps: {
      content: 'Heading Text',
      level: 1,
      align: 'left',
      width: 'full',
    }
  },
  {
    type: ComponentType.TEXT,
    category: 'basic',
    label: 'Text Block',
    icon: 'TextT',
    description: 'A simple paragraph of text.',
    defaultProps: {
      content: "I'm currently working on open source projects and learning new technologies.",
      width: 'full',
    }
  },
  {
    type: ComponentType.IMAGE,
    category: 'basic',
    label: 'Image',
    icon: 'Image',
    description: 'Embed an image or GIF.',
    defaultProps: {
      src: 'https://picsum.photos/800/400',
      alt: 'Banner',
      align: 'center',
      width: '100%',
      widthMode: 'full',
    }
  },
  {
    type: ComponentType.BREAKER,
    category: 'basic',
    label: 'Separator',
    icon: 'Minus',
    description: 'Horizontal line or spacing.',
    defaultProps: {
      variant: 'line',
      width: 'full',
    }
  },
  {
    type: ComponentType.LIST,
    category: 'basic',
    label: 'Bullet List',
    icon: 'ListBullets',
    description: 'Markdown bullet points.',
    defaultProps: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      type: 'unordered',
      width: 'full',
    }
  },
  {
    type: ComponentType.LIST,
    category: 'basic',
    label: 'Ordered List',
    icon: 'ListNumbers',
    description: 'Numbered list.',
    defaultProps: {
      items: ['First step', 'Second step', 'Third step'],
      type: 'ordered',
      width: 'full',
    }
  },
  {
    type: ComponentType.CODE_BLOCK,
    category: 'basic',
    label: 'Code Block',
    icon: 'CodeBlock',
    description: 'Syntax highlighted code.',
    defaultProps: {
      code: 'console.log("Hello World");',
      language: 'javascript',
      showLineNumbers: true,
      width: 'full',
    }
  },
  {
    type: ComponentType.LINK,
    category: 'basic',
    label: 'Link',
    icon: 'Link',
    description: 'Simple text link.',
    defaultProps: {
      label: 'My Website',
      url: 'https://example.com',
      width: 'full',
    }
  },
  {
    type: ComponentType.TABLE,
    category: 'basic',
    label: 'Table',
    icon: 'Table',
    description: 'Data grid.',
    defaultProps: {
      headers: ['Column 1', 'Column 2', 'Column 3'],
      rows: [
        ['Data 1', 'Data 2', 'Data 3'],
        ['Data 4', 'Data 5', 'Data 6'],
      ],
      align: 'center',
      width: 'full',
    }
  },
  {
    type: ComponentType.BLOCKQUOTE,
    category: 'basic',
    label: 'Blockquote',
    icon: 'Quotes',
    description: 'Highlighted quote text.',
    defaultProps: {
      content: 'Knowledge is power.',
      width: 'full',
    }
  },
  {
    type: ComponentType.DETAILS,
    category: 'basic',
    label: 'Collapsible',
    icon: 'CaretDown',
    description: 'Foldable details section.',
    defaultProps: {
      summary: 'Click to reveal more',
      content: 'Hidden content goes here.',
      width: 'full',
    }
  },
  {
    type: ComponentType.IMAGE_LINK,
    category: 'basic',
    label: 'Image Link',
    icon: 'LinkBreak',
    description: 'Image that links to a URL.',
    defaultProps: {
      src: 'https://picsum.photos/200/50',
      url: 'https://example.com',
      alt: 'Clickable Image',
      align: 'center',
      width: 'full',
    }
  },

  // --- ADVANCED COMPONENTS ---
  {
    type: ComponentType.ABOUT_ME,
    category: 'advanced',
    label: 'About Me',
    icon: 'User',
    description: 'Introduction with text and optional image.',
    defaultProps: {
      title: 'About Me',
      titleIcon: '✨',
      content: 'I am a passionate developer who loves building open-source tools.',
      showImage: false,
      imageSrc: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjR4M2Z4M2ZiM3oxM3oxM3oxM3oxM3oxM3cxM3oxMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L8K62iTDkzGX6/giphy.gif',
      imageAlign: 'right',
      imageWidth: '300',
      width: 'full',
    }
  },
  {
    type: ComponentType.TECH_STACK,
    category: 'advanced',
    label: 'Tech Stack',
    icon: 'Stack',
    description: 'Showcase your skills with badges.',
    defaultProps: {
      style: 'for-the-badge',
      technologies: ['TypeScript'],
      title: 'Tech Stack',
      titleIcon: '🛠️',
      width: 'full',
    }
  },
  {
    type: ComponentType.SOCIALS,
    category: 'advanced',
    label: 'Social Links',
    icon: 'ShareNetwork',
    description: 'Link to your other profiles.',
    defaultProps: {
      style: 'flat-square',
      items: [
        { platform: 'github', username: '' },
        { platform: 'twitter', username: '' }
      ],
      description: 'Connect with me',
      title: 'Connect with me',
      titleIcon: '🤝',
      width: 'full',
    }
  },
  {
    type: ComponentType.CORE_STATS,
    category: 'advanced',
    label: 'Core Stats',
    icon: 'ChartBar',
    description: 'General GitHub statistics (stars, commits, etc).',
    defaultProps: {
      theme: 'radical',
      hideBorder: true,
      showIcons: true,
      showRank: true,
      width: 'full',
    }
  },
  {
    type: ComponentType.STREAK_STATS,
    category: 'advanced',
    label: 'Streak Stats',
    icon: 'Fire',
    description: 'Display your GitHub contribution streak.',
    defaultProps: {
      theme: 'radical',
      hideBorder: true,
      width: 'full',
    }
  },
  {
    type: ComponentType.PROJECT_DEMO,
    category: 'advanced',
    label: 'Project Showcase',
    icon: 'PlayCircle',
    description: 'Showcase your projects in a grid.',
    defaultProps: {
      title: 'My Project',
      titleIcon: '🚀',
      projects: [
        { title: 'Project Demo', image: 'https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif', link: '' }
      ],
      width: 'full',
    }
  },
  {
    type: ComponentType.REPO_CARD,
    category: 'advanced',
    label: 'Repo Card',
    icon: 'GitFork',
    description: 'Showcase a specific repository.',
    defaultProps: {
      repo: '',
      theme: 'radical',
      hideBorder: true,
      titleIcon: '📂',
      width: 'full',
    }
  }
];

export const GITHUB_THEMES = [
  'default', 'dark', 'radical', 'merko', 'gruvbox', 'tokyonight', 'onedark', 'cobalt', 'synthwave', 'highcontrast', 'dracula', 'prussian', 'monokai', 'nightowl', 'solarized-light', 'solarized-dark'
];

export const BADGE_STYLES = [
  'flat', 'flat-square', 'for-the-badge', 'plastic', 'social'
];

export const SOCIAL_PLATFORMS = [
  { id: 'github', label: 'GitHub', color: '181717', logo: 'github' },
  { id: 'twitter', label: 'X', color: '000000', logo: 'x' },
  { id: 'linkedin', label: 'LinkedIn', color: '0A66C2', logo: 'linkedin' },
  { id: 'instagram', label: 'Instagram', color: 'E4405F', logo: 'instagram' },
  { id: 'facebook', label: 'Facebook', color: '1877F2', logo: 'facebook' },
  { id: 'youtube', label: 'YouTube', color: 'FF0000', logo: 'youtube' },
  { id: 'discord', label: 'Discord', color: '5865F2', logo: 'discord' },
  { id: 'twitch', label: 'Twitch', color: '9146FF', logo: 'twitch' },
  { id: 'medium', label: 'Medium', color: '12100E', logo: 'medium' },
  { id: 'devto', label: 'Dev.to', color: '0A0A0A', logo: 'devdotto' },
  { id: 'slack', label: 'Slack', color: '4A154B', logo: 'slack' },
  { id: 'stack-overflow', label: 'Stack Overflow', color: 'FE7A15', logo: 'stackoverflow' },
];
