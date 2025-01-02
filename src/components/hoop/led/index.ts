import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function getLedGeometry() {
  const { nodes } = useGLTF('/models/Court.glb')
  return (nodes.Led as THREE.Mesh).geometry
}

useGLTF.preload('/models/Court.glb')
