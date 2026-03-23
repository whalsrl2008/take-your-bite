import { Canvas } from "@react-three/fiber";
import { ContactShadows, Grid, OrbitControls, Stage } from "@react-three/drei";
import { Model } from "./assets/Apple";
import { useControls } from "leva";
import { Suspense } from "react";

function App() {
  const { gridSize, ...gridConfig } = useControls({
    gridSize: [10.5, 10.5],
    cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
    cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
    cellColor: "#6f6f6f",
    sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
    sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
    sectionColor: "#9d4b4b",
    fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
    fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
    followCamera: false,
    infiniteGrid: true,
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        resize={{ scroll: false }}
        camera={{ position: [0, 1, 1.5], fov: 50 }}
        shadows
      >
        <color attach="background" args={["#222222"]} />
        <OrbitControls autoRotate={true} enableZoom={false} />
        <Stage shadows="contact" adjustCamera={false}>
          <Suspense fallback={null}>
            <Model />
            <ContactShadows
              position={[0, 0, 0]}
              opacity={0.5}
              scale={5}
              blur={2}
              far={4}
            />
          </Suspense>
        </Stage>
        <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
      </Canvas>
    </div>
  );
}

export default App;
