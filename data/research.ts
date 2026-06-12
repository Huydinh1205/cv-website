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
      "Set-of-Mark Visual Prompting for Tactical Understanding in Soccer Broadcast",
    venue: "DICTA 2026 (Sydney)",
    status: "in-preparation",
    year: "2026",
    authors: "Quoc Huy Dinh, et al.",
    abstract:
      "A training-free recipe that overlays lightweight detector marks — numbered player boxes, team colours, and a ball marker — onto soccer broadcast frames so a VLM can reason about possession, open space, passing lanes, and pressing. We introduce a Tactical-QA benchmark (objective multiple-choice across 6 question types) and ablate the contribution of visual marks vs. text-only detection vs. an oracle ceiling derived from SoccerNet Game-State-Reconstruction ground truth.",
    topics: ["VLM", "Visual Prompting", "Sports Analytics", "Training-Free"],
    links: {},
  },
  {
    title:
      "Dynamic Graph Neural Networks for Real-Time Win Prediction in Esports",
    venue: "Target: top-tier ML venue (AAAI / WWW Applied ML)",
    status: "in-preparation",
    year: "2026",
    authors: "Quoc Huy Dinh, et al.",
    abstract:
      "We formalise Dota 2 match state at each minute as a dynamic heterogeneous graph (players as nodes; kill, teamfight, and same-team edges with temporal decay) and learn a Graph Attention Network + GRU model that outputs a win-probability curve over the full match. The graph formulation captures interaction patterns (teamfight clustering, kill chains) that scalar-feature baselines miss, and enables turning-point analysis. Details under wraps pending submission.",
    topics: ["Graph Neural Networks", "Temporal Modelling", "Esports"],
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
