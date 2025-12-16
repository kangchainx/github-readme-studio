import { ComponentInstance, ComponentType } from '../types';
import { TECH_COLORS } from '../data/techStack';

// Map display names to Simple Icons slugs if they differ significantly
const LOGO_MAP: Record<string, string> = {
  "C++": "cplusplus",
  "C#": "csharp",
  ".NET": "dotnet",
  "Vue.js": "vuedotjs",
  "Nuxt.js": "nuxtdotjs",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  "Three.js": "threedotjs",
  "D3.js": "d3dotjs",
  "AWS": "amazonwebservices",
  "Google Cloud": "googlecloud",
  "Azure": "microsoftazure",
  "HTML5": "html5",
  "CSS3": "css3",
  "React Native": "react",
  "Microsoft SQL Server": "microsoftsqlserver",
  "VS Code": "visualstudiocode",
  "shadcn/ui": "shadcnui", // Custom slug handling if available, or fallback
  "Ant Design": "antdesign"
};

// Helper for badges
export const generateBadgeUrl = (tech: string, style: string) => {
  // 1. Handle Label
  const label = tech.replace(/-/g, '--').replace(/_/g, '__').replace(/\s/g, '%20');

  // 2. Handle Logo Slug
  let logoSlug = LOGO_MAP[tech] || tech.toLowerCase().replace(/\s+/g, '').replace(/\./g, '').replace(/\//g, '');
  if (tech === "C") logoSlug = "c";

  // 3. Handle Colors
  const hexColor = TECH_COLORS[tech] || '20232a'; // Default to dark grey if unknown
  const safeBadgeColor = hexColor.replace('#', '');

  // 4. Smart Logo Color
  // For very light backgrounds (like JS yellow, Babel), use black logo. Otherwise white.
  // Simple heuristic: specific list of light-bg techs
  const lightBackgroundTechs = ['JavaScript', 'Babel', 'Firebase', 'Linux', 'Electron', 'SQLite'];
  const logoColor = lightBackgroundTechs.includes(tech) ? 'black' : 'white';

  return `https://img.shields.io/badge/${label}-${safeBadgeColor}?style=${style}&logo=${logoSlug}&logoColor=${logoColor}`;
};

// Internal renderer for individual component content
export const renderComponentContent = (component: ComponentInstance, globalUsername: string): string => {
  const { type, props } = component;

  switch (type) {
    case ComponentType.HEADER: {
      const align = props.align === 'center' ? ' align="center"' : '';
      return `<h1${align}>${props.title}</h1>\n<p${align}>${props.subtitle}</p>`;
    }

    case ComponentType.TEXT:
      return `${props.content}`;

    case ComponentType.TEXT_WITH_IMAGE: {
      const img = `<img src="${props.imageSrc}" width="${props.imageWidth}" />`;
      const txt = `<h3>${props.heading}</h3>\n<p>${props.content}</p>`;
      if (props.imageAlign === 'left') {
        return `<table><tr><td valign="top" width="50%">${img}</td><td valign="top" width="50%">${txt}</td></tr></table>`;
      } else {
        return `<table><tr><td valign="top" width="50%">${txt}</td><td valign="top" width="50%">${img}</td></tr></table>`;
      }
    }

    case ComponentType.STATS: {
      const targetUsername = (props.useGlobalUsername && globalUsername) ? globalUsername : (props.username || 'github');
      const { theme, hideBorder, showIcons, showRank, variant } = props;
      
      if (!targetUsername) return ''; 

      const params = new URLSearchParams();
      if (variant === 'streak') {
         params.append('user', targetUsername);
      } else {
         params.append('username', targetUsername);
      }
      
      if (theme) params.append('theme', theme);
      if (hideBorder) params.append('hide_border', 'true');
      
      let baseUrl = 'https://github-readme-stats.vercel.app/api';
      if (variant === 'languages') {
        baseUrl = 'https://github-readme-stats.vercel.app/api/top-langs/';
        params.append('layout', 'compact');
      } else if (variant === 'streak') {
        baseUrl = 'https://github-readme-streak-stats.herokuapp.com/';
      } else {
         if (showIcons) params.append('show_icons', 'true');
         if (showRank) params.append('show_rank', 'true');
      }
      
      return `<div align="center">\n  <img src="${baseUrl}?${params.toString()}" alt="GitHub Stats" />\n</div>`;
    }

    case ComponentType.TECH_STACK: {
       const badges = (props.technologies || [])
         .map((tech: string) => `![${tech}](${generateBadgeUrl(tech, props.style || 'for-the-badge')})`)
         .join(' ');
       return `### Tech Stack\n\n${badges}`;
    }

    case ComponentType.SOCIALS: {
      const links = (props.items || [])
        .map((item: any) => `[<img src="https://img.shields.io/badge/${item.platform}-181717?style=${props.style}&logo=${item.platform}&logoColor=white" />](https://${item.platform}.com/${item.username})`)
        .join(' ');
      return `<div align="center">\n  ${links}\n</div>`;
    }

    case ComponentType.IMAGE: {
      const imgAlign = props.align === 'center' ? ' align="center"' : '';
      return `<div${imgAlign}>\n  <img src="${props.src}" alt="${props.alt}" width="${props.width}" />\n</div>`;
    }

    case ComponentType.MARKDOWN:
      return `${props.markdown}`;

    default:
      return '';
  }
};

export const generateMarkdown = (components: ComponentInstance[], globalUsername: string = '', showSeparators: boolean = true): string => {
  let markdown = '';
  
  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const width = component.type === ComponentType.IMAGE ? (component.props.widthMode || 'full') : (component.props.width || 'full');

    let currentBlock = '';

    if (width === 'half') {
      const content1 = renderComponentContent(component, globalUsername);
      const nextComponent = components[i + 1];
      const nextWidth = nextComponent 
        ? (nextComponent.type === ComponentType.IMAGE ? (nextComponent.props.widthMode || 'full') : (nextComponent.props.width || 'full'))
        : 'full';

      if (nextComponent && nextWidth === 'half') {
        const content2 = renderComponentContent(nextComponent, globalUsername);
        currentBlock = `\n<table>\n  <tr>\n    <td valign="top" width="50%">\n\n${content1}\n\n</td>\n    <td valign="top" width="50%">\n\n${content2}\n\n</td>\n  </tr>\n</table>\n`;
        i++;
      } else {
        currentBlock = `\n${content1}\n`;
      }
    } else {
      currentBlock = `\n${renderComponentContent(component, globalUsername)}\n<br />\n`;
    }

    markdown += currentBlock;

    if (showSeparators && i < components.length - 1) {
       markdown += '\n---\n';
    }
  }

  return markdown;
};
