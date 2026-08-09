import { defineProfile } from "../../site/config/defineProfile.js";

export const siteConfig = Object.freeze({
  name: "Your Name",
  role: "Academic Title",
  recognition: "Professional Recognition",
  portfolioTitle: "Academic Portfolio",
  tagline: "A concise statement of your research, teaching, and impact.",
  description:
    "A reusable academic portfolio template for research, teaching, funding, collaboration, and service.",
  institution: "Your University",
  school: "Your School or Department",
  faculty: "Your Faculty",
  location: "Your location",
  email: "you@example.edu",
  siteUrl: "https://example.com",
  locale: "en_US",
  publicationStatus: "template",
  brandAsset: "assets/brand/research-atlas-mark.svg",
  roomBackgroundAsset: "assets/generated/midnight-academic-wing.jpg",
  socialImageAsset: "assets/generated/midnight-research-atlas-hero.jpg",
  socialImageAlt: "Academic portfolio preview",
  socialImageWidth: 1600,
  socialImageHeight: 900,
  cvAsset: null,
  cvHref: "../cv/",
  additionalPublicAssets: [],
  profiles: [
    {
      id: "scholar",
      label: "Google Scholar",
      title: "Google Scholar",
      meta: "Publications and citations",
      href: "https://scholar.google.com",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      title: "Your professional profile",
      meta: "Research and academic network",
      href: "https://www.linkedin.com",
    },
    {
      id: "github",
      label: "GitHub",
      title: "Your GitHub profile",
      meta: "Code and research projects",
      href: "https://github.com",
    },
    {
      id: "orcid",
      label: "ORCID",
      title: "Your ORCID",
      meta: "Persistent researcher identifier",
      href: "https://orcid.org",
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
  },
]);

export const roomFigures = Object.freeze({});

export const galleryAssets = Object.freeze({
  characterFrames: [],
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
