import { Vector3 } from 'three'
import { RapierRigidBody, useRopeJoint } from '@react-three/rapier'

// Helper to generate positions for each joint
export const generateNet = (
  heightSegments: number,
  radialSegments: number,
  baseRadius: number,
) => {
  const positions = []
  for (let h = 0; h < heightSegments; h++) {
    const radius = baseRadius * Math.pow(0.95, h)
    for (let r = 0; r < radialSegments; r++) {
      const angle = (r / radialSegments) * Math.PI * 2
      const x = radius * Math.cos(angle)
      const z = radius * Math.sin(angle)
      const y = h * -0.25 // Vertical spacing
      positions.push(new Vector3(x, y, z))
    }
  }
  return positions
}

type NetJointProps = {
  a: React.RefObject<RapierRigidBody> // Reference to the first rigid body
  b: React.RefObject<RapierRigidBody> // Reference to the second rigid body
  maxDistance: number
}
// Hook to create joints between two points
export const NetJoint: React.FC<NetJointProps> = ({ a, b, maxDistance }) => {
  useRopeJoint(a, b, [
    [0, 0, 0], // Local anchor for joint A
    [0, 0, 0], // Local anchor for joint B
    maxDistance, // Max distance between points (rope length)
  ])
  return null
}
