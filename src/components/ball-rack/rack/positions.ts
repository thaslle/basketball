import { settings } from '~/lib/config'

export const racksPositions = () => {
  const positions = []

  // Calculate the angle between the racks in a 180-degree range
  // It’s better to have an odd number of racks
  // so that the first one is always positioned on the free-throw line.
  const angleStep = Math.PI / (settings.totalRacks - 1)
  for (let i = 0; i < settings.totalRacks; i++) {
    const rackPosition = {
      x:
        settings.ringPosition.x +
        settings.rackDistance * Math.cos(i * angleStep),
      z:
        settings.ringPosition.z +
        settings.rackDistance * Math.sin(i * angleStep),
    }
    positions.push(rackPosition)
  }

  // Reordering the positions because we want to start from the free-throw line,
  // then move to the closest spot on the left, followed by the right, and so on
  const reorderedPositions = []
  const centerIndex = Math.floor(settings.totalRacks / 2)

  reorderedPositions.push(positions[centerIndex])

  let step = 1
  while (reorderedPositions.length < settings.totalRacks) {
    const rightIndex = centerIndex + step
    const leftIndex = centerIndex - step

    if (rightIndex < settings.totalRacks) {
      reorderedPositions.push(positions[rightIndex])
    }
    if (leftIndex >= 0) {
      reorderedPositions.push(positions[leftIndex])
    }
    step++
  }

  return reorderedPositions
}
