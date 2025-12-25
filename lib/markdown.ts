import { ComponentInstance, ComponentType } from '../types';
import { TECH_COLORS } from '../data/techStack';
import { SOCIAL_PLATFORMS } from '../constants';

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
    case ComponentType.HEADING: {
      const hashes = '#'.repeat(props.level || 1);
      const level = props.level || 1;
      const align = props.align === 'center' ? ' align="center"' : props.align === 'right' ? ' align="right"' : '';
      if (align) {
        return `<h${level}${align}>${props.content}</h${level}>`;
      }
      return `${hashes} ${props.content}`;
    }

    case ComponentType.HEADER: {
      const align = props.align === 'center' ? ' align="center"' : '';
      return `<h1${align}>${props.title}</h1>\n<p${align}>${props.subtitle}</p>`;
    }

    case ComponentType.TEXT:
      return `${props.content}`;

    case ComponentType.LIST: {
      const type = props.type || 'unordered';
      return (props.items || [])
        .filter((item: string) => item.trim() !== '')
        .map((item: string, i: number) => {
          const actualPrefix = type === 'ordered' ? `${i + 1}.` : '-';
          return `${actualPrefix} ${item}`;
        })
        .join('\n');
    }

    case ComponentType.BREAKER: {
      return props.variant === 'line' ? '\n---\n' : '\n<br />\n';
    }


    case ComponentType.TEXT_WITH_IMAGE: {
      const img = `<img src="${props.imageSrc}" width="${props.imageWidth}" />`;
      const txt = `<h3>${props.heading}</h3>\n<p>${props.content}</p>`;
      if (props.imageAlign === 'left') {
        return `<table><tr><td valign="top" width="50%">${img}</td><td valign="top" width="50%">${txt}</td></tr></table>`;
      } else {
        return `<table><tr><td valign="top" width="50%">${txt}</td><td valign="top" width="50%">${img}</td></tr></table>`;
      }
    }

    case ComponentType.PROJECT_DEMO: {
      if (!props.gifUrl) return '';
      return `### ${props.title || 'Project Demo'}\n\n<div align="center">\n  <img src="${props.gifUrl}" alt="Project Demo" width="100%" />\n</div>`;
    }

    case ComponentType.CORE_STATS:
    case ComponentType.STREAK_STATS:
    case ComponentType.REPO_CARD: {
      if (!globalUsername) return '';
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
      
      return `<div align="center">\n  <img src="${baseUrl}?${params.toString()}" alt="GitHub Stats" />\n</div>`;
    }

    case ComponentType.TECH_STACK: {
       const badges = (props.technologies || [])
         .map((tech: string) => {
           const badgeUrl = generateBadgeUrl(tech, props.style || 'for-the-badge');
           return `<img src="${badgeUrl}" alt="${tech}" />`;
         })
         .join(' ');
       return `### Tech Stack\n\n<p align="center">\n  ${badges}\n</p>`;
    }

    case ComponentType.SOCIALS: {
      const links = (props.items || [])
        .filter((item: any) => item.username)
        .map((item: any) => {
          const platformId = (item.platform || '').toLowerCase();
          const platformConfig = SOCIAL_PLATFORMS.find(p => p.id.toLowerCase() === platformId) || 
                                { label: item.platform, color: '181717', logo: platformId };
          
          const badgeUrl = `https://img.shields.io/badge/-${encodeURIComponent(platformConfig.label)}-${platformConfig.color}?style=${props.style}&logo=${platformConfig.logo.toLowerCase()}&logoColor=white`;
          
          let profileUrl = item.username;
          if (!profileUrl.startsWith('http')) {
             const domains: Record<string, string> = { 'twitter': 'x.com', 'devto': 'dev.to', 'stack-overflow': 'stackoverflow.com/users' };
             const domain = domains[platformId] || `${platformId}.com`;
             profileUrl = `https://${domain}/${item.username}`;
          }
          
          return `<a href="${profileUrl}" target="_blank"><img src="${badgeUrl}" alt="${item.platform}" /></a>`;
        })
        .join(' ');
      
      const titleMarkdown = props.title ? `### ${props.title}\n\n` : '';
      return `${titleMarkdown}<p align="center">\n  ${links}\n</p>`;
    }

    case ComponentType.IMAGE: {
      const imgAlign = props.align === 'center' ? ' align="center"' : '';
      return `<div${imgAlign}>\n  <img src="${props.src}" alt="${props.alt}" width="${props.width}" />\n</div>`;
    }

    case ComponentType.MARKDOWN:
      return `${props.markdown}`;

    case ComponentType.BLOCKQUOTE:
      return `> ${props.content}`;

    case ComponentType.CODE_BLOCK:
      return `\`\`\`${props.language || ''}\n${props.code}\n\`\`\``;

    case ComponentType.LINK:
      return `[${props.label || props.url}](${props.url})`;

    case ComponentType.IMAGE_LINK:
      if (props.align === 'center') {
        return `<div align="center">\n  <a href="${props.url}">\n    <img src="${props.src}" alt="${props.alt}" width="100%" />\n  </a>\n</div>`;
      }
      return `[![${props.alt}](${props.src})](${props.url})`;

    case ComponentType.TABLE: {
      const headers = (props.headers || []) as string[];
      const rows = (props.rows || []) as string[][];
      if (headers.length === 0) return '';
      
      const headerRow = `| ${headers.join(' | ')} |`;
      const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
      const bodyRows = rows.map(row => `| ${row.join(' | ')} |`).join('\n');
      
      return `${headerRow}\n${separatorRow}\n${bodyRows}`;
    }

    case ComponentType.DETAILS:
      return `<details>\n<summary>${props.summary}</summary>\n\n${props.content}\n\n</details>`;

    case ComponentType.BADGE: {
      const { label, message, color, style, logo, logoColor, link } = props;
      const url = `https://img.shields.io/badge/${encodeURIComponent(label || '')}-${encodeURIComponent(message || '')}-${color}?style=${style}&logo=${logo}&logoColor=${logoColor || 'white'}`;
      const imgMd = `![${label}](${url})`;
      if (link) return `[${imgMd}](${link})`;
      return imgMd;
    }

    case ComponentType.SVG:
      return `<div align="center">\n  <img src="${props.src}" alt="${props.alt}" width="${props.width}" />\n</div>`;

    default:
      return '';
  }
};

export const generateMarkdown = (components: ComponentInstance[], globalUsername: string = ''): string => {
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
      currentBlock = `\n${renderComponentContent(component, globalUsername)}\n`;
    }

    markdown += currentBlock;
  }

  return markdown;
};
