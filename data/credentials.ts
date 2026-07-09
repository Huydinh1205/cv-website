export type Certification = {
  title: string;
  issuer: string;
  year: string;
  description?: string;
  certificateUrl?: string;
};

export type Award = {
  title: string;
  organisation: string;
  year: string;
  level: string;
  description?: string;
  certificateUrl?: string;
};

export const certifications: Certification[] = [
  {
    title: "WIL to Work Certificate of Completion",
    issuer: "UTS Careers",
    year: "2026",
    description:
      "Work Integrated Learning preparation programme covering Australian workplace culture, succeeding in WIL activities, and online work environments — signed by Eva Chan, Manager UTS Careers.",
    certificateUrl: "/certificates/UTS-WIL-to-Work-2026.pdf",
  },
  {
    title: "Full-Stack Web Development",
    issuer: "CoderSchool",
    year: "2024",
    description:
      "Intensive full-stack programme covering React, Node.js/Express, MongoDB/PostgreSQL, REST API design, and deployment workflows.",
  },
];

export const awards: Award[] = [
  {
    title: "Dean's List 2026",
    organisation: "UTS Faculty of Engineering & Information Technology",
    year: "2026",
    level: "Faculty level, university",
    description:
      "Included on the FEIT Dean's List for outstanding academic achievement — a faculty initiative recognising top-performing students across Engineering and Information Technology. Certified by Prof. Karen Whelan, Associate Dean (Teaching & Learning).",
    certificateUrl: "/certificates/UTS-Deans-List-2026.pdf",
  },
  {
    title: "Second Prize — Physics Olympiad",
    organisation: "Ho Chi Minh City Department of Education",
    year: "2022",
    level: "City level, high school",
    description:
      "Second prize at the Ho Chi Minh City high-school Physics olympiad while studying at Le Hong Phong High School for the Gifted.",
  },
  {
    title: "Second Prize — Scientific Research Contest",
    organisation: "Ho Chi Minh City Department of Education",
    year: "2018",
    level: "City level, middle school",
    description:
      "Second prize at the city-level scientific research contest for middle-school students.",
  },
];
