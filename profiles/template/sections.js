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
    entries: [
      {
        label: "Appointment",
        title: siteConfig.role,
        meta: siteConfig.institution,
      },
      {
        label: "Recognition",
        title: siteConfig.recognition,
        meta: "Research and teaching",
      },
    ],
  },
  roomSection("research", {
    kicker: "Research atlas",
    title: "Three connected themes",
    description: "Methods, responsible systems, and applied research.",
    z: -18,
    action: "Explore research",
    entries: [
      {
        label: "Theme 01",
        title: "Core methods",
        meta: "Models / data / evaluation",
      },
      {
        label: "Theme 02",
        title: "Responsible systems",
        meta: "Trust / governance / deployment",
      },
      {
        label: "Theme 03",
        title: "Applications",
        meta: "Science / health / society",
      },
    ],
  }),
  roomSection("news", {
    kicker: "Latest updates",
    title: "News",
    description: "Appointments, publications, awards, and project updates.",
    z: -36,
    action: "View all news",
    entries: [
      {
        label: "May 2026",
        title: "Add your latest appointment or award",
        meta: "Institution or venue",
      },
      {
        label: "Apr 2026",
        title: "Add a publication acceptance",
        meta: "Conference or journal",
      },
      {
        label: "Mar 2026",
        title: "Add a project milestone",
        meta: "Project or collaboration",
      },
    ],
  }),
  roomSection("funding", {
    kicker: "Funding portfolio",
    title: "Funding",
    description: "Awards, active proposals, and future priorities.",
    z: -54,
    action: "View funding",
    entries: [
      {
        label: "Award 01",
        title: "Competitive research grant",
        meta: "Role / funder / period",
      },
      {
        label: "Award 02",
        title: "Industry or community partnership",
        meta: "Partners / contribution",
      },
      {
        label: "Priority",
        title: "Next research direction",
        meta: "Question / method / impact",
      },
    ],
  }),
  roomSection("collaborators", {
    kicker: "Collaboration network",
    title: "Collaborators",
    description: "Students, academic colleagues, and external partners.",
    z: -72,
    action: "Meet collaborators",
    entries: [
      {
        label: "Students",
        title: "Current and former research students",
        meta: "Honours / Masters / PhD",
      },
      {
        label: "Academic",
        title: "Research collaborators",
        meta: "Institutions / themes / projects",
      },
      {
        label: "External",
        title: "Industry and community partners",
        meta: "Translation / engagement / impact",
      },
    ],
  }),
  roomSection("teaching", {
    kicker: "Teaching and learning",
    title: "Teaching",
    description: "Courses, supervision, and an evidence-based approach.",
    z: -90,
    action: "Teaching details",
    entries: [
      {
        label: "Courses",
        title: "Current teaching portfolio",
        meta: "Course codes / roles / years",
      },
      {
        label: "Supervision",
        title: "Research and capstone projects",
        meta: "Topics / levels / outcomes",
      },
      {
        label: "Approach",
        title: "Your teaching philosophy",
        meta: "Learning design / assessment / inclusion",
      },
    ],
  }),
  roomSection("service", {
    kicker: "Academic + professional service",
    title: "Service",
    description: "Contributions to institutions and research communities.",
    z: -108,
    action: "Service record",
    entries: [
      {
        label: "Academic service",
        title: "Institutional contribution",
        meta: "Committees / mentoring / leadership",
      },
      {
        label: "Professional service",
        title: "Disciplinary contribution",
        meta: "Reviewing / organising / advisory work",
      },
    ],
  }),
  roomSection("about", {
    kicker: "Profile",
    title: "Your research identity",
    description: `${siteConfig.role} at ${siteConfig.institution}.`,
    z: -126,
    action: "Read profile",
    entries: [
      {
        label: "Affiliation",
        title: siteConfig.school,
        meta: `${siteConfig.faculty} / ${siteConfig.institution}`,
      },
      {
        label: "Methods",
        title: "Your main methods and expertise",
        meta: "Approaches / systems / evaluation",
      },
      {
        label: "Domains",
        title: "Your application areas",
        meta: "Domain one / domain two / domain three",
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
    z: -144,
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
