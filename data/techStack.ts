export const TECH_CATEGORIES: Record<string, string[]> = {
  "Languages": [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C", "C#", "Go", "Rust", "Swift", "Kotlin", 
    "PHP", "Ruby", "Dart", "HTML5", "CSS3", "Sass", "Assembly", "R", "Lua", "Scala", "Perl", "Elixir", "Haskell"
  ],
  "Frontend": [
    "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "TailwindCSS", "Bootstrap", 
    "Material UI", "Chakra UI", "Redux", "Webpack", "Vite", "Babel", "jQuery", "Three.js", "D3.js", "shadcn/ui", "Ant Design"
  ],
  "Backend": [
    "Node.js", "Express.js", "NestJS", "Django", "Flask", "FastAPI", "Spring Boot", "Laravel", 
    "Rails", "ASP.NET", "GraphQL", "Apollo", "Socket.io", "Kafka", "RabbitMQ", "Nginx", "Apache"
  ],
  "Mobile & Desktop": [
    "Flutter", "React Native", "Android", "iOS", "Electron", "Tauri", "Unity", "Unreal Engine", "Xamarin", "Ionic"
  ],
  "Database": [
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "MariaDB", "Supabase", "Firebase", 
    "DynamoDB", "Cassandra", "Neo4j", "Oracle", "Microsoft SQL Server", "Prisma"
  ],
  "DevOps & Cloud": [
    "Docker", "Kubernetes", "AWS", "Google Cloud", "Azure", "DigitalOcean", "Heroku", "Vercel", 
    "Netlify", "Cloudflare", "Jenkins", "GitLab CI", "GitHub Actions", "Terraform", "Ansible", "Linux", "Bash"
  ],
  "Tools & AI": [
    "Git", "GitHub", "GitLab", "Bitbucket", "Postman", "Figma", "Adobe XD", "Photoshop", 
    "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit Learn", "OpenCV", "Jupyter", "VS Code", "IntelliJ IDEA"
  ]
};

// Flattened list for search
export const ALL_TECHS = Object.values(TECH_CATEGORIES).flat();

// Brand Colors for beautiful defaults
export const TECH_COLORS: Record<string, string> = {
  // Languages
  "JavaScript": "F7DF1E",
  "TypeScript": "3178C6",
  "Python": "3776AB",
  "Java": "007396",
  "C++": "00599C",
  "C": "A8B9CC",
  "C#": "239120",
  "Go": "00ADD8",
  "Rust": "000000",
  "Swift": "F05138",
  "Kotlin": "7F52FF",
  "PHP": "777BB4",
  "Ruby": "CC342D",
  "Dart": "0175C2",
  "HTML5": "E34F26",
  "CSS3": "1572B6",
  "Sass": "CC6699",
  "R": "276DC3",
  "Lua": "2C2D72",
  "Scala": "DC322F",
  "Perl": "39457E",
  "Haskell": "5D4F85",

  // Frontend
  "React": "61DAFB",
  "Vue.js": "4FC08D",
  "Angular": "DD0031",
  "Svelte": "FF3E00",
  "Next.js": "000000",
  "Nuxt.js": "00C58E",
  "TailwindCSS": "06B6D4",
  "Bootstrap": "7952B3",
  "Material UI": "007FFF",
  "Chakra UI": "319795",
  "Redux": "764ABC",
  "Webpack": "8DD6F9",
  "Vite": "646CFF",
  "Babel": "F9DC3E",
  "jQuery": "0769AD",
  "Three.js": "000000",
  "D3.js": "F9A03C",
  "shadcn/ui": "000000",
  "Ant Design": "0170FE",

  // Backend
  "Node.js": "339933",
  "Express.js": "000000",
  "NestJS": "E0234E",
  "Django": "092E20",
  "Flask": "000000",
  "FastAPI": "009688",
  "Spring Boot": "6DB33F",
  "Laravel": "FF2D20",
  "Rails": "CC0000",
  "ASP.NET": "512BD4",
  "GraphQL": "E10098",
  "Apollo": "311C87",
  "Socket.io": "010101",
  "Nginx": "009639",
  "Apache": "D22128",

  // Mobile
  "Flutter": "02569B",
  "React Native": "61DAFB",
  "Android": "3DDC84",
  "iOS": "000000",
  "Electron": "47848F",
  "Tauri": "24C8DB",
  "Unity": "000000",
  "Unreal Engine": "0E1128",

  // Database
  "PostgreSQL": "4169E1",
  "MySQL": "4479A1",
  "MongoDB": "47A248",
  "Redis": "DC382D",
  "SQLite": "003B57",
  "MariaDB": "003545",
  "Supabase": "3ECF8E",
  "Firebase": "FFCA28",
  "DynamoDB": "4053D6",
  "Cassandra": "1287B1",
  "Oracle": "F80000",
  "Prisma": "2D3748",

  // DevOps
  "Docker": "2496ED",
  "Kubernetes": "326CE5",
  "AWS": "232F3E",
  "Google Cloud": "4285F4",
  "Azure": "0078D4",
  "DigitalOcean": "0080FF",
  "Heroku": "430098",
  "Vercel": "000000",
  "Netlify": "00C7B7",
  "Cloudflare": "F38020",
  "Jenkins": "D24939",
  "GitLab CI": "FC6D26",
  "GitHub Actions": "2088FF",
  "Terraform": "7B42BC",
  "Ansible": "EE0000",
  "Linux": "FCC624",
  "Bash": "4EAA25",

  // Tools
  "Git": "F05032",
  "GitHub": "181717",
  "GitLab": "FC6D26",
  "Bitbucket": "0052CC",
  "Postman": "FF6C37",
  "Figma": "F24E1E",
  "TensorFlow": "FF6F00",
  "PyTorch": "EE4C2C",
  "VS Code": "007ACC",
  "IntelliJ IDEA": "000000"
};