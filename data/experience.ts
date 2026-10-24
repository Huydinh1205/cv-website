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
    company: "CSIRO",
    role: "Computer Vision Research Intern",
    period: "Nov 2026 – Feb 2027 (Incoming)",
    location: "Pullenvale, QLD",
    description:
      "Vacation Studentship with CSIRO Mineral Resources at QCAT, focused on computer vision for industrial measurement.",
    highlights: [
      "Developing image quality metrics for industrial stereo metrology systems",
    ],
    tech: ["Computer Vision", "Stereo Vision", "Python"],
  },
  {
    company: "University of Technology Sydney",
    role: "Research Office + DAIU Research Data Analytics Intern",
    period: "Oct 2026 – Present",
    location: "Sydney, NSW",
    description:
      "Intern with the UTS Research Office and the Data Analytics and Insights Unit (DAIU) on the Research KPI project for the DVCR office, building automated reporting of research performance indicators.",
    highlights: [
      "Building automated data pipelines for UTS research KPIs in the Quality and Integrity stream (FWCI, CNCI, top-journal share, grant success, open access, retractions), drawing on SciVal, Scopus, Crossref and ARC/NHMRC data",
    ],
    tech: ["SciVal", "Scopus", "Crossref", "Data Pipelines", "Research Analytics"],
  },
  {
    company: "Nallawilli Bunjil",
    role: "Data Engineer",
    period: "Aug 2026 – Present",
    location: "Brookvale, NSW",
    description:
      "Geospatial data and ML engineering for environmental monitoring from drone surveys. I build the tools that turn raw drone orthomosaics and LiDAR into usable outputs: ML vegetation segmentation, a browser interface for running GPU classification jobs, and web publishing for large point clouds. I am also looking at how to automate the manual survey processing chain (photo editing, photogrammetry, LiDAR, PPK positioning and hyperspectral processing).",
    highlights: [
      "Vegetation mapping: built a semi-automatic labelling and segmentation pipeline for drone orthomosaics (PyTorch, DINOv2, SAM, DeepLabV3+, QGIS)",
      "Analyst tooling: built a web GUI prototype (NiceGUI, SQLite job queue) so analysts can run the GPU vegetation classification workflow without the terminal",
      "LiDAR publishing: tested py3dtiles for serving drone LiDAR in CesiumJS, converting an 18.8 million point survey in 31 s and verifying with laspy that every point attribute survived the conversion",
      "Pipeline automation: mapping the current manual workflow (Lightroom, Agisoft Metashape, DJI Terra, AUSPOS, GRYFN) to find the steps that can be scripted end to end",
    ],
    tech: ["Python", "PyTorch", "QGIS", "rasterio", "GeoPandas", "NiceGUI", "py3dtiles", "CesiumJS"],
  },
  {
    company: "University of Technology Sydney",
    role: "Research Assistant",
    period: "Nov 2025 – Sep 2026",
    location: "Sydney, NSW",
    description:
      "Cross-area research role spanning data analysis, data preprocessing, and backend server modules for research projects. Currently exploring Vision-Language Models (VLM) and Generative Adversarial Networks (GAN).",
    highlights: [
      "Data analysis: cleaned and analysed noisy multi-source OCR datasets, ran iterative model experiments, translated findings into reproducible workflows",
      "Data preprocessing: built normalisation, cleaning, and feature-extraction pipelines for downstream modelling across multi-source datasets",
      "Backend server modules: contributed TCP, OBS WebSocket, and REST API layers for a game-research project enabling real-time messaging and programmatic control",
      "Researched Vision-Language Models and GANs: multimodal understanding and generative modelling experiments",
    ],
    tech: ["Python", "PyTorch", "Pandas", "NumPy", "FastAPI", "VLM", "GAN"],
  },
];
