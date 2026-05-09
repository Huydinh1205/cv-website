export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Programming Languages",
    items: ["Python", "C++", "JavaScript", "TypeScript", "HTML/CSS"],
  },
  {
    category: "AI / Machine Learning",
    items: [
      "PyTorch",
      "scikit-learn",
      "LangChain",
      "NLP",
      "LLMs",
      "Data Cleaning",
      "Feature Extraction",
    ],
  },
  {
    category: "Frameworks & Libraries",
    items: ["Flask", "FastAPI", "Express.js", "React", "Node.js", "Pandas", "NumPy"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "Redis"],
  },
  {
    category: "Tools & Platforms",
    items: ["Docker", "Git", "Jupyter", "VS Code", "AWS (planned)"],
  },
  {
    category: "Protocols & Integration",
    items: ["TCP/IP", "OBS WebSocket", "REST APIs", "JWT Authentication"],
  },
];
