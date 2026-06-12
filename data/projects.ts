export type ProjectCategory = "ai" | "software" | "data";

export const categoryMeta: Record<
  ProjectCategory,
  { label: string; short: string; description: string }
> = {
  ai: {
    label: "AI / Machine Learning",
    short: "AI",
    description:
      "Deep learning, LLMs, vision-language models, and research projects.",
  },
  software: {
    label: "Software Engineering",
    short: "Software",
    description:
      "Backend modules, full-stack applications, and frontend portfolios.",
  },
  data: {
    label: "Data & Analytics",
    short: "Data",
    description:
      "Exploratory data analysis, preprocessing pipelines, and statistical modelling.",
  },
};

export type Project = {
  name: string;
  categories: ProjectCategory[];
  description: string;
  tech: string[];
  metrics?: string[];
  image?: string;
  links: {
    demo?: string;
    github?: string | string[];
    paper?: string;
  };
  featured?: boolean;
  status?: "in-progress";
  repoVisibility?: "private" | "local";
};

export const projects: Project[] = [
  {
    name: "Transformer Chatbot from Scratch",
    categories: ["ai"],
    description:
      "Decoder-only transformer built from scratch in PyTorch + Lightning — custom tokenizer, causal masking, temperature sampling. Powers the chatbot widget on this site (deployed on Hugging Face Spaces).",
    tech: ["PyTorch", "Lightning", "FastAPI", "Hugging Face Spaces"],
    metrics: [
      "4 decoder blocks · d_model=256 · 4 attention heads",
      "Word-level vocab trained on 40 intent classes",
      "Live in production — served from HF Spaces Docker",
    ],
    links: {
      github: "https://github.com/Huydinh1205/LSTM-chatbot",
    },
    featured: true,
  },
  {
    name: "AI-Powered Coffee Shop Manager Dashboard",
    categories: ["software", "ai"],
    description:
      "End-to-end AI briefing system delivering automated morning reports — revenue trends, inventory forecasting, scheduled daily reports. Single LangChain pipeline integrating four AI capabilities. Redis caching for repeated queries; containerised with Docker.",
    tech: ["Python", "LangChain", "Redis", "Docker", "AWS"],
    links: {},
    featured: true,
    repoVisibility: "private",
  },
  {
    name: "CurricuLLM — Parent-Teacher AI Platform",
    categories: ["software", "ai"],
    description:
      "Cambridge EduX Hackathon 2026. AI pipeline that auto-generates personalised curriculum reports for parents. Parent-facing chat interface for natural-language student progress queries; real-time multilingual translation. Team project under the VAHPEM organisation.",
    tech: ["TypeScript", "React", "FastAPI", "PostgreSQL", "LLMs"],
    links: {
      github: "https://github.com/VAHPEM/AI_Parent-Teacher_Bridge",
    },
    featured: true,
  },
  {
    name: "Personal Portfolio Site (this website)",
    categories: ["software"],
    description:
      "Multi-page Next.js portfolio with embedded transformer chatbot. Routes for resume, projects, research, contact. Resend-powered contact form. Dark mode, responsive layout, route-based active navigation. Chatbot backend is a separate FastAPI service on Hugging Face Spaces.",
    tech: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "Framer Motion",
      "Resend",
      "FastAPI",
    ],
    metrics: [
      "Live in production at cv-website-lemon.vercel.app",
      "App Router with shared layout for navbar / footer / chatbot widget",
      "Chatbot served from HF Spaces Docker — proxied via Next.js API route",
    ],
    links: {
      demo: "https://cv-website-lemon.vercel.app",
      github: "https://github.com/Huydinh1205/cv-website",
    },
    featured: true,
  },
  {
    name: "Game Automation & Streaming Tool",
    categories: ["software"],
    description:
      "Backend modules for a real-time game-automation tool. TCP layer for client-server messaging; OBS WebSocket integration to react to live stream events; REST API exposing keyboard/mouse triggers. Spans two repos — main app and the standalone TCP server/client.",
    tech: ["Python", "Flask", "FastAPI", "TCP", "OBS WebSocket"],
    links: {
      github: [
        "https://github.com/Huydinh1205/dota2",
        "https://github.com/Huydinh1205/tcp_server_client",
      ],
    },
  },
  {
    name: "E-Commerce Web Application",
    categories: ["software"],
    description:
      "Full-stack solo project — product listing, search/filter, cart, checkout with order management. JWT auth (register/login/protected routes) with bcrypt; normalised PostgreSQL schema (3NF).",
    tech: ["React", "Express.js", "Node.js", "PostgreSQL", "JWT"],
    links: {
      github: "https://github.com/Huydinh1205/Supermarket-main",
    },
  },
  {
    name: "ML Models from Scratch",
    categories: ["ai"],
    description:
      "Implemented regression and classification algorithms from first principles — no scikit-learn shortcuts. Gradient descent, regularisation, bias-variance trade-off analysis.",
    tech: ["Python", "NumPy"],
    links: {},
    repoVisibility: "local",
  },
  {
    name: "Frontend Projects",
    categories: ["software"],
    description:
      "React Tic-Tac-Toe (with move history + undo, deployed on Netlify), React Music Player, React Weather App. Plus pure HTML/CSS/JS clones of Steam-style marketplace and job-search UIs.",
    tech: ["React", "JavaScript", "HTML", "CSS"],
    links: {
      github: "https://github.com/Huydinh1205/tic-tac-toe",
    },
  },
  {
    name: "Game Telemetry Data Analysis",
    categories: ["data"],
    description:
      "Exploratory data analysis on competitive-game telemetry — cleaning, feature engineering, and statistical analysis of player behaviour and match outcomes. Visualised performance trends and outlier patterns to surface actionable insights.",
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    links: {
      github: "https://github.com/Huydinh1205/analysis_dota2",
    },
  },
  {
    name: "OCR Preprocessing Pipeline",
    categories: ["data"],
    description:
      "Image preprocessing pipeline for OCR — adaptive thresholding, denoising, deskewing, and contrast enhancement. Benchmarked downstream OCR accuracy across preprocessing configurations to identify the strongest pipeline for noisy real-world inputs.",
    tech: ["Python", "OpenCV", "NumPy", "PaddleOCR"],
    links: {
      github: "https://github.com/Huydinh1205/paddleOCR_comerdata",
    },
  },
  {
    name: "Housing Price Data Analysis",
    categories: ["data"],
    description:
      "Coursework project for Intro to Data Analysis. EDA, missing-value handling, and statistical modelling on a housing dataset to identify the strongest predictors of price. Hypothesis testing, correlation analysis, and regression diagnostics.",
    tech: ["Python", "Pandas", "scikit-learn", "Matplotlib"],
    links: {},
    repoVisibility: "local",
  },
  {
    name: "Smart Parking & Intelligent Traffic Management",
    categories: ["ai"],
    description:
      "Full ALPR pipeline targeting international publication — YOLOv11-OBB plate detection, PARSEQ transformer OCR, ByteTrack temporal voting, and Zero-DCE++ low-light enhancement. Robustness benchmarked across CCPD2020 subsets (blur, tilt, night) with a Streamlit dashboard for real-time violation detection. Team lead (ML).",
    tech: ["PyTorch", "Ultralytics YOLO", "PARSEQ", "ByteTrack", "Streamlit"],
    metrics: [
      "Team lead — 3 members, 5 ablation configs across detector + OCR axes",
      "Robustness benchmark on 6 CCPD2020 subsets (base, blur, tilt, rain, night, challenge)",
      "Targeting international vision venue · 2026",
    ],
    links: {},
    featured: true,
    status: "in-progress",
    repoVisibility: "private",
  },
  {
    name: "Dynamic Graph Learning for Esports Win Prediction",
    categories: ["ai"],
    description:
      "Research project (target: top-tier ML venue). Real-time win-probability model that treats each minute of a competitive match as a dynamic graph. Details under wraps pending paper submission.",
    tech: ["PyTorch", "PyTorch Geometric", "Python"],
    metrics: [
      "Dynamic heterogeneous graph: 10 player nodes + kill / teamfight edges with temporal decay",
      "GAT + GRU architecture · per-minute win-probability curve",
      "Targeting AAAI / WWW Applied ML · in preparation",
    ],
    links: {},
    status: "in-progress",
    repoVisibility: "private",
  },
  {
    name: "Set-of-Mark Visual Prompting for Tactical Soccer Understanding",
    categories: ["ai"],
    description:
      "Research project (target: DICTA 2026). Training-free recipe that overlays detector marks (numbered player boxes, team colours, ball markers) onto soccer broadcast frames so a VLM can reason about possession, open space, passing lanes, and pressing. Includes a Tactical-QA benchmark and ablation against an oracle ceiling from SoccerNet GSR. Details under wraps pending paper submission.",
    tech: ["PyTorch", "Gemini", "Qwen2.5-VL", "YOLO", "OpenCV"],
    metrics: [
      "Training-free — runs on a T4 GPU with off-the-shelf YOLO + VLM API",
      "Tactical-QA benchmark across 6 question types · McNemar + Cohen's κ rigour",
      "Targeting DICTA 2026 · in preparation",
    ],
    links: {},
    status: "in-progress",
    repoVisibility: "private",
  },
];
