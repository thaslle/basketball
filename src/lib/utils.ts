import { Vector } from 'three/examples/jsm/Addons.js'
import { UserShot } from '~/store/use-shooting-store'
import { settings } from './config'

export const getRackIndex = (i: number) => {
  const ballsPerRack = Math.floor(settings.totalBalls / settings.totalRacks)
  return Math.floor(i / ballsPerRack)
}

// How close the user's input is to the expected value, based on a specified range
export const proximityToTarget = (
  value: number,
  expected: number,
  range: number,
) => {
  const difference = value - expected
  const absDifference = Math.abs(difference)
  const sign = Math.sign(difference) * -1 // Keep the same sign behavior

  // Determine the output based on the difference
  let r =
    absDifference <= range
      ? 0
      : absDifference <= range * 3
        ? ((absDifference - range) / (range * 2)) * sign // Map to -1 to 1
        : ((absDifference - range * 3) / range + 1) * sign

  return 100 - r // Return final value
}

// Shot physics
export const throwBallPhysics = (
  userFactor: UserShot,
  ballPos: Vector,
  ringPos: Vector,
) => {
  const g = 9.81 // Gravity

  // Projectile Motion Physics
  // First, we calculate the velocity required along the X and Z axes to make the shot.
  // Since it's a 3D space, we must consider the distance between the ball and the hoop,
  // ensuring the ball reaches a height greater than the ring's Y-coordinate for it to go in
  const deltaX = ringPos.x - ballPos.x
  const deltaZ = ringPos.z - ballPos.z
  const horizontalDist = Math.sqrt(deltaX ** 2 + deltaZ ** 2)
  const maxH = ringPos.y + 1 + horizontalDist / 10 // Determine the max height based on distance
  const vY = Math.sqrt(2 * g * (maxH - ballPos.y))
  const totalFlightTime = (2 * vY) / g // Total time for the ball to reach the highest point and come down
  const vX = deltaX / totalFlightTime
  const vZ = deltaZ / totalFlightTime

  // For some reason, I needed to fine-tune it a bit,
  // so I came up with a constant that ensures a perfect shot
  const perfectShotConstant = 0.12231 // Stephen Curry

  // Then we get a multiplier from the user gesture
  const userShotModifier = {
    y: proximityToTarget(userFactor.y, 200, 10) / 100,
    t: proximityToTarget(userFactor.t * 8, 1, 1) / 100,
  }

  // Let's not forget that user needs to aim
  const userRotation = Math.atan2(userFactor.x, userFactor.y) * -0.09

  // It's an arcade game, so we use the perfect shot as a standard
  // and subtract points based on how close the user's gesture is to
  // the expected gesture to determine their shot accuracy
  const impulseVec = {
    x:
      (vX * Math.cos(userRotation) - vZ * Math.sin(userRotation)) *
      perfectShotConstant,
    y:
      vY *
      ((userShotModifier.y + userShotModifier.t) / 2) *
      perfectShotConstant,
    z:
      (vX * Math.sin(userRotation) + vZ * Math.cos(userRotation)) *
      perfectShotConstant,
  }

  // In a good basketball shot, the ball always spins backward.
  // Here we need to consider our position relative to the rim.
  const absvX = Math.abs(vX)
  const absvZ = Math.abs(vZ)

  const rX = ((vZ * -1) / (absvX + absvZ)) * 30
  const rZ = (vX / (absvX + absvZ)) * 30

  const rotationVec = { x: rX, y: 0, z: rZ }

  return { impulseVec: impulseVec, rotationVec: rotationVec }
}
