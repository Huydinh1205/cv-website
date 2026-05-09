export type Project = {
  name: string;
  description: string;
  tech: string[];
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
    description:
      "Decoder-only transformer built from scratch in PyTorch + Lightning — custom tokenizer, causal masking, temperature sampling. Powers the chatbot widget on this site (deployed on Hugging Face Spaces).",
    tech: ["PyTorch", "Lightning", "FastAPI", "Hugging Face Spaces"],
    links: {
      github: "https://github.com/Huydinh1205/LSTM-chatbot",
    },
    featured: true,
  },
  {
    name: "AI-Powered Coffee Shop Manager Dashboard",
    description:
      "End-to-end AI briefing system delivering automated morning reports — revenue trends, inventory forecasting, scheduled daily reports. Single LangChain pipeline integrating four AI capabilities. Redis caching for repeated queries; containerised with Docker.",
    tech: ["Python", "LangChain", "Redis", "Docker", "AWS"],
    links: {},
    featured: true,
    repoVisibility: "private",
  },
  {
    name: "CurricuLLM — Parent-Teacher AI Platform",
    description:
      "Cambridge EduX Hackathon 2026. AI pipeline that auto-generates personalised curriculum reports for parents. Parent-facing chat interface for natural-language student progress queries; real-time multilingual translation. Team project under the VAHPEM organisation.",
    tech: ["TypeScript", "React", "FastAPI", "PostgreSQL", "LLMs"],
    links: {
      github: "https://github.com/VAHPEM/AI_Parent-Teacher_Bridge",
    },
    featured: true,
  },
  {
    name: "Game Automation & Streaming Tool",
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
    description:
      "Full-stack solo project — product listing, search/filter, cart, checkout with order management. JWT auth (register/login/protected routes) with bcrypt; normalised PostgreSQL schema (3NF).",
    tech: ["React", "Express.js", "Node.js", "PostgreSQL", "JWT"],
    links: {
      github: "https://github.com/Huydinh1205/Supermarket-main",
    },
  },
  {
    name: "ML Models from Scratch",
    description:
      "Implemented regression and classification algorithms from first principles — no scikit-learn shortcuts. Gradient descent, regularisation, bias-variance trade-off analysis.",
    tech: ["Python", "NumPy"],
    links: {},
    repoVisibility: "local",
  },
  {
    name: "Frontend Projects Portfolio",
    description:
      "React Tic-Tac-Toe (with move history + undo, deployed on Netlify), React Music Player, React Weather App. Plus pure HTML/CSS/JS clones of Steam-style marketplace and job-search UIs.",
    tech: ["React", "JavaScript", "HTML", "CSS"],
    links: {
      github: "https://github.com/Huydinh1205/tic-tac-toe",
    },
  },
  {
    name: "Game Telemetry Data Analysis",
    description:
      "Exploratory data analysis on competitive-game telemetry — cleaning, feature engineering, and statistical analysis of player behaviour and match outcomes. Visualised performance trends and outlier patterns to surface actionable insights.",
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    links: {
      github: "https://github.com/Huydinh1205/analysis_dota2",
    },
  },
  {
    name: "OCR Preprocessing Pipeline",
    description:
      "Image preprocessing pipeline for OCR — adaptive thresholding, denoising, deskewing, and contrast enhancement. Benchmarked downstream OCR accuracy across preprocessing configurations to identify the strongest pipeline for noisy real-world inputs.",
    tech: ["Python", "OpenCV", "NumPy", "PaddleOCR"],
    links: {
      github: "https://github.com/Huydinh1205/paddleOCR_comerdata",
    },
  },
  {
    name: "Housing Price Data Analysis",
    description:
      "Coursework project for Intro to Data Analysis. EDA, missing-value handling, and statistical modelling on a housing dataset to identify the strongest predictors of price. Hypothesis testing, correlation analysis, and regression diagnostics.",
    tech: ["Python", "Pandas", "scikit-learn", "Matplotlib"],
    links: {},
    repoVisibility: "local",
  },
  {
    name: "Smart Parking & Intelligent Traffic Management",
    description:
      "Full ALPR pipeline targeting international publication — YOLOv11-OBB plate detection, PARSEQ transformer OCR, ByteTrack temporal voting, and Zero-DCE++ low-light enhancement. Robustness benchmarked across CCPD2020 subsets (blur, tilt, night) with a Streamlit dashboard for real-time violation detection. Team lead (ML).",
    tech: ["PyTorch", "Ultralytics YOLO", "PARSEQ", "ByteTrack", "Streamlit"],
    links: {},
    featured: true,
    status: "in-progress",
    repoVisibility: "private",
  },
  {
    name: "Dynamic Graph Learning for Esports Win Prediction",
    description:
      "Research project (target: top-tier ML venue). Real-time win-probability model that treats each minute of a competitive match as a dynamic graph. Details under wraps pending paper submission.",
    tech: ["PyTorch", "PyTorch Geometric", "Python"],
    links: {},
    status: "in-progress",
    repoVisibility: "private",
  },
  {
    name: "Badminton Tactical Analysis with VLMs",
    description:
      "Research project (target: DICTA 2026). Hybrid CV + Vision-Language Model pipeline for tactical badminton analysis from single-camera video. Details under wraps pending paper submission.",
    tech: ["PyTorch", "VLMs", "OpenCV", "RAG"],
    links: {},
    status: "in-progress",
    repoVisibility: "private",
  },
];
