import { useGLTF } from '@react-three/drei'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { settings } from '~/lib/config'

export function Court() {
  const { nodes, materials } = useGLTF('/models/Court.glb')

  const customMaterial = new THREE.MeshStandardMaterial({
    map: (materials['Sprite Material'] as THREE.MeshStandardMaterial).map,
    normalMap: (materials['Sprite Material'] as THREE.MeshStandardMaterial)
      .normalMap,
    fog: false,
  })

  return (
    <group dispose={null} position={[0, -0.15, -4.8]}>
      <RigidBody
        type="fixed"
        name="floor"
        friction={20}
        colliders="hull"
        collisionGroups={settings.groupLevel}
      >
        <mesh
          geometry={(nodes.Floor as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, -0.8, 0]}
          scale={[15.9, 0.75, 6.994]}
          receiveShadow
        />
        <mesh
          geometry={(nodes.Cube as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 3.144, 2.08]}
          scale={[0.555, 0.137, 1]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stands001 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 0.2, -3]}
          scale={[9, 0.25, 1]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stands004 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-12.015, 0.2, 5.437]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5.67, 0.25, 1]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stands002 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[12.042, 0.2, 5.387]}
          rotation={[0, -1.571, 0]}
          scale={[5.67, 0.25, 1]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step006 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 0.5, -1.95]}
          scale={[9, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step004 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 1, -2.95]}
          scale={[9, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step005 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 1.5, -3.95]}
          scale={[9, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step013 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-10.965, 0.5, 5.437]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5.67, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step014 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-11.965, 1, 5.437]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5.67, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step015 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-12.965, 1.5, 5.437]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[5.67, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step007 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[10.992, 0.5, 5.387]}
          rotation={[0, -1.571, 0]}
          scale={[5.67, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step008 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[11.992, 1, 5.387]}
          rotation={[0, -1.571, 0]}
          scale={[5.67, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Step009 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[12.992, 1.5, 5.387]}
          rotation={[0, -1.571, 0]}
          scale={[5.67, 0.05, 0.05]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair001 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[4, 0.175, -1.75]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair002 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[3.972, 0.675, -2.75]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair003 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-4, 0.675, -2.75]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair004 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-3.987, 0.175, -1.75]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair005 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[3.972, 1.175, -3.75]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair006 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-4, 1.175, -3.75]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair013 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-10.765, 0.175, 5.029]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair014 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-11.765, 0.675, 5.057]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair017 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-12.765, 1.175, 5.057]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair010 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[10.792, 0.175, 5.796]}
          rotation={[0, -1.571, 0]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair011 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[11.792, 0.675, 5.767]}
          rotation={[0, -1.571, 0]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Stair012 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[12.792, 1.175, 5.767]}
          rotation={[0, -1.571, 0]}
          scale={[1.25, 0.125, 0.25]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube001 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-15.4, 0.45, -5.443]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube002 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-15.4, 0.45, -2.443]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube003 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-15.4, 0.45, 0.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube004 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-15.4, 0.45, 3.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube005 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-15.4, 0.45, 6.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube006 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-15.4, 0.45, 9.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube007 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-15.4, 0.45, 12.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube008 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-13.4, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube009 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-10.4, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube010 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-7.4, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube011 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-4.4, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube012 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[-1.4, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube013 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[1.6, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube014 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[4.6, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube015 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[7.6, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube016 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[10.6, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube017 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[13.6, 0.45, -6.443]}
          // castShadow
          // receiveShadow
          rotation={[0, Math.PI / 2, 0]}
        />
        <mesh
          geometry={(nodes.Cube018 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[15.6, 0.45, -5.443]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube019 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[15.6, 0.45, -2.443]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube020 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[15.6, 0.45, 0.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube021 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[15.6, 0.45, 3.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube022 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[15.6, 0.45, 6.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube024 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[15.6, 0.45, 9.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube025 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[15.6, 0.45, 12.557]}
          // castShadow
          // receiveShadow
        />
        <mesh
          geometry={(nodes.Cube023 as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 0, -1]}
          scale={[11, 0.05, 1]}
          receiveShadow
        />
      </RigidBody>

      {/* Backboard and Ring */}
      <RigidBody
        type="fixed"
        name="backboard"
        colliders="hull"
        collisionGroups={settings.groupLevel}
      >
        <mesh
          geometry={(nodes.Backboard as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 3.6, 1.73]}
          castShadow
        />
        <mesh
          geometry={(nodes.Post as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 0.45, 0]}
          castShadow
        />
      </RigidBody>

      <RigidBody
        type="fixed"
        name="ring"
        colliders="trimesh"
        collisionGroups={settings.groupLevel}
      >
        <mesh
          geometry={(nodes.Torus as THREE.Mesh).geometry}
          material={customMaterial}
          position={[0, 3.15, 2.4]}
          castShadow
        />
      </RigidBody>
    </group>
  )
}

useGLTF.preload('/models/Court.glb')
