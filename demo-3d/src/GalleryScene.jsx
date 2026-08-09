import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { galleryAssets, sections, siteConfig } from "@profile";

const publicAssetUrl = (asset) => `./public/${asset}`;
const homeNotebookUrl = galleryAssets.homeNotebook
  ? publicAssetUrl(galleryAssets.homeNotebook)
  : null;
const characterFrameUrls = galleryAssets.characterFrames.map(publicAssetUrl);
const researchCoverUrls = galleryAssets.researchCovers.map(publicAssetUrl);

const paper = "#ddd8ce";
const charcoal = "#0d1217";
const structure = "#283038";

function CameraRig({ activeIndex, reduceMotion }) {
  const { camera, size } = useThree();
  const position = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const desiredLookAt = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const section = sections[activeIndex];
    const mobile = size.width < 760;
    const damping = 1 - Math.exp(-delta * 2.15);
    const pointerX = mobile ? 0 : state.pointer.x * 0.46;
    const pointerY = mobile ? 0 : state.pointer.y * 0.18;

    position.current.set(pointerX, 1.45 + pointerY, section.z + 13);
    desiredLookAt.current.set(pointerX * 0.2, 0.15, section.z - 0.8);
    if (reduceMotion) {
      camera.position.copy(position.current);
      lookAt.current.copy(desiredLookAt.current);
    } else {
      camera.position.lerp(position.current, damping);
      lookAt.current.lerp(desiredLookAt.current, damping);
    }
    camera.lookAt(lookAt.current);
  });

  return null;
}

