import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Stage, Stats } from "@react-three/drei";
import { Model } from "./assets/Apple";
import { Suspense } from "react";
import FaceTracker from "./FaceTracker";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FaceTracker />
      <Canvas
        resize={{ scroll: false }}
        camera={{ position: [0, 1, 1.5], fov: 50 }}
        shadows
        dpr={[1, 2]}
      >
        <color attach="background" args={["#222222"]} />
        <OrbitControls autoRotate={true} enableZoom={false} />
        <Stage shadows="contact" adjustCamera={false}>
          <Suspense fallback={null}>
            <Model />
            <ContactShadows
              frames={1}
              position={[0, 0, 0]}
              opacity={0.5}
              scale={5}
              blur={2}
              far={4}
            />
          </Suspense>
        </Stage>
        <Stats className="custom-stats" />
      </Canvas>
    </div>
  );
}

export default App;
