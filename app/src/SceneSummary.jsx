function SectionRecord({ entry }) {
  const content = (
    <>
      <span>{entry.label}</span>
      <span>
        <strong>{entry.title}</strong>
        <small>{entry.meta}</small>
      </span>
    </>
  );

  if (!entry.href) {
    return <div className="scene-record">{content}</div>;
  }

  const external = entry.href.startsWith("http");
  return (
    <a
      className="scene-record"
      href={entry.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

export default function SceneSummary({ activeIndex, section, sectionCount }) {
  return (
    <section className="scene-summary" id="scene-summary" aria-live="polite">
      <div className="scene-count">
        {String(activeIndex + 1).padStart(2, "0")} /{" "}
        {String(sectionCount).padStart(2, "0")}
      </div>
      <div className="scene-summary-content" key={section.id}>
        <p>{section.kicker}</p>
        <h1>{section.title}</h1>
        <div className="summary-row">
          <span>{section.description}</span>
          {section.href && (
            <a href={section.href}>{section.action || "View details"}</a>
          )}
        </div>

        <div
          className="scene-records"
          aria-label={`${section.label} highlights`}
        >
          {section.entries.map((entry) => (
            <SectionRecord
              entry={entry}
              key={`${entry.label}-${entry.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
