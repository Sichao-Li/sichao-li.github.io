import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import GalleryScene from "./GalleryScene";
import SceneNavigation from "./SceneNavigation";
import SceneSummary from "./SceneSummary";
import { sections } from "@profile";
import { useReducedMotion, useSectionNavigation } from "./useSectionNavigation";

export default function App() {
  const reduceMotion = useReducedMotion();
  const { activeIndex, navigationRef, selectSection } = useSectionNavigation(
    sections.length,
    reduceMotion,
  );
  const activeSection = sections[activeIndex];

  return (
    <div className="app" style={{ "--accent": activeSection.accent }}>
      <a className="skip-link" href="#scene-summary">
        Skip 3D scene
      </a>

      <SceneNavigation
        activeIndex={activeIndex}
        navigationRef={navigationRef}
        sections={sections}
        selectSection={selectSection}
      />

      <main className="scene-shell" aria-label="Interactive research gallery">
        <Canvas
          aria-hidden="true"
          camera={{ position: [0, 1.5, 13], fov: 46, near: 0.1, far: 190 }}
          dpr={[1, 1.5]}
          fallback={
            <div className="scene-fallback" role="status">
              The 3D scene is unavailable. Use the portfolio navigation above.
            </div>
          }
          gl={{ antialias: true, powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#080b0f"]} />
          <fog attach="fog" args={["#080b0f", 18, 64]} />
          <Suspense fallback={null}>
            <GalleryScene
              activeIndex={activeIndex}
              reduceMotion={reduceMotion}
            />
          </Suspense>
        </Canvas>
      </main>

      <SceneSummary
        activeIndex={activeIndex}
        section={activeSection}
        sectionCount={sections.length}
      />

      <div className="scene-progress" aria-hidden="true">
        <span
          style={{
            transform: `scaleX(${(activeIndex + 1) / sections.length})`,
          }}
        ></span>
      </div>

      <Loader
        containerStyles={{ background: "#080b0f" }}
        innerStyles={{ width: "180px", background: "#242a2f" }}
        barStyles={{ background: activeSection.accent, height: "2px" }}
        dataStyles={{ color: "#f4f3ef", fontSize: "12px" }}
      />
    </div>
  );
}
