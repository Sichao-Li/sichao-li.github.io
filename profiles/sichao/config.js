import { defineProfile } from "../../site/config/defineProfile.js";

export const siteConfig = Object.freeze({
  name: "Sichao Li",
  role: "A/Lecturer in Computer Science",
  recognition: "Fellow of the Higher Education Academy (FHEA)",
  portfolioTitle: "Academic Portfolio",
  tagline: "AI Governance and Trustworthy AI for Science",
  description:
    "Sichao Li researches AI governance, explainability, and trustworthy AI for materials science, education, and healthcare.",
  institution: "The University of Sydney",
  school: "School of Computer Science",
  faculty: "Faculty of Engineering",
  location: "Sydney, Australia",
  email: "sichao.li@sydney.edu.au",
  siteUrl: "https://sichao-li.github.io",
  locale: "en_AU",
  publicationStatus: "public",
  brandAsset: "assets/brand/research-atlas-mark.svg",
  roomBackgroundAsset: "assets/generated/midnight-academic-wing.jpg",
  socialImageAsset: "assets/profile/sichao-li-social-banner.jpg",
  socialImageAlt: "Sichao Li academic portfolio",
  socialImageWidth: 1200,
  socialImageHeight: 630,
  cvAsset: null,
  cvHref: "../cv/",
  additionalPublicAssets: [
    "assets/institutions/anu.png",
    "assets/institutions/arizona-state.png",
    "assets/institutions/cityu-hong-kong.png",
    "assets/institutions/cityu-macau.png",
    "assets/institutions/deakin.svg",
    "assets/institutions/rmit.png",
    "assets/institutions/sydney.png",
    "assets/institutions/ucl.png",
    "assets/institutions/unc-chapel-hill.jpg",
  ],
  profiles: [
    {
      id: "scholar",
      label: "Google Scholar",
      title: "Google Scholar",
      meta: "Publications and citations",
      href: "https://scholar.google.com/citations?user=ylZQz2sAAAAJ&hl=en",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      title: "Professional profile",
      meta: "Research and academic network",
      href: "https://www.linkedin.com/in/sichao-li-1204/",
    },
    {
      id: "github",
      label: "GitHub",
      title: "Sichao-Li",
      meta: "Code and research projects",
      href: "https://github.com/Sichao-Li",
    },
    {
      id: "orcid",
      label: "ORCID",
      title: "0000-0002-0097-6754",
      meta: "Persistent researcher identifier",
      href: "https://orcid.org/0000-0002-0097-6754",
    },
  ],
});

export const portfolioCategories = Object.freeze([
  {
    id: "research",
    code: "R01",
    label: "Research",
    path: "research",
    accent: "#4c9ca0",
  },
  {
    id: "news",
    code: "N02",
    label: "News",
    path: "news",
    accent: "#b85c55",
  },
  {
    id: "funding",
    code: "F03",
    label: "Funding",
    path: "funding",
    accent: "#c58a50",
  },
  {
    id: "collaborators",
    code: "C04",
    label: "Collaborators",
    path: "collaborators",
    accent: "#3c8d91",
  },
  {
    id: "teaching",
    code: "T05",
    label: "Teaching",
    path: "teaching",
    accent: "#7d8f5c",
  },
  {
    id: "service",
    code: "V06",
    label: "Service",
    path: "service",
    accent: "#8c6e96",
  },
  {
    id: "about",
    code: "A07",
    label: "About",
    path: "about",
    accent: "#4c9ca0",
    scene: false,
  },
]);

export const roomFigures = Object.freeze({
  research: {
    asset: "assets/character/motions/sichao-avatar-research.png",
    action: "pointing toward a research display",
  },
  news: {
    asset: "assets/character/motions/sichao-avatar-news.png",
    action: "walking with a tablet",
  },
  funding: {
    asset: "assets/character/motions/sichao-avatar-funding.png",
    action: "presenting a proposal folder",
  },
  collaborators: {
    asset: "assets/character/motions/sichao-avatar-collaborators.png",
    action: "making a welcoming gesture",
  },
  teaching: {
    asset: "assets/character/motions/sichao-avatar-teaching.png",
    action: "explaining with a pointer",
  },
  service: {
    asset: "assets/character/motions/sichao-avatar-service.png",
    action: "reviewing a clipboard",
  },
  about: {
    asset: "assets/character/motions/sichao-avatar-about.png",
    action: "introducing an academic profile",
  },
  cv: {
    asset: "assets/character/motions/sichao-avatar-about.png",
    action: "introducing an academic profile",
  },
  contact: {
    asset: "assets/character/motions/sichao-avatar-contact.png",
    action: "waving and offering a contact card",
  },
});

export const galleryAssets = Object.freeze({
  homeNotebook: "assets/generated/home-research-notebook.png",
  characterFrames: [
    "assets/character/sichao-avatar-corridor.png",
    "assets/character/sichao-avatar-wave-1-transparent.png",
    "assets/character/sichao-avatar-wave-2-transparent.png",
  ],
  researchCovers: [
    "assets/generated/midnight-research-atlas-hero.jpg",
    "assets/generated/rashomon-explanations-cover.jpg",
    "assets/generated/materials-discovery-cover.jpg",
  ],
});

const profileDefinition = defineProfile({
  galleryAssets,
  portfolioCategories,
  roomFigures,
  siteConfig,
});

export const categoryById = profileDefinition.categoryById;
export const deployedPublicAssets = profileDefinition.deployedPublicAssets;
export const getCategory = profileDefinition.getCategory;
