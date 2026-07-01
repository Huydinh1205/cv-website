export type Publication = {
  title: string;
  venue: string;
  status: "in-submission" | "in-preparation" | "accepted" | "published";
  year: string;
  authors?: string;
  abstract: string;
  topics: string[];
  links?: {
    paper?: string;
    code?: string;
    project?: string;
  };
};

export const researchInterests = [
  "Vision-Language Models and visual prompting for spatial / tactical reasoning",
  "Dynamic graph neural networks for temporal modelling of multi-agent systems",
  "Robust deep learning for vision under domain shift (low-light, motion blur, weather)",
  "Training-free recipes that turn off-the-shelf foundation models into specialists",
];

export const researchStatement =
  "My research sits at the intersection of foundation models and structured perception — I'm interested in cheap, training-free recipes that turn generalist vision-language models into reliable specialists for spatial reasoning (sports tactics, traffic scenes, multi-agent games). I prefer rigour-through-experiment-design over rigour-through-gradient-descent, with careful ablations, oracle ceilings, and inter-annotator agreement as core tools.";

export const publications: Publication[] = [
  {
    title:
      "Hybrid CV + VLM for Tactical Badminton Analysis from Single-Camera Broadcast Video",
    venue: "DICTA 2026 (Sydney)",
    status: "in-preparation",
    year: "2026",
    authors: "Quoc Huy Dinh",
    abstract:
      "A hybrid pipeline that decomposes tactical badminton analysis into a geometric side (classical CV: YOLOv11 court keypoint homography, player + shuttle tracking, Y-reversal shot detection) and a semantic side (a Vision-Language Model handling shot type, handedness, and out-of-position state). Shot events flow into a conversational RAG interface built on FAISS and Gemini 2.5 Pro over a static rules-and-tactics knowledge base. The core contribution is a task-decomposition ablation (CV-only vs VLM-only vs Hybrid) evaluated against hand-annotated ground truth from professional BWF rallies.",
    topics: [
      "VLM",
      "Sports Analytics",
      "RAG",
      "Task Decomposition",
      "Object Detection",
    ],
    links: {},
  },
  {
    title:
      "Robust Automatic License Plate Recognition Across Adverse Conditions",
    venue: "Target: international vision venue",
    status: "in-preparation",
    year: "2026",
    authors: "Quoc Huy Dinh (lead), Moniz Kumar Senthilkumar, Xuan Nguyen",
    abstract:
      "An end-to-end ALPR pipeline combining YOLOv11-OBB rotated-box detection, PARSEQ transformer OCR, ByteTrack temporal majority voting, and Zero-DCE++ low-light enhancement, evaluated across CCPD2020 robustness subsets (base, blur, tilt, rain, night). We report a clean ablation isolating the contribution of each component and the cost of detector error vs. an oracle ceiling.",
    topics: ["ALPR", "Object Detection", "OCR", "Robustness"],
    links: {},
  },
  {
    title:
      "Set-of-Mark Visual Prompting for Tactical Understanding in Soccer Broadcast (exploratory)",
    venue: "Target: computer vision venue (exploratory)",
    status: "in-preparation",
    year: "2026",
    authors: "Quoc Huy Dinh",
    abstract:
      "Early-stage exploratory work drafting a training-free recipe that overlays lightweight detector marks (numbered player boxes, team colours, a ball marker) onto soccer broadcast frames so a VLM can reason about possession, open space, passing lanes, and pressing. Not on the primary submission track yet — concept scoping only.",
    topics: ["VLM", "Visual Prompting", "Sports Analytics", "Exploratory"],
    links: {},
  },
  {
    title:
      "Dynamic Graph Neural Networks for Real-Time Win Prediction in Esports (exploratory)",
    venue: "Target: applied ML venue (exploratory)",
    status: "in-preparation",
    year: "2026",
    authors: "Quoc Huy Dinh",
    abstract:
      "Early-stage exploratory formulation of competitive-match state at each minute as a dynamic heterogeneous graph, learned with a Graph Attention Network + GRU model to output a per-minute win-probability curve. Not on the primary submission track yet — concept scoping only.",
    topics: [
      "Graph Neural Networks",
      "Temporal Modelling",
      "Esports",
      "Exploratory",
    ],
    links: {},
  },
];

export const academicProfiles = [
  {
    name: "Hugging Face",
    handle: "Huydinh1205",
    url: "https://huggingface.co/Huydinh1205",
  },
  {
    name: "GitHub",
    handle: "Huydinh1205",
    url: "https://github.com/Huydinh1205",
  },
  {
    name: "Google Scholar",
    handle: "Coming soon",
    url: "",
  },
  {
    name: "ORCID",
    handle: "Coming soon",
    url: "",
  },
];