function GalleryArchitecture() {
  return (
    <group>
      <mesh position={[0, -2.05, -72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[17, 168]} />
        <meshStandardMaterial color="#11171c" roughness={0.92} />
      </mesh>
      <gridHelper
        args={[168, 84, "#39434b", "#1d252c"]}
        position={[0, -2.02, -72]}
      />
      <mesh position={[-7.5, 2.2, -72]}>
        <boxGeometry args={[0.24, 8.5, 168]} />
        <meshStandardMaterial color="#0b1014" roughness={1} />
      </mesh>
      <mesh position={[7.5, 2.2, -72]}>
        <boxGeometry args={[0.24, 8.5, 168]} />
        <meshStandardMaterial color="#0b1014" roughness={1} />
      </mesh>

      {sections.map((section, index) => (
        <group key={section.id} position={[0, 0, section.z]}>
          <mesh position={[-6.35, 1.25, 0]}>
            <boxGeometry args={[0.08, 6.6, 0.1]} />
            <meshStandardMaterial color={structure} metalness={0.3} />
          </mesh>
          <mesh position={[6.35, 1.25, 0]}>
            <boxGeometry args={[0.08, 6.6, 0.1]} />
            <meshStandardMaterial color={structure} metalness={0.3} />
          </mesh>
          <mesh position={[0, 4.52, 0]}>
            <boxGeometry args={[12.8, 0.08, 0.1]} />
            <meshStandardMaterial color={structure} metalness={0.3} />
          </mesh>
          <mesh position={[index % 2 === 0 ? -6.95 : 6.95, 1.2, 0]}>
            <boxGeometry args={[0.5, 6.2, 7.8]} />
            <meshStandardMaterial color="#11171c" roughness={0.96} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const networkPoints = [
  [-2.7, 0.2, 0],
  [-1.8, 1.1, 0.2],
  [-0.8, 0.45, -0.2],
  [0.15, 1.45, 0.1],
  [1.1, 0.35, 0],
  [2.25, 1.1, -0.25],
  [2.9, 0.15, 0.2],
];

function ResearchNetwork({ color, compact = false }) {
  const points = compact ? networkPoints.slice(1, 6) : networkPoints;
  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.7}
      />
      {points.map((point, index) => (
        <mesh key={`${point.join("-")}-${index}`} position={point}>
          <sphereGeometry args={[index % 2 === 0 ? 0.09 : 0.065, 12, 12]} />
          <meshBasicMaterial color={index % 3 === 0 ? paper : color} />
        </mesh>
      ))}
    </group>
  );
}

function CharacterBillboard({ reduceMotion }) {
  const material = useRef();
  const { size } = useThree();
  const textures = useTexture(characterFrameUrls);

  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  });

  useFrame(({ clock }) => {
    if (!material.current) return;
    if (reduceMotion) {
      material.current.map = textures[0];
      return;
    }
    const phase = clock.elapsedTime % 7;
    const frame =
      phase < 0.22 || (phase >= 0.48 && phase < 0.7) ? 1 : phase < 0.92 ? 2 : 0;
    if (material.current.map !== textures[frame]) {
      material.current.map = textures[frame];
      material.current.needsUpdate = true;
    }
  });

  const mobile = size.width < 760;
  return (
    <Float
      speed={reduceMotion ? 0 : 1.2}
      rotationIntensity={reduceMotion ? 0 : 0.025}
      floatIntensity={reduceMotion ? 0 : 0.12}
    >
      <sprite
        position={[mobile ? 0.7 : 3.45, mobile ? 0.2 : 0.35, 0.15]}
        scale={mobile ? [2.7, 4.5, 1] : [3.7, 6.15, 1]}
      >
        <spriteMaterial
          ref={material}
          map={textures[0]}
          transparent
          alphaTest={0.04}
          depthWrite={false}
        />
      </sprite>
    </Float>
  );
}

function HomeNotebook({ reduceMotion }) {
  const texture = useTexture(homeNotebookUrl);
  const { size } = useThree();
  const mobile = size.width < 760;
  const width = mobile ? 2.25 : 3.15;
  const height = width * (1392 / 1130);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  return (
    <Float
      speed={reduceMotion ? 0 : 0.68}
      rotationIntensity={reduceMotion ? 0 : 0.018}
      floatIntensity={reduceMotion ? 0 : 0.08}
    >
      <group
        position={mobile ? [0.12, 1.38, -0.1] : [1.35, 1.38, -0.1]}
        rotation={[0, mobile ? 0.015 : 0.035, 0]}
      >
        <mesh>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            map={texture}
            transparent
            alphaTest={0.04}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </Float>
  );
}

function HomeExhibit({ section, active, reduceMotion }) {
  return (
    <group position={[0, 0, section.z]}>
      <mesh position={[0.4, -1.7, -0.5]}>
        <boxGeometry args={[5.2, 0.55, 3.8]} />
        <meshStandardMaterial color="#171d22" roughness={0.82} />
      </mesh>
      {homeNotebookUrl && <HomeNotebook reduceMotion={reduceMotion} />}
      {characterFrameUrls.length > 0 && (
        <CharacterBillboard reduceMotion={reduceMotion} />
      )}
      <pointLight
        position={[2.8, 2.8, 2.5]}
        color={section.accent}
        intensity={active ? 13 : 3}
        distance={12}
      />
    </group>
  );
}

function ResearchExhibit({ section, active, reduceMotion }) {
  const textures = useTexture(researchCoverUrls);

  textures.forEach((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  });

  return (
    <group position={[0, 0, section.z]}>
      {textures.map((texture, index) => {
        const x = (index - 1) * 3.45;
        return (
          <Float
            key={texture.uuid}
            speed={reduceMotion ? 0 : 0.72 + index * 0.08}
            rotationIntensity={reduceMotion ? 0 : 0.025}
            floatIntensity={reduceMotion ? 0 : 0.12}
          >
            <mesh position={[x, 0.75 + (index % 2) * 0.25, 0]}>
              <boxGeometry args={[3.1, 3.9, 0.09]} />
              <meshStandardMaterial color={paper} roughness={0.9} />
            </mesh>
            <mesh position={[x, 0.75 + (index % 2) * 0.25, 0.055]}>
              <planeGeometry args={[2.76, 2.76]} />
              <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>
          </Float>
        );
      })}
      <group position={[0, -1.05, 0.5]} scale={0.8}>
        <ResearchNetwork color={section.accent} />
      </group>
      <mesh position={[0, -1.78, -0.3]}>
        <boxGeometry args={[9.8, 0.42, 2.8]} />
        <meshStandardMaterial color="#171d22" roughness={0.82} />
      </mesh>
      <pointLight
        position={[0, 3, 3]}
        color={section.accent}
        intensity={active ? 15 : 3}
        distance={12}
      />
    </group>
  );
}

function wrapCanvasText(
  context,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  maxLines = 2,
) {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((currentLine, index) => {
    let output = currentLine;
    if (index === maxLines - 1 && lines.length > maxLines) {
      while (
        context.measureText(`${output}...`).width > maxWidth &&
        output.length > 4
      ) {
        output = output.slice(0, -1);
      }
      output = `${output.trim()}...`;
    }
    context.fillText(output, x, y + index * lineHeight);
  });

  return y + Math.min(lines.length, maxLines) * lineHeight;
}

function useEditorialTexture(section) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    const margin = 54;

    context.fillStyle = "#e5e0d6";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgba(18, 25, 28, 0.13)";
    context.lineWidth = 2;
    for (let y = 28; y < canvas.height; y += 32) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.stroke();
    }

    context.fillStyle = section.accent;
    context.fillRect(0, 0, 18, canvas.height);
    context.font = "700 25px ui-monospace, monospace";
    context.fillText(`${section.code} / RESEARCH ATLAS`, margin, 68);
    context.fillRect(margin, 94, 660, 5);

    context.fillStyle = charcoal;
    context.font = "600 58px Georgia, serif";
    const titleBottom = wrapCanvasText(
      context,
      section.title,
      margin,
      164,
      660,
      62,
      2,
    );

    const entriesStart = Math.max(286, titleBottom + 36);
    section.entries.slice(0, 3).forEach((entry, index) => {
      const top = entriesStart + index * 225;
      context.strokeStyle = "rgba(18, 25, 28, 0.2)";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(margin, top - 30);
      context.lineTo(714, top - 30);
      context.stroke();

      context.fillStyle = section.accent;
      context.font = "700 20px ui-monospace, monospace";
      context.fillText(entry.label.toUpperCase(), margin, top);
      context.fillStyle = charcoal;
      context.font = "700 30px Arial, sans-serif";
      wrapCanvasText(context, entry.title, margin, top + 48, 650, 36, 2);
      context.fillStyle = "#596064";
      context.font = "500 21px Arial, sans-serif";
      wrapCanvasText(context, entry.meta, margin, top + 132, 650, 28, 2);
    });

    context.fillStyle = "rgba(18, 25, 28, 0.6)";
    context.font = "600 18px ui-monospace, monospace";
    context.fillText(
      `${siteConfig.name} / ${siteConfig.institution}`.toUpperCase(),
      margin,
      980,
    );

    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    return result;
  }, [section]);

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function EditorialBoard({ section, reduceMotion, lean = 0.08 }) {
  const { size } = useThree();
  const mobile = size.width < 760;
  const texture = useEditorialTexture(section);
  const width = mobile ? 2.55 : 3.75;
  const height = mobile ? 3.4 : 5;

  return (
    <Float
      speed={reduceMotion ? 0 : 0.58}
      rotationIntensity={reduceMotion ? 0 : 0.012}
      floatIntensity={reduceMotion ? 0 : 0.08}
    >
      <group
        position={[mobile ? 1.15 : 2.75, mobile ? 0.7 : 0.65, -0.1]}
        rotation={[0, -lean, 0.012]}
      >
        <mesh>
          <boxGeometry args={[width + 0.16, height + 0.16, 0.14]} />
          <meshStandardMaterial color="#20272c" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0, 0.076]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

function ExhibitBase({ width = 9.4 }) {
  return (
    <mesh position={[0, -1.76, -0.3]}>
      <boxGeometry args={[width, 0.42, 2.8]} />
      <meshStandardMaterial color="#171d22" roughness={0.82} />
    </mesh>
  );
}

function ExhibitLight({ section, active }) {
  return (
    <pointLight
      position={[1.8, 2.8, 2.6]}
      color={section.accent}
      intensity={active ? 14 : 2.5}
      distance={12}
    />
  );
}

function NewsExhibit({ section, active, reduceMotion }) {
  const dates = ["01 MAR", "15 FEB", "20 JAN"];
  return (
    <group position={[0, 0, section.z]}>
      <EditorialBoard section={section} reduceMotion={reduceMotion} />
      <group position={[-2.55, 0.55, 0.1]} rotation={[0, 0.08, 0]}>
        <Line
          points={[
            [0, -1.85, 0],
            [0, 2.25, 0],
          ]}
          color={section.accent}
          lineWidth={1.5}
        />
        {dates.map((date, index) => {
          const y = 1.65 - index * 1.32;
          return (
            <group key={date} position={[index % 2 ? -0.35 : 0.28, y, 0]}>
              <mesh
                position={[0, 0, 0.02]}
                rotation={[0, 0, index * 0.025 - 0.02]}
              >
                <boxGeometry args={[2.65, 0.88, 0.08]} />
                <meshStandardMaterial color={paper} roughness={0.94} />
              </mesh>
              <mesh position={[-1.05, 0, 0.075]}>
                <boxGeometry args={[0.34, 0.14, 0.02]} />
                <meshBasicMaterial color={section.accent} />
              </mesh>
              <mesh position={[1.02, 0.28, 0.08]}>
                <sphereGeometry args={[0.07, 14, 14]} />
                <meshStandardMaterial
                  color={section.accent}
                  emissive={section.accent}
                  emissiveIntensity={active ? 0.8 : 0.2}
                />
              </mesh>
            </group>
          );
        })}
      </group>
      <ExhibitBase />
      <ExhibitLight section={section} active={active} />
    </group>
  );
}

function FundingExhibit({ section, active, reduceMotion }) {
  const ledgers = [
    { y: -1.05, width: 3.7, depth: 1.55 },
    { y: -0.28, width: 3.05, depth: 1.28 },
    { y: 0.42, width: 2.42, depth: 1.02 },
  ];
  return (
    <group position={[0, 0, section.z]}>
      <EditorialBoard
        section={section}
        reduceMotion={reduceMotion}
        lean={0.04}
      />
      <group position={[-2.4, 0, 0]} rotation={[0, -0.1, 0]}>
        {ledgers.map((ledger, index) => (
          <group key={ledger.width} position={[0, ledger.y, 0]}>
            <mesh>
              <boxGeometry args={[ledger.width, 0.54, ledger.depth]} />
              <meshStandardMaterial
                color={index === 2 ? paper : "#2a3034"}
                roughness={0.88}
              />
            </mesh>
            <mesh
              position={[
                -ledger.width / 2 + 0.12,
                0.01,
                ledger.depth / 2 + 0.015,
              ]}
            >
              <boxGeometry args={[0.13, 0.34, 0.02]} />
              <meshBasicMaterial color={section.accent} />
            </mesh>
          </group>
        ))}
        <Line
          points={[
            [-1.35, -0.72, 0.85],
            [-0.85, 0.12, 0.72],
            [0, 0.76, 0.58],
            [1.1, -0.72, 0.85],
          ]}
          color={section.accent}
          lineWidth={1}
        />
      </group>
      <ExhibitBase />
      <ExhibitLight section={section} active={active} />
    </group>
  );
}

function CollaboratorsExhibit({ section, active, reduceMotion }) {
  const nodes = [
    [-3.55, 1.2, 0.18],
    [-2.25, 1.75, 0.05],
    [-1.15, 0.9, 0.15],
    [-3.15, -0.15, 0.1],
    [-1.65, -0.55, 0.08],
  ];
  return (
    <group position={[0, 0, section.z]}>
      <EditorialBoard section={section} reduceMotion={reduceMotion} />
      <Line
        points={[nodes[0], nodes[1], nodes[2], nodes[4], nodes[3], nodes[0]]}
        color={section.accent}
        lineWidth={1.2}
        transparent
        opacity={0.82}
      />
      {nodes.map((node, index) => (
        <group key={node.join("-")} position={node}>
          <mesh>
            <sphereGeometry args={[index === 1 ? 0.24 : 0.16, 18, 18]} />
            <meshStandardMaterial
              color={index === 1 ? paper : section.accent}
              emissive={section.accent}
              emissiveIntensity={active ? 0.32 : 0.08}
            />
          </mesh>
          <mesh position={[0, -0.42, 0]}>
            <boxGeometry args={[0.62, 0.34, 0.07]} />
            <meshStandardMaterial color={paper} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[-2.4, -1.34, -0.1]}>
        <boxGeometry args={[3.9, 0.22, 1.65]} />
        <meshStandardMaterial color="#272e33" roughness={0.88} />
      </mesh>
      <ExhibitBase />
      <ExhibitLight section={section} active={active} />
    </group>
  );
}

function TeachingExhibit({ section, active, reduceMotion }) {
  return (
    <group position={[0, 0, section.z]}>
      <EditorialBoard
        section={section}
        reduceMotion={reduceMotion}
        lean={0.05}
      />
      <group position={[-2.45, -0.2, -0.1]} rotation={[0, 0.08, 0]}>
        {[0, 1, 2].map((index) => (
          <group
            key={index}
            position={[0, -0.85 + index * 0.65, -index * 0.24]}
          >
            <mesh>
              <boxGeometry args={[4.1 - index * 0.5, 0.5, 1.2]} />
              <meshStandardMaterial
                color={index === 2 ? "#343b37" : "#242b2d"}
                roughness={0.9}
              />
            </mesh>
            <mesh
              position={[-1.3 + index * 0.24, 0.27, 0.15]}
              rotation={[-0.18, 0, -0.02]}
            >
              <boxGeometry args={[0.9, 0.05, 0.64]} />
              <meshStandardMaterial color={paper} roughness={0.96} />
            </mesh>
          </group>
        ))}
        <group position={[0.65, 1.5, -0.25]}>
          <mesh>
            <boxGeometry args={[1.55, 1.3, 0.1]} />
            <meshStandardMaterial color={paper} roughness={0.94} />
          </mesh>
          {[0.28, 0, -0.28].map((y, index) => (
            <mesh key={y} position={[0, y, 0.06]}>
              <boxGeometry args={[1.05 - index * 0.13, 0.04, 0.02]} />
              <meshBasicMaterial color={section.accent} />
            </mesh>
          ))}
        </group>
      </group>
      <ExhibitBase />
      <ExhibitLight section={section} active={active} />
    </group>
  );
}

function ServiceExhibit({ section, active, reduceMotion }) {
  const seats = [
    [-3.55, 0.45],
    [-2.25, 1.35],
    [-1.05, 0.35],
  ];
  return (
    <group position={[0, 0, section.z]}>
      <EditorialBoard section={section} reduceMotion={reduceMotion} />
      <group position={[0, -0.18, 0]}>
        <mesh position={[-2.25, -0.2, 0]}>
          <cylinderGeometry args={[1.55, 1.55, 0.18, 48]} />
          <meshStandardMaterial color="#30363b" roughness={0.86} />
        </mesh>
        {seats.map(([x, y], index) => (
          <group key={x} position={[x, y, 0.15]}>
            <mesh>
              <sphereGeometry args={[0.19, 18, 18]} />
              <meshStandardMaterial
                color={index === 1 ? paper : section.accent}
                emissive={section.accent}
                emissiveIntensity={active ? 0.24 : 0.04}
              />
            </mesh>
            <mesh position={[0, -0.42, 0]}>
              <cylinderGeometry args={[0.32, 0.38, 0.12, 24]} />
              <meshStandardMaterial color="#1d2429" />
            </mesh>
          </group>
        ))}
        <mesh position={[-2.25, 0.05, 0.31]} rotation={[-0.08, 0, 0.08]}>
          <boxGeometry args={[1.2, 0.06, 0.82]} />
          <meshStandardMaterial color={paper} roughness={0.94} />
        </mesh>
      </group>
      <ExhibitBase />
      <ExhibitLight section={section} active={active} />
    </group>
  );
}

function AboutExhibit({ section, active, reduceMotion }) {
  const milestones = [1.55, 0.35, -0.85];
  return (
    <group position={[0, 0, section.z]}>
      <EditorialBoard
        section={section}
        reduceMotion={reduceMotion}
        lean={0.03}
      />
      <group position={[-2.45, 0.35, 0.08]}>
        <Line
          points={[
            [0, -1.9, 0],
            [0, 2.15, 0],
          ]}
          color={section.accent}
          lineWidth={1.5}
        />
        {milestones.map((y, index) => (
          <group key={y} position={[0, y, 0]}>
            <mesh>
              <sphereGeometry args={[index === 0 ? 0.15 : 0.1, 16, 16]} />
              <meshStandardMaterial
                color={index === 0 ? paper : section.accent}
                emissive={section.accent}
                emissiveIntensity={active ? 0.55 : 0.1}
              />
            </mesh>
            <mesh position={[index % 2 ? -0.95 : 0.95, 0, -0.02]}>
              <boxGeometry args={[1.55, 0.7, 0.08]} />
              <meshStandardMaterial color={paper} roughness={0.92} />
            </mesh>
            <mesh position={[index % 2 ? -0.95 : 0.95, 0.1, 0.03]}>
              <boxGeometry args={[0.96, 0.06, 0.02]} />
              <meshBasicMaterial color={section.accent} />
            </mesh>
          </group>
        ))}
      </group>
      <ExhibitBase />
      <ExhibitLight section={section} active={active} />
    </group>
  );
}

function ContactExhibit({ section, active, reduceMotion }) {
  return (
    <group position={[0, 0, section.z]}>
      <EditorialBoard
        section={section}
        reduceMotion={reduceMotion}
        lean={0.05}
      />
      <group position={[-2.45, 0.3, 0]} rotation={[0, 0.08, -0.025]}>
        <mesh>
          <boxGeometry args={[3.65, 2.45, 0.12]} />
          <meshStandardMaterial color={paper} roughness={0.94} />
        </mesh>
        <Line
          points={[
            [-1.72, 1.12, 0.08],
            [0, -0.1, 0.1],
            [1.72, 1.12, 0.08],
          ]}
          color={section.accent}
          lineWidth={1.5}
        />
        <Line
          points={[
            [-1.72, -1.12, 0.08],
            [-0.35, 0.12, 0.1],
          ]}
          color="#596064"
          lineWidth={1}
        />
        <Line
          points={[
            [1.72, -1.12, 0.08],
            [0.35, 0.12, 0.1],
          ]}
          color="#596064"
          lineWidth={1}
        />
        <mesh position={[0, -0.12, 0.12]}>
          <sphereGeometry args={[0.13, 18, 18]} />
          <meshStandardMaterial
            color={section.accent}
            emissive={section.accent}
            emissiveIntensity={active ? 1 : 0.25}
          />
        </mesh>
      </group>
      <ExhibitBase />
      <ExhibitLight section={section} active={active} />
    </group>
  );
}

const exhibitBySectionId = {
  home: HomeExhibit,
  research: ResearchExhibit,
  news: NewsExhibit,
  funding: FundingExhibit,
  collaborators: CollaboratorsExhibit,
  teaching: TeachingExhibit,
  service: ServiceExhibit,
  about: AboutExhibit,
  contact: ContactExhibit,
};

export default function GalleryScene({ activeIndex, reduceMotion }) {
  return (
    <>
      <ambientLight intensity={1.25} color="#c9d2d5" />
      <directionalLight position={[4, 8, 10]} intensity={2.2} color="#efe4d2" />
      <CameraRig activeIndex={activeIndex} reduceMotion={reduceMotion} />
      <GalleryArchitecture />
      {sections.map((section, index) => {
        const Exhibit = exhibitBySectionId[section.id];
        if (!Exhibit) {
          throw new Error(
            `No 3D exhibit registered for section: ${section.id}`,
          );
        }
        return (
          <Exhibit
            key={section.id}
            section={section}
            active={activeIndex === index}
            reduceMotion={reduceMotion}
          />
        );
      })}
    </>
  );
}
