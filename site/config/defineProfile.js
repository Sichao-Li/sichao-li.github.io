function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function defineProfile({
  galleryAssets = {},
  portfolioCategories,
  roomFigures = {},
  siteConfig,
}) {
  const normalizedGalleryAssets = Object.freeze({
    homeNotebook: null,
    characterFrames: [],
    researchCovers: [],
    ...galleryAssets,
  });
  const categoryById = Object.freeze(
    Object.fromEntries(
      portfolioCategories.map((category) => [category.id, category]),
    ),
  );
  const deployedPublicAssets = Object.freeze(
    unique([
      siteConfig.brandAsset,
      siteConfig.roomBackgroundAsset,
      siteConfig.socialImageAsset,
      siteConfig.cvAsset,
      ...(siteConfig.additionalPublicAssets ?? []),
      ...Object.values(roomFigures).map(({ asset }) => asset),
      normalizedGalleryAssets.homeNotebook,
      ...normalizedGalleryAssets.characterFrames,
      ...normalizedGalleryAssets.researchCovers,
    ]),
  );

  function getCategory(id) {
    const category = categoryById[id];
    if (!category) throw new Error(`Unknown portfolio category: ${id}`);
    return category;
  }

  return Object.freeze({
    categoryById,
    deployedPublicAssets,
    galleryAssets: normalizedGalleryAssets,
    getCategory,
  });
}
