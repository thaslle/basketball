export const SETTINGS = {
  gameTime: 24, // seconds to finish the game
  totalBalls: 10, // Must be odd, > totalRacks and divisible by totalRacks
  totalRacks: 5, // Must be odd
  roundSegments: 16,
  rackDistance: 8,
  ringPosition: { x: 0, y: 3, z: -2.4 },
  shotSpanTime: 0.5,
  cameraMinDistance: 3,
  cameraDistance: 7,
  cameraPos: { x: 0, y: 7, z: 20 },
  groupKnots: 0b0001,
  groupBalls: 0b0010,
};