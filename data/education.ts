export type Education = {
  school: string;
  degree: string;
  field: string;
  period: string;
  description?: string;
};

export const educations: Education[] = [
  {
    school: "University of Technology Sydney (UTS)",
    degree: "Bachelor",
    field: "Artificial Intelligence",
    period: "Jul 2025 — Present",
    description: "Sydney, Australia. Currently focusing on machine learning, deep learning, and applied AI systems.  Database Fundamentals: High Distinction (100/100) — full marks across relational algebra, joins, aggregation, and query optimisation.",
  },
  {
    school: "Ho Chi Minh City University of Technology (HCMUT)",
    degree: "Bachelor",
    field: "Computer Science",
    period: "Aug 2023 — Jun 2025",
    description:
      "GPA 3.6 / 4.0. Data Structures & Algorithms (C++): A grade.",
  },
];
