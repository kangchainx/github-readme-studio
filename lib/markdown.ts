import { ComponentInstance, ComponentType } from "../types";
import { TECH_COLORS } from "../data/techStack";
import { SOCIAL_PLATFORMS } from "../constants";

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
  AWS: "amazonwebservices",
  "Google Cloud": "googlecloud",
  Azure: "microsoftazure",
  HTML5: "html5",
  CSS3: "css3",
  "React Native": "react",
  "Microsoft SQL Server": "microsoftsqlserver",
  "VS Code": "visualstudiocode",
  "shadcn/ui": "shadcnui", // Custom slug handling if available, or fallback
  "Ant Design": "antdesign",
};

// Helper for badges
export const generateBadgeUrl = (tech: string, style: string) => {
  // 1. Handle Label
  const label = tech
    .replace(/-/g, "--")
    .replace(/_/g, "__")
    .replace(/\s/g, "%20");

  // 2. Handle Logo Slug
  let logoSlug =
    LOGO_MAP[tech] ||
    tech
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/\./g, "")
      .replace(/\//g, "");
  if (tech === "C") logoSlug = "c";

  // 3. Handle Colors
  const hexColor = TECH_COLORS[tech] || "20232a"; // Default to dark grey if unknown
  const safeBadgeColor = hexColor.replace("#", "");

  // 4. Smart Logo Color
  // For very light backgrounds (like JS yellow, Babel), use black logo. Otherwise white.
  // Simple heuristic: specific list of light-bg techs
  const lightBackgroundTechs = [
    "JavaScript",
    "Babel",
    "Firebase",
    "Linux",
    "Electron",
    "SQLite",
  ];
  const logoColor = lightBackgroundTechs.includes(tech) ? "black" : "white";

  return `https://img.shields.io/badge/${label}-${safeBadgeColor}?style=${style}&logo=${logoSlug}&logoColor=${logoColor}`;
};

