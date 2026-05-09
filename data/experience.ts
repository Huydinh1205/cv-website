export type Experience = {
  company: string;
  role: string;
  period: string;
  location?: string;
  description: string;
  highlights: string[];
  tech?: string[];
};

export const experiences: Experience[] = [
  {
    company: "University of Technology Sydney",
    role: "Research Assistant",
    period: "Nov 2025 — Present",
    location: "Sydney, NSW",
    description:
      "Cross-area research role spanning data analysis, data preprocessing, and backend server modules for research projects. Currently exploring Vision-Language Models (VLM) and Generative Adversarial Networks (GAN).",
    highlights: [
      "Data analysis: cleaned and analysed noisy multi-source OCR datasets, ran iterative model experiments, translated findings into reproducible workflows",
      "Data preprocessing: built normalisation, cleaning, and feature-extraction pipelines for downstream modelling across multi-source datasets",
      "Backend server modules: contributed TCP, OBS WebSocket, and REST API layers for a game-research project enabling real-time messaging and programmatic control",
      "Currently researching Vision-Language Models and GANs — multimodal understanding and generative modelling experiments",
    ],
    tech: ["Python", "PyTorch", "Pandas", "NumPy", "FastAPI", "VLM", "GAN"],
  },
  {
    company: "Cambridge EduX Hackathon 2026",
    role: "Full-Stack / AI Engineer (Team of 4)",
    period: "2026",
    description:
      "Built CurricuLLM — a parent-teacher communication platform that uses LLMs to auto-generate personalised curriculum progress reports.",
    highlights: [
      "Built an AI pipeline that auto-generates personalised curriculum progress reports for parents from teacher input — removing manual report writing",
      "Developed a parent-facing AI chat interface for natural-language queries on student progress, served via FastAPI",
      "Implemented real-time multilingual translation to broaden accessibility for non-English-speaking families",
      "Contributed full-stack across React (component architecture, UI state) and FastAPI/PostgreSQL (REST API design, schema)",
    ],
    tech: ["TypeScript", "React", "FastAPI", "PostgreSQL", "LLMs"],
  },
];
