import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { GLTF } from "three-stdlib";
import type { JSX } from "react";

type GLTFResult = GLTF & {
  nodes: {
    Apple_state_1: THREE.Mesh;
  };
  materials: {
    apple_state_01: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/Apple.glb"
  ) as unknown as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Apple_state_1.geometry}
        material={materials.apple_state_01}
        rotation={[-Math.PI, 0, -Math.PI]}
        scale={0.01}
      />
    </group>
  );
}

useGLTF.preload("/models/Apple.glb");
