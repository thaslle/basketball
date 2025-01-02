import React, { useRef, createRef, useState } from 'react'
import { RigidBody, RapierRigidBody } from '@react-three/rapier'
import { Sphere } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { settings } from '~/lib/config'
import { generateNet, NetJoint } from './helpers'
import { NetMesh } from './net-mesh'

type NetPointsProps = {
  vertices: number[]
  indices: number[]
  uvs: number[]
}

export const Net = ({
  heightSegments = 3,
  radialSegments = 6,
  baseRadius = 0.5,
}) => {
  const [netPoints, setNetPoints] = useState<NetPointsProps>({
    vertices: [],
    indices: [],
    uvs: [],
  })

  const refs = useRef(
    Array.from({ length: heightSegments * radialSegments }).map(() =>
      createRef<RapierRigidBody>(),
    ),
  )

  // Generate positions for each joint
  const positions = generateNet(heightSegments, radialSegments, baseRadius)

  // Animating the mesh since Rapier doesn't provide a soft body for cloth simulation
  useFrame(() => {
    const vertices: number[] = []
    const indices: number[] = []
    const uvs: number[] = []
    const uniqueVertices: Map<string, number> = new Map()

    const addVertex = (point: number[], uv: number[]) => {
      // Creating an unique key by merging the points
      const key = `${point[0]}_${point[1]}_${point[2]}`
      if (!uniqueVertices.has(key)) {
        uniqueVertices.set(key, vertices.length / 3)
        vertices.push(...point)
        uvs.push(...uv) // Store UV coordinates
      }
      return uniqueVertices.get(key)
    }

    refs.current.forEach((ref, i) => {
      if (!ref.current) return

      const row = Math.floor(i / radialSegments)
      const v = row / (refs.current.length / radialSegments - 1)
      const u = (i % radialSegments) / (radialSegments - 1)

      const topLeftIndex = i
      const topRightIndex =
        (i + 1) % radialSegments === 0 ? i - radialSegments + 1 : i + 1
      const bottomLeftIndex = topLeftIndex + radialSegments
      const bottomRightIndex = topRightIndex + radialSegments

      if (
        !refs.current[topLeftIndex]?.current ||
        !refs.current[topRightIndex]?.current ||
        !refs.current[bottomLeftIndex]?.current ||
        !refs.current[bottomRightIndex]?.current ||
        !(
          bottomLeftIndex < refs.current.length &&
          bottomRightIndex < refs.current.length
        )
      )
        return

      // Getting the four vertex coordinates of the quad
      const topLeft = refs.current[topLeftIndex].current.translation()
      const topRight = refs.current[topRightIndex].current.translation()
      const bottomLeft = refs.current[bottomLeftIndex].current.translation()
      const bottomRight = refs.current[bottomRightIndex].current.translation()

      // Create a vertex at each position
      const indexTL = addVertex([topLeft.x, topLeft.y, topLeft.z], [u, v])!
      const indexTR = addVertex(
        [topRight.x, topRight.y, topRight.z],
        [u + 1 / radialSegments, v],
      )!
      const indexBL = addVertex(
        [bottomLeft.x, bottomLeft.y, bottomLeft.z],
        [u, v + 1 / radialSegments],
      )!
      const indexBR = addVertex(
        [bottomRight.x, bottomRight.y, bottomRight.z],
        [u + 1 / radialSegments, v + 1 / radialSegments],
      )!

      // Then split these vertices into two triangles
      indices.push(indexTL, indexBL, indexBR) // Triangle 1
      indices.push(indexTL, indexBR, indexTR) // Triangle 2
    })

    setNetPoints({ vertices, indices, uvs })
  })

  // Creating rigid bodies at each knot of the net to interact with the balls and make the net move
  return (
    <group position={[0, -0.05, 0]}>
      {positions.map((pos, i) => (
        <RigidBody
          key={i}
          ref={refs.current[i]}
          colliders={'ball'}
          restitution={0.02}
          mass={10}
          density={10}
          linearDamping={0.5}
          angularDamping={0.5}
          friction={0.1}
          lockRotations={true}
          type={i < radialSegments ? 'kinematicPosition' : 'dynamic'}
          position={[pos.x, pos.y, pos.z]}
          name="net"
          collisionGroups={settings.groupKnots}
          onCollisionEnter={(event) => {
            // It also slows down the ball, preventing the ball from bouncing back to the shot position.
            if (event.rigidBody) {
              const currentLinvel = event.rigidBody.linvel()
              const newLinvel = {
                x: currentLinvel.x * 0.97,
                y: currentLinvel.y * 0.9,
                z: currentLinvel.z * 0.97,
              }
              event.rigidBody.setLinvel(newLinvel, true)
            }
          }}
        >
          <Sphere args={[0.045, 4, 4]}>
            <meshStandardMaterial transparent={true} opacity={0} fog={false} />
          </Sphere>
        </RigidBody>
      ))}

      {/* Creating the joints to connect the knots of the net */}
      {refs.current.map((_, i) => {
        const row = Math.floor(i / radialSegments)
        let maxVDistance = row === 0 ? 0.5 : row === 1 ? 0.5 : 0.4
        let maxHDistance = row === 0 ? 0.5 : row === 1 ? 0.38 : 0.34

        const firstNeighbor =
          (i + 1) % radialSegments === 0 ? i - radialSegments + 1 : i + 1
        const secondNeighbor = i - radialSegments

        return (
          <React.Fragment key={i}>
            {row > 0 && firstNeighbor >= 0 && (
              <NetJoint
                a={refs.current[i]}
                b={refs.current[firstNeighbor]}
                maxDistance={maxHDistance}
              />
            )}
            {row > 0 && secondNeighbor >= 0 && (
              <NetJoint
                a={refs.current[i]}
                b={refs.current[secondNeighbor]}
                maxDistance={maxVDistance}
              />
            )}
          </React.Fragment>
        )
      })}

      {/* Finally the net mesh */}
      {netPoints.vertices && netPoints.indices && (
        <NetMesh
          vertices={netPoints.vertices}
          indices={netPoints.indices}
          uvs={netPoints.uvs}
        />
      )}
    </group>
  )
}
