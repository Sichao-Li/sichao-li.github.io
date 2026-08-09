import { siteConfig } from "@profile";

export default function SceneNavigation({
  activeIndex,
  navigationRef,
  sections,
  selectSection,
}) {
  return (
    <header className="topbar">
      <button
        className="brand"
        type="button"
        onClick={() => selectSection(0)}
        aria-label={`${siteConfig.name}, home`}
      >
        <img
          src={`./public/${siteConfig.brandAsset}`}
          alt=""
          width="36"
          height="36"
        />
        <span>{siteConfig.name}</span>
      </button>

      <nav
        className="scene-nav"
        ref={navigationRef}
        aria-label="Portfolio sections"
      >
        {sections.slice(1).map((section, index) => {
          const sectionIndex = index + 1;
          return (
            <a
              key={section.id}
              className={sectionIndex === activeIndex ? "is-active" : ""}
              aria-current={sectionIndex === activeIndex ? "page" : undefined}
              data-nav-index={sectionIndex}
              href={section.href}
            >
              {section.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
