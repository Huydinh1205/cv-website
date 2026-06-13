export type Certification = {
  title: string;
  issuer: string;
  year: string;
  description?: string;
};

export type Award = {
  title: string;
  organisation: string;
  year: string;
  level: string;
  description?: string;
};

export const certifications: Certification[] = [
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
