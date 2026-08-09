import { getCategory, siteConfig } from "./config.js";

function roomSection(id, details) {
  const { path, ...category } = getCategory(id);
  return {
    ...category,
    title: category.label,
    href: `./demo/${path}/`,
    ...details,
  };
}

export const sections = [
  {
    id: "home",
    code: "H00",
    label: "Home",
    kicker: "Interactive academic portfolio",
    title: siteConfig.name,
    description: siteConfig.tagline,
    accent: "#c58a50",
    z: 0,
    href: "./demo/about/",
    action: "Read profile",
    entries: [
      {
        label: "Appointment",
        title: siteConfig.role,
        meta: siteConfig.institution,
      },
      {
        label: "Recognition",
        title: siteConfig.recognition,
        meta: "Teaching and learning",
      },
    ],
  },
  roomSection("news", {
    kicker: "Latest updates",
    title: "News",
    description:
      "Confirmed appointments, acceptances, and research developments.",
    z: -18,
    action: "View all news",
    entries: [
      {
        label: "1 Mar 2026",
        title: "Joined the University of Sydney",
        meta: "Lecturer in Computer Science",
      },
      {
        label: "15 Feb 2026",
        title: "Practical Attribution Guidance accepted",
        meta: "AISTATS 2026",
      },
      {
        label: "20 Jan 2026",
        title: "FaithAct accepted",
        meta: "ACL 2026",
      },
    ],
  }),
  roomSection("research", {
    kicker: "Research atlas",
    title: "Two connected research themes",
    description: "AI governance and trustworthy AI for science.",
    z: -36,
    action: "Explore research",
    entries: [
      {
        label: "AI governance",
        title: "Interpretable, explainable, faithful, and monitorable AI",
        meta: "Rashomon sets · LLM understanding · normative agents",
      },
      {
        label: "Trustworthy AI for science",
        title: "Materials science, education, and healthcare",
        meta: "Domain evidence · human decisions · responsible discovery",
      },
    ],
  }),
  roomSection("funding", {
    kicker: "Grants and funding",
    title: "Funding record",
    description:
      "Applications, awards, credits, and travel support from 2024 to 2026.",
    z: -54,
    action: "View funding record",
    entries: [
      {
        label: "2026 / Under review",
        title: "Three research funding applications",
        meta: "Breakthrough Project · Career Transition · Trustworthy AI",
      },
      {
        label: "2026 / Awarded",
        title: "TPU Builder Award and Google Cloud Research Credits",
        meta: "Approximately USD 7,500",
      },
      {
        label: "2024–2025 / Awarded",
        title: "Lambda, TALO, and ANU travel support",
        meta: "Research infrastructure · innovation · academic travel",
      },
    ],
  }),
  roomSection("collaborators", {
    kicker: "Collaboration network",
    title: "Collaborators",
    description:
      "Research partnerships across AI governance and trustworthy AI for science.",
    z: -72,
    action: "Explore collaborations",
    entries: [
      {
        label: "Interpretability + governance",
        title: "UNC-Chapel Hill, ANU, RMIT, and Arizona State University",
        meta: "Interpretability · normative AI · research exchange",
      },
      {
        label: "Trustworthy AI for science",
        title: "UCL, City University of Hong Kong, and Deakin University",
        meta: "Materials science · interdisciplinary AI",
      },
      {
        label: "Student collaborators",
        title: "The University of Sydney and City University of Macau",
        meta: "Honours · undergraduate · postgraduate projects",
      },
    ],
  }),
  roomSection("teaching", {
    kicker: "Teaching and learning",
    title: "Teaching",
    description:
      "Computing and mathematics education grounded in responsible AI.",
    z: -90,
    action: "Teaching details",
    entries: [
      {
        label: "Teaching record",
        title:
          "Database systems, systems programming, data structures, and software engineering",
        meta: "Coordination · ANU · Shandong · Macau · Minzu · Sydney",
      },
      {
        label: "Supervision",
        title: "Honours, capstone, and Dalyell projects",
        meta: "The University of Sydney",
      },
      {
        label: "Approach",
        title: "Responsible AI integrated throughout teaching",
        meta: "Authentic assessment · active and inclusive learning",
      },
    ],
  }),
  roomSection("service", {
    kicker: "Academic + professional service",
    title: "Service",
    description:
      "Internal academic contribution, peer review, and research evaluation.",
    z: -108,
    action: "Service scope",
    entries: [
      {
        label: "Internal academic service",
        title: "Undergraduate Advisory Panel and program development",
        meta: "The University of Sydney · international programs · supervision",
      },
      {
        label: "Professional service",
        title: "Conference and journal reviewing",
        meta: "ICML · NeurIPS · ICLR · AISTATS · AAAI · CVPR",
      },
    ],
  }),
  {
    id: "contact",
    code: "C08",
    label: "Contact",
    kicker: "Contact",
    title: "Start a conversation",
    description: "Research, supervision, and collaboration enquiries.",
    accent: "#c58a50",
    z: -126,
    href: "./demo/contact/",
    action: "Contact details",
    entries: [
      {
        label: "Email",
        title: siteConfig.email,
        meta: siteConfig.institution,
        href: `mailto:${siteConfig.email}`,
      },
      ...siteConfig.profiles.map(({ href, label, meta, title }) => ({
        href,
        label,
        meta,
        title,
      })),
    ],
  },
];
