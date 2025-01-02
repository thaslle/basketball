export const settings = {
  gameTime: 24, // seconds to finish the game
  totalBalls: 10, // Must be odd, > totalRacks and divisible by totalRacks
  totalRacks: 5, // Must be odd
  roundSegments: 16,
  rackDistance: 8,
  ringPosition: { x: 0, y: 3, z: -2.4 },
  shotSpawnTime: 0.5,
  cameraMinDistance: 3,
  cameraDistance: 7,
  cameraPos: { x: 0, y: 7, z: 20 },
  groupBalls: 0x000f000f, // Maks group for collision purposes
  groupKnots: 0x00020001, // Maks group for collision purposes
  groupLevel: 0x00040001, // Maks group for collision purposes
}
