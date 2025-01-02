import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { StripesShaderMaterial } from './stripes-shader-material'

type NetProps = {
  vertices: number[]
  indices: number[]
  uvs: number[]
}

export const NetMesh = ({ vertices, indices, uvs }: NetProps) => {
  const geometryRef = useRef(new THREE.BufferGeometry())

  useEffect(() => {
    geometryRef.current.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3),
    )
    geometryRef.current.setAttribute(
      'uv',
      new THREE.Float32BufferAttribute(uvs, 2),
    ) // Apply UVs
    geometryRef.current.setIndex(indices)
    geometryRef.current.computeVertexNormals() // Ensure normals for lighting
  }, [vertices, indices, uvs])

  // Extends material so it can be used
  extend({ StripesShaderMaterial })

  return (
    <mesh position={[0, -2.92, 2.4]} renderOrder={1} frustumCulled={false}>
      <bufferGeometry ref={geometryRef} />
      <stripesShaderMaterial
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        depthTest={true}
        alphaTest={0.5}
      />
    </mesh>
  )
}