// Internal renderer for individual component content
export const renderComponentContent = (
  component: ComponentInstance,
  globalUsername: string
): string => {
  const { type, props } = component;

  switch (type) {
    case ComponentType.HEADING: {
      const hashes = "#".repeat(props.level || 1);
      const level = props.level || 1;
      const align =
        props.align === "center"
          ? ' align="center"'
          : props.align === "right"
          ? ' align="right"'
          : "";
      if (align) {
        return `<h${level}${align}>${props.content}</h${level}>`;
      }
      return `${hashes} ${props.content}`;
    }

    case ComponentType.HEADER: {
      const align = props.align === "center" ? ' align="center"' : "";
      return `<h1${align}>${props.title}</h1>\n<p${align}>${props.subtitle}</p>`;
    }

    case ComponentType.TEXT:
      return `${props.content}`;

    case ComponentType.LIST: {
      const type = props.type || "unordered";
      return (props.items || [])
        .filter((item: string) => item.trim() !== "")
        .map((item: string, i: number) => {
          const actualPrefix = type === "ordered" ? `${i + 1}.` : "-";
          return `${actualPrefix} ${item}`;
        })
        .join("\n");
    }

    case ComponentType.BREAKER: {
      return props.variant === "line" ? "\n---\n" : "\n<br />\n";
    }

    case ComponentType.TEXT_WITH_IMAGE: {
      const img = `<div style="float: ${props.imageAlign === 'right' ? 'right' : 'left'}; width: ${props.imageWidth}px; margin-${props.imageAlign === 'right' ? 'left' : 'right'}: 20px;"><img src="${props.imageSrc}" width="100%" /></div>`;
      const txt = `<div><h3>${props.heading}</h3>\n<p>${props.content}</p></div>`;
      
      return `<div style="overflow: hidden;">\n${img}\n${txt}\n</div>`;
    }

    case ComponentType.PROJECT_DEMO: {
      const projects = props.projects || (props.gifUrl ? [{ title: 'Project Demo', image: props.gifUrl, link: '' }] : []);
      if (projects.length === 0) return '';
      
      const title = `### ${props.titleIcon ? props.titleIcon + ' ' : ''}${props.title || 'Project Showcase'}\n\n`;

      if (projects.length === 1) {
        const p = projects[0];
        const img = `<img src="${p.image}" alt="${p.title}" width="100%" />`;
        const content = p.link ? `<a href="${p.link}" target="_blank">${img}</a>` : img;
        return `${title}<div align="center">\n  ${content}\n</div>`;
      }

      // For multiple projects, use a table for better grid layout in GitHub Markdown
      // We will create rows of 2 items
      const rows = [];
      for (let i = 0; i < projects.length; i += 2) {
        rows.push(projects.slice(i, i + 2));
      }

      const tableRows = rows.map(row => {
        const cells = row.map((p: any) => {
          const img = `<img src="${p.image}" alt="${p.title}" width="100%" />`;
          const content = p.link ? `<a href="${p.link}" target="_blank">${img}</a>` : img;
          const caption = p.title ? `<br/><b>${p.title}</b>` : '';
          return `<td width="50%" align="center" valign="top">\n  ${content}${caption}\n</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('\n');

      return `${title}<table width="100%">\n${tableRows}\n</table>`;
    }

    case ComponentType.ABOUT_ME: {
      const title = `### ${props.titleIcon ? props.titleIcon + ' ' : ''}${props.title || 'About Me'}\n`;
      // Use the div-float layout strategy
      const imgStyle = `float: ${props.imageAlign === 'left' ? 'left' : 'right'}; width: ${props.imageWidth || '300'}px; margin-${props.imageAlign === 'left' ? 'right' : 'left'}: 20px;`;
      
      const imgHtml = (props.showImage !== false && props.imageSrc)
        ? `<div style="${imgStyle}"><img src="${props.imageSrc}" width="100%" alt="About Me" /></div>` 
        : '';
        
      const contenthtml = `<div>\n${props.content}\n</div>`;
      
      return `${title}<div style="overflow: hidden;">\n${imgHtml}\n${contenthtml}\n</div>`;
    }

    case ComponentType.CORE_STATS:
    case ComponentType.STREAK_STATS:
    case ComponentType.REPO_CARD: {
      if (!globalUsername) return "";
      const { theme, hideBorder, showIcons, showRank, repo } = props;
      const params = new URLSearchParams();
      let baseUrl = "";

      if (type === ComponentType.CORE_STATS) {
        baseUrl = "https://github-readme-stats.vercel.app/api";
        params.append("username", globalUsername);
        if (showIcons) params.append("show_icons", "true");
        if (showRank) params.append("show_rank", "true");
      } else if (type === ComponentType.STREAK_STATS) {
        baseUrl = "https://github-readme-streak-stats.herokuapp.com/";
        params.append("user", globalUsername);
      } else if (type === ComponentType.REPO_CARD) {
        baseUrl = "https://github-readme-stats.vercel.app/api/pin/";
        params.append("username", globalUsername);
        params.append("repo", repo || "github-readme-studio");
      }

      if (theme) params.append("theme", theme);
      if (hideBorder) params.append("hide_border", "true");

      return `<div align="center">\n  <img src="${baseUrl}?${params.toString()}" alt="GitHub Stats" />\n</div>`;
    }

    case ComponentType.TECH_STACK: {
      const badges = (props.technologies || [])
        .map((tech: string) => {
          const badgeUrl = generateBadgeUrl(
            tech,
            props.style || "for-the-badge"
          );
          return `<img src="${badgeUrl}" alt="${tech}" />`;
        })
        .join(" ");
      return `### ${props.titleIcon ? props.titleIcon + ' ' : ''}${props.title || 'Tech Stack'}\n\n<p align="center">\n  ${badges}\n</p>`;
    }

    case ComponentType.SOCIALS: {
      const links = (props.items || [])
        .filter((item: any) => item.username)
        .map((item: any) => {
          const platformId = (item.platform || "").toLowerCase();
          const platformConfig = SOCIAL_PLATFORMS.find(
            (p) => p.id.toLowerCase() === platformId
          ) || { label: item.platform, color: "181717", logo: platformId };

          const badgeUrl = `https://img.shields.io/badge/-${encodeURIComponent(
            platformConfig.label
          )}-${platformConfig.color}?style=${
            props.style
          }&logo=${platformConfig.logo.toLowerCase()}&logoColor=white`;

          let profileUrl = item.username;
          if (!profileUrl.startsWith("http")) {
            const domains: Record<string, string> = {
              twitter: "x.com",
              devto: "dev.to",
              "stack-overflow": "stackoverflow.com/users",
            };
            const domain = domains[platformId] || `${platformId}.com`;
            profileUrl = `https://${domain}/${item.username}`;
          }

          return `<a href="${profileUrl}" target="_blank"><img src="${badgeUrl}" alt="${item.platform}" /></a>`;
        })
        .join(" ");

      const titleMarkdown = props.title ? `### ${props.titleIcon ? props.titleIcon + ' ' : ''}${props.title}\n\n` : "";
      return `${titleMarkdown}<p align="center">\n  ${links}\n</p>`;
    }

    case ComponentType.IMAGE: {
      const imgAlign = props.align === "center" ? ' align="center"' : "";
      return `<div${imgAlign}>\n  <img src="${props.src}" alt="${props.alt}" width="${props.width}" />\n</div>`;
    }

    case ComponentType.MARKDOWN:
      return `${props.markdown}`;

    case ComponentType.BLOCKQUOTE:
      return `> ${props.content}`;

    case ComponentType.CODE_BLOCK:
      return `\`\`\`${props.language || ""}\n${props.code}\n\`\`\``;

    case ComponentType.LINK:
      return `[${props.label || props.url}](${props.url})`;

    case ComponentType.IMAGE_LINK:
      if (props.align === "center") {
        return `<div align="center">\n  <a href="${props.url}">\n    <img src="${props.src}" alt="${props.alt}" width="100%" />\n  </a>\n</div>`;
      }
      return `[![${props.alt}](${props.src})](${props.url})`;

    case ComponentType.TABLE: {
      const headers = (props.headers || []) as string[];
      const rows = (props.rows || []) as string[][];
      if (headers.length === 0) return "";

      const headerRow = `| ${headers.join(" | ")} |`;
      const separatorRow = `| ${headers.map(() => "---").join(" | ")} |`;
      const bodyRows = rows.map((row) => `| ${row.join(" | ")} |`).join("\n");

      return `${headerRow}\n${separatorRow}\n${bodyRows}`;
    }

    case ComponentType.DETAILS:
      return `<details>\n<summary>${props.summary}</summary>\n\n${props.content}\n\n</details>`;

    case ComponentType.BADGE: {
      const { label, message, color, style, logo, logoColor, link } = props;
      const url = `https://img.shields.io/badge/${encodeURIComponent(
        label || ""
      )}-${encodeURIComponent(
        message || ""
      )}-${color}?style=${style}&logo=${logo}&logoColor=${
        logoColor || "white"
      }`;
      const imgMd = `![${label}](${url})`;
      if (link) return `[${imgMd}](${link})`;
      return imgMd;
    }

    case ComponentType.SVG:
      return `<div align="center">\n  <img src="${props.src}" alt="${props.alt}" width="${props.width}" />\n</div>`;

    default:
      return "";
  }
};

export const generateMarkdown = (
  components: ComponentInstance[],
  globalUsername: string = ""
): string => {
  let markdown = "";

  for (let i = 0; i < components.length; i++) {
    const component = components[i];
    const width =
      component.type === ComponentType.IMAGE
        ? component.props.widthMode || "full"
        : component.props.width || "full";

    let currentBlock = "";

    if (width === "half") {
      const content1 = renderComponentContent(component, globalUsername);
      const nextComponent = components[i + 1];
      const nextWidth = nextComponent
        ? nextComponent.type === ComponentType.IMAGE
          ? nextComponent.props.widthMode || "full"
          : nextComponent.props.width || "full"
        : "full";

      if (nextComponent && nextWidth === "half") {
        const content1 = renderComponentContent(component, globalUsername);
        const content2 = renderComponentContent(nextComponent, globalUsername);

        // Use HTML aligning for side-by-side layout without tables to avoid borders
        // We use two floating divs
        currentBlock = `
<div style="width: 100%; overflow: hidden;">
  <div style="float: left; width: 48%;">

${content1}

  </div>
  <div style="float: right; width: 48%;">

${content2}

  </div>
</div>
`;
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
