import { ComponentDefinition, ComponentType } from './types';

export const COMPONENT_DEFINITIONS: ComponentDefinition[] = [
  {
    type: ComponentType.HEADER,
    category: 'basic',
    label: 'Header / Hero',
    icon: 'TextH',
    description: 'Main title and introduction with a wave animation.',
    defaultProps: {
      title: "Hi there, I'm John Doe 👋",
      subtitle: "A passionate frontend engineer from New York.",
      align: 'left',
      width: 'full', // 'full' or 'half'
    }
  },
  {
    type: ComponentType.TEXT_WITH_IMAGE,
    category: 'advanced',
    label: 'Text / Image',
    icon: 'Article',
    description: 'Text block side-by-side with an image or GIF.',
    defaultProps: {
      heading: 'About Me',
      content: 'Write something about yourself here. This layout is great for introducing yourself alongside a profile picture or a funny GIF.',
      imageSrc: 'https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif',
      imageAlign: 'right',
      imageWidth: '200',
      width: 'full',
    }
  },
  {
    type: ComponentType.PROJECT_DEMO,
    category: 'advanced',
    label: 'Project Demo',
    icon: 'PlayCircle',
    description: 'Centered GIF showcase with a preset layout.',
    defaultProps: {
      gifUrl: 'https://media.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif',
      width: 'full',
    }
  },
  {
    type: ComponentType.STATS,
    category: 'advanced',
    label: 'GitHub Stats',
    icon: 'ChartBar',
    description: 'Display dynamic GitHub statistics, streaks, and languages.',
    defaultProps: {
      variant: 'stats', // 'stats', 'streak', 'languages'
      useGlobalUsername: true,
      username: '', // Local override
      showIcons: true,
      theme: 'radical',
      hideBorder: true,
      showRank: true,
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
      style: 'for-the-badge', // flat, flat-square, for-the-badge, plastic, social
      technologies: ['TypeScript'], // Default to only TypeScript
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
        { platform: 'twitter', username: 'twitter' },
        { platform: 'linkedin', username: 'linkedin' }
      ],
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
      widthMode: 'full', // renamed prop to avoid conflict with image width attribute
    }
  },
  {
    type: ComponentType.MARKDOWN,
    category: 'basic',
    label: 'Raw Markdown',
    icon: 'Code',
    description: 'Write custom markdown directly.',
    defaultProps: {
      markdown: '### Custom Section\n\n- Item 1\n- Item 2',
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
