
import { runWithFileContents, log } from '../../utils.js';

function dist([a, b, c], [x, y, z]) {
  return Math.hypot(a - x, b - y, z - c)
}

function partOne(contents, isTesting) {
  const connectionsCount = isTesting ? 10 : 1000;
  const boxes = contents.split('\n')

  const distances = []
  for (let i = 0, ibox = boxes[i]; i < boxes.length; ibox = boxes[++i]) {
    const icoords = ibox.split(',')
    for (let j = i + 1, jbox = boxes[j]; j < boxes.length; jbox = boxes[++j]) {
      const jcoords = jbox.split(',')
      distances.push({
        ibox,
        jbox,
        distance: dist(icoords, jcoords)
      })
    }
  }

  distances.sort(({ distance: a }, { distance: b }) => a - b)

  const connections = new Map();
  for (let i = 0; i < connectionsCount; i++) {
    const { ibox, jbox } = distances[i]
    if (connections.has(ibox) && !connections.has(jbox)) {
      connections.set(jbox, connections.get(ibox))
    }
    else if (!connections.has(ibox) && connections.has(jbox)) {
      connections.set(ibox, connections.get(jbox))
    }
    else if (!connections.has(ibox) && !connections.has(jbox)) {
      connections.set(ibox, i)
      connections.set(jbox, i)
    }
    else { // Connecting two established circuits
      const oldCircuitId = connections.get(ibox)
      const newCircuitId = connections.get(jbox)

      if (oldCircuitId === newCircuitId) continue

      connections
        .entries()
        .reduce((ac, [box, circuitId]) => circuitId === oldCircuitId ? [...ac, box] : ac, [])
        .forEach(box => {
          connections.set(box, newCircuitId)
        });
    }
  }

  const circuits = new Map()
  connections
    .entries()
    .forEach(([box, circuitId]) => {
      const value = circuits.has(circuitId)
        ? circuits.get(circuitId) + 1
        : 1
      circuits.set(circuitId, value)
    })

  const topCurcuitsSizes = Array.from(circuits.entries())
    .sort(([_, a], [__, b]) => b - a)
    .map(([_, size]) => size)
    .slice(0, 3)

  return topCurcuitsSizes.reduce((ac, size) => ac * size)
}

function partTwo(contents) {
  const boxes = contents.split('\n')

  const distances = []
  for (let i = 0, ibox = boxes[i]; i < boxes.length; ibox = boxes[++i]) {
    const icoords = ibox.split(',')
    for (let j = i + 1, jbox = boxes[j]; j < boxes.length; jbox = boxes[++j]) {
      const jcoords = jbox.split(',')
      distances.push({
        ibox,
        jbox,
        distance: dist(icoords, jcoords)
      })
    }
  }

  distances.sort(({ distance: a }, { distance: b }) => a - b)

  const circuitSizes = new Map();
  const connections = new Map();
  for (let i = 0; i < distances.length; i++) {
    let circuitId, newSize;
    const { ibox, jbox } = distances[i]

    // One or the other is in a circuits
    if (connections.has(ibox) && !connections.has(jbox)) {
      circuitId = connections.get(ibox)
      connections.set(jbox, circuitId)
      newSize = circuitSizes.get(circuitId) + 1
    }
    else if (!connections.has(ibox) && connections.has(jbox)) {
      circuitId = connections.get(jbox)
      connections.set(ibox, circuitId)
      newSize = circuitSizes.get(circuitId) + 1
    }
    // Neither is in a circuit
    else if (!connections.has(ibox) && !connections.has(jbox)) {
      circuitId = i
      connections.set(ibox, circuitId)
      connections.set(jbox, circuitId)
      newSize = 2
    }
    // Connecting two established circuits
    else {
      const oldCircuitId = connections.get(ibox)
      circuitId = connections.get(jbox)

      if (oldCircuitId === circuitId) continue

      connections.entries()
        .filter(([box, cId]) => cId === oldCircuitId)
        .forEach(([box]) => connections.set(box, circuitId))
      newSize = circuitSizes.get(oldCircuitId) + circuitSizes.get(circuitId)
    }

    if (newSize === boxes.length) {
      return ibox.split(',')[0] * jbox.split(',')[0]
    }

    circuitSizes.set(circuitId, newSize)
  }
}

runWithFileContents((contents, isTesting) => {
  // return partOne(contents, isTesting)
  return partTwo(contents)
})
