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
  /** Thumbnail in /public/projects (webp screenshot or generated svg cover). */
  image?: string;
  /** Short muted clip that plays on hover (.mp4, with a .webm twin next to it). */
  video?: string;
  links: {
    demo?: string;
    github?: string | string[];
    paper?: string;
  };
  featured?: boolean;
  status?: "in-progress";
  repoVisibility?: "private" | "local";
  /** Show on website, but omit from the exported CV markdown/PDF. */
  hideFromCv?: boolean;
};

export const projects: Project[] = [
  {
    name: "Transformer Chatbot from Scratch",
    categories: ["ai"],
    description:
      "Decoder-only transformer built from scratch in PyTorch + Lightning: custom tokenizer, causal masking, temperature sampling. Powers the chatbot widget on this site (deployed on Hugging Face Spaces).",
    tech: ["PyTorch", "Lightning", "FastAPI", "Hugging Face Spaces"],
    metrics: [
      "4 decoder blocks · d_model=256 · 4 attention heads",
      "Word-level vocab trained on 40 intent classes",
      "Live in production, served from HF Spaces Docker",
    ],
    image: "/projects/transformer-chatbot.webp",
    links: {
      github: "https://github.com/Huydinh1205/LSTM-chatbot",
    },
    featured: true,
  },
  {
    name: "CaféPulse: AI Morning Brief for Café Owners",
    categories: ["software", "ai"],
    description:
      "AI morning brief for Australian café owner-operators. Every day at 06:00 Sydney time a LangGraph ReAct agent (Groq Llama 3.3 70B) answers 10 manager questions per branch from the database: sales vs target, roster, low stock, equipment, overnight anomalies. Also has a z-score anomaly inbox, streaming Q&A over SSE and Prophet revenue forecasts, running on synthetic data for 8 Sydney branches.",
    tech: ["FastAPI", "LangGraph", "Groq", "Prophet", "PostgreSQL", "Redis", "Next.js 15", "Docker"],
    metrics: [
      "10 morning questions × 8 demo branches, answered by a ReAct agent with KPI, trend and comparison tools",
      "24-table PostgreSQL schema with Fair Work penalty rates and GST-inclusive AUD amounts",
      "5 scheduled jobs pinned to Australia/Sydney: rollover, brief, anomaly scan, live data, nightly insights",
    ],
    image: "/projects/cafepulse.svg",
    links: {
      github: "https://github.com/Huydinh1205/cafepulse",
    },
    featured: true,
  },
  {
    name: "CurricuLLM: Parent-Teacher AI Platform",
    categories: ["software", "ai"],
    description:
      "Cambridge EduX Hackathon 2026. AI pipeline that auto-generates personalised curriculum reports for parents. Parent-facing chat interface for natural-language student progress queries; real-time multilingual translation. Team project under the VAHPEM organisation.",
    tech: ["TypeScript", "React", "FastAPI", "PostgreSQL", "LLMs"],
    image: "/projects/curricullm.svg",
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
      "Live in production at dinhquochuy.vercel.app",
      "App Router with shared layout for navbar / footer / chatbot widget",
      "Chatbot served from HF Spaces Docker, proxied via a Next.js API route",
    ],
    image: "/projects/portfolio.webp",
    links: {
      demo: "https://dinhquochuy.vercel.app",
      github: "https://github.com/Huydinh1205/cv-website",
    },
    featured: true,
  },
  {
    name: "Game Automation & Streaming Tool",
    categories: ["software"],
    description:
      "Backend modules for a real-time game-automation tool. TCP layer for client-server messaging; OBS WebSocket integration to react to live stream events; REST API exposing keyboard/mouse triggers. Spans two repos: the main app and the standalone TCP server/client.",
    tech: ["Python", "Flask", "FastAPI", "TCP", "OBS WebSocket"],
    image: "/projects/game-automation.webp",
    video: "/projects/game-automation.mp4",
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
      "Full-stack solo project: product listing, search/filter, cart, checkout with order management. JWT auth (register/login/protected routes) with bcrypt; normalised PostgreSQL schema (3NF).",
    tech: ["React", "Express.js", "Node.js", "PostgreSQL", "JWT"],
    image: "/projects/e-commerce.svg",
    links: {
      github: "https://github.com/Huydinh1205/Supermarket-main",
    },
  },
  {
    name: "ML Models from Scratch",
    categories: ["ai"],
    description:
      "Implemented regression and classification algorithms from first principles, with no scikit-learn shortcuts. Gradient descent, regularisation, bias-variance trade-off analysis.",
    tech: ["Python", "NumPy"],
    image: "/projects/ml-from-scratch.svg",
    links: {},
    repoVisibility: "local",
  },
  {
    name: "Frontend Projects",
    categories: ["software"],
    description:
      "React Tic-Tac-Toe (with move history + undo, deployed on Netlify), React Music Player, React Weather App. Plus pure HTML/CSS/JS clones of Steam-style marketplace and job-search UIs.",
    tech: ["React", "JavaScript", "HTML", "CSS"],
    image: "/projects/frontend-projects.svg",
    links: {
      github: "https://github.com/Huydinh1205/tic-tac-toe",
    },
  },
  {
    name: "Game Telemetry Data Analysis",
    categories: ["data"],
    description:
      "Exploratory data analysis on competitive-game telemetry: cleaning, feature engineering, and statistical analysis of player behaviour and match outcomes. Visualised performance trends and outlier patterns to surface actionable insights.",
    tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Seaborn"],
    image: "/projects/game-telemetry.svg",
    links: {
      github: "https://github.com/Huydinh1205/analysis_dota2",
    },
  },
  {
    name: "OCR Preprocessing Pipeline",
    categories: ["data"],
    description:
      "Image preprocessing pipeline for OCR: adaptive thresholding, denoising, deskewing, and contrast enhancement. Benchmarked downstream OCR accuracy across preprocessing configurations to identify the strongest pipeline for noisy real-world inputs.",
    tech: ["Python", "OpenCV", "NumPy", "PaddleOCR"],
    image: "/projects/ocr-preprocessing.svg",
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
    image: "/projects/housing-price.svg",
    links: {},
    repoVisibility: "local",
  },
  {
    name: "Smart Parking & Intelligent Traffic Management",
    categories: ["ai"],
    description:
      "Full ALPR pipeline targeting international publication: YOLOv11 plate detection, PARSEQ transformer OCR fine-tuned on Latin and Chinese plates, ByteTrack temporal voting, and Zero-DCE++ low-light enhancement. Robustness benchmarked across CCPD subsets (blur, tilt, night). A Django parking-gate app turns each plate read into a check-in or check-out with a fee. Team lead (ML).",
    tech: ["PyTorch", "Ultralytics YOLO", "PARSEQ", "ByteTrack", "Django"],
    metrics: [
      "Team lead, 3 members, 5 ablation configs across detector + OCR axes",
      "Robustness benchmark on 6 CCPD2020 subsets (base, blur, tilt, rain, night, challenge)",
      "Targeting international vision venue · 2026",
    ],
    image: "/projects/smart-parking.webp",
    video: "/projects/smart-parking.mp4",
    links: {
      github: "https://github.com/Huydinh1205/smart_parking",
    },
    featured: true,
    status: "in-progress",
  },
  {
    name: "Hybrid CV + VLM for Tactical Badminton Analysis",
    categories: ["ai"],
    description:
      "First-author research project, team of 3. Hybrid pipeline that splits tasks between classical CV (court homography, player + shuttle tracking, Y-reversal shot detection) and a Vision-Language Model (shot type, handedness, out-of-position state) for tactical badminton analysis from single-camera broadcast video. Built on top of a RAG-powered conversational interface (Gemini 2.5 Pro + FAISS + Streamlit).",
    tech: [
      "PyTorch",
      "Ultralytics YOLOv11",
      "Qwen2.5-VL",
      "Gemini",
      "LangChain",
      "FAISS",
      "Streamlit",
    ],
    metrics: [
      "Court keypoint mAP 0.95 · player mAP 0.99 · shuttle mAP 0.57",
      "Shot trigger v2 (Y-reversal): F1=0.80 on 30s Ginting-Axelsen rally (30 ground-truth shots)",
      "Task decomposition ablation (CV-only vs VLM-only vs Hybrid) as the core contribution",
    ],
    image: "/projects/rallyvlm.webp",
    video: "/projects/rallyvlm.mp4",
    links: {},
    featured: true,
    status: "in-progress",
    repoVisibility: "private",
  },
  {
    name: "Dynamic Graph Learning for Esports Win Prediction",
    categories: ["ai"],
    description:
      "Preliminary research (early stage, exploratory). Real-time win-probability model that treats each minute of a competitive match as a dynamic graph. Not yet on the primary submission track.",
    tech: ["PyTorch", "PyTorch Geometric", "Python"],
    metrics: [
      "Dynamic heterogeneous graph: 10 player nodes + kill / teamfight edges with temporal decay",
      "GAT + GRU architecture · per-minute win-probability curve",
      "Very early stage · concept scoping only",
    ],
    image: "/projects/dynawin-gnn.svg",
    links: {},
    status: "in-progress",
    repoVisibility: "private",
    hideFromCv: true,
  },
  {
    name: "Set-of-Mark Visual Prompting for Tactical Soccer Understanding",
    categories: ["ai"],
    description:
      "Preliminary research (early stage, exploratory). Training-free recipe that overlays detector marks onto soccer broadcast frames so a VLM can reason about possession, open space, passing lanes, and pressing. Recipe drafted, benchmark not yet built.",
    tech: ["PyTorch", "Gemini", "Qwen2.5-VL", "YOLO", "OpenCV"],
    metrics: [
      "Training-free recipe: off-the-shelf YOLO + VLM API",
      "Tactical-QA benchmark planned across 6 question types",
      "Very early stage · concept scoping only",
    ],
    image: "/projects/soccer-som.webp",
    links: {},
    status: "in-progress",
    repoVisibility: "private",
    hideFromCv: true,
  },
  {
    name: "Vegetation Stress Early Warning",
    categories: ["data", "ai"],
    description:
      "End-to-end geospatial pipeline processing a Sentinel-2 satellite scene over irrigated farmland (Griffith, NSW) to detect vegetation stress before it is visible to the eye. Computes NDVI and NDRE from multispectral bands, classifies vegetation health with a Random Forest, and ships the full pipeline as a reproducible notebook and a live Gradio web app on Hugging Face Spaces.",
    tech: ["Python", "rasterio", "NumPy", "scikit-learn", "GDAL", "Gradio", "Matplotlib"],
    metrics: [
      "Random Forest test accuracy 0.996 on 72,000 held-out pixels (4-class: healthy / mild stress / severe stress / bare soil)",
      "NDVI-healthy pixels with early NDRE stress signal: 15,522 pixels, 25% of NDVI-healthy area",
      "NDVI / NDRE correlation r = 0.97 across the full scene; Red Edge band carries 21% of RF feature importance independently",
    ],
    image: "/projects/vegetation-stress.webp",
    video: "/projects/vegetation-stress.mp4",
    links: {
      demo: "https://huggingface.co/spaces/Huydinh1205/vegetation-stress-early-warning",
    },
  },
  {
    name: "Agent Market: Agent-to-Agent Negotiation Marketplace",
    categories: ["software", "ai"],
    description:
      "OpenAI WebMCP Challenge submission, team of 2. A multi-vendor marketplace where a buyer's and a seller's browser agents negotiate a multi-term deal (price, quantity, freebies, free shipping, coupons) through tools exposed on document.modelContext via WebMCP; every order still needs explicit human confirmation. Built the WebMCP tool layer, in-browser agent loop, and the Java/Spring Boot negotiation state machine + REST API; a teammate owned the database schema and Azure SQL setup.",
    tech: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Java 21",
      "Spring Boot 3.5",
      "JPA",
      "Azure SQL Database",
    ],
    metrics: [
      "55 backend tests + 16 frontend tests passing (state machine, coupons, tokens, catalog)",
      "9 WebMCP tools registered on document.modelContext, plus full buyer/seller negotiation tool sets",
      "Catalog of 95k+ real products across 5 sellers",
    ],
    image: "/projects/agent-market.svg",
    links: {
      demo: "https://mcp-website-chi.vercel.app/",
      github: "https://github.com/Huydinh1205/mcp_website",
    },
    featured: true,
  },
];
