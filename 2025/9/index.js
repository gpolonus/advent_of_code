
import { runWithFileContents, log, logp } from '../../utils.js';

function partOne(contents) {
  const tiles = contents.split('\n').map(l => l.split(','))
  let largestArea = 0, area;
  log(tiles)
  for (let i = 0, [ix, iy] = tiles[i]; i < tiles.length; [ix, iy] = tiles[++i] || []) {
    for (let j = i + 1, [jx, jy] = tiles[j] || []; j < tiles.length; [jx, jy] = tiles[++j] || []) {
      area = Math.abs((ix - jx + 1) * (iy - jy + 1))
      if (area > largestArea)
        largestArea = area
    }
    log({i})
  }
  return largestArea
}

function partTwo(contents) {
  const tileIds = contents.split('\n')
  const tiles = tileIds.map(l => l.split(',').map(n => parseInt(n)))
  let largestArea = 0, area;

  const rectInside = checkInsideGenerator(contents)

  for (let i = 0, [ix, iy] = tiles[i]; i < tiles.length; [ix, iy] = tiles[++i] || []) {
    for (let j = i + 1, [jx, jy] = tiles[j] || []; j < tiles.length; [jx, jy] = tiles[++j] || []) {
      area = (Math.abs(ix - jx) + 1) * (Math.abs(iy - jy) + 1)
      if (area > largestArea && rectInside(tiles[i], tiles[j])) {
        largestArea = area
        console.log(area)
        console.log({ ix, iy, jx, jy })
      }
    }
  }

  return largestArea
}

runWithFileContents((contents, isTesting) => {
  // return partOne(contents, isTesting)
  return partTwo(contents)
  // drawMap(contents)()
})

/**
 * 4588084305 is too high
 * 4527535992 is too high
 * 4683163140 is way too high
 * 1985455615 is too high
 * 1351617690 is correct!
 */


function checkInsideGenerator(contents) {
  const tileIds = contents.split('\n')
  let tiles = tileIds.map(t => t.split(',').map(n => parseInt(n)))
  const [xs, ys] = tiles.reduce(([xs, ys], [x, y]) => [[...xs, x], [...ys, y]], [[], []])
  const minX = Math.min(...xs), minY = Math.min(...ys)
  tiles = tiles.map(([x, y]) => [x - minX, y - minY])

  let ySpots = []
  const setSpot = (y, x) => {
    if (!ySpots[y]) ySpots[y] = new Set()
    ySpots[y].add(x)
  }

  const hasSpot = (y, x, spots = ySpots) => spots[y] ? spots[y].has(x) : false

  // Collect all the lines between red tiles
  tiles.forEach(([x, y], i) => {
    setSpot(y, x)
    const [px, py] = tiles.at(i - 1)
    if (px === x) {
      for (let j = Math.min(y, py) + 1; j < Math.max(y, py); j++) {
        setSpot(j, x)
      }
    } else if (py === y) {
      const minX = Math.min(x, px), maxX = Math.max(x, px)
      for (let j = minX + 1; j < maxX; j++) {
        setSpot(y, j)
      }
    }
  })

  const xSpots = ySpots.reduce((ac, line, y) => {
    for (const x of line) {
      ac[x] ||= new Set
      ac[x].add(y)
    }
    return ac
  }, [])

  const spotInside = (x, y) => {
    if (hasSpot(y, x)) return true;

    let edgeHitCount = 0;
    for (let i = x - 1; i >= 0; i--) {
      const char = hasSpot(y, i) ? 'X' : '.'
      const nextChar = hasSpot(y, i - 1) ? 'X' : '.'
      const prevChar = hasSpot(y, i + 1) ? 'X' : '.'
      if (nextChar + char + prevChar === '.X.') {
        edgeHitCount++;
      }
    }

    return edgeHitCount % 2 === 1
  }

  const rectInsideEdgeCheck = ([ix, iy], [jx, jy]) => {
    log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    log({ ix, iy, jx, jy })
    const [y0, y1] = (iy < jy ? [iy, jy] : [jy, iy]).map(n => n - minY)
    const [x0, x1] = (ix < jx ? [ix, jx] : [jx, ix]).map(n => n - minX)
    // Check if there are any spots between the rect edges.
    // If we have spots between the rect edges, then we have outside tiles in the rect.
    const checkEdge = (spots, line, a, b) => {
      const min = Math.min(a, b), max = Math.max(a, b)
      for (let i = min + 1; i < max; i++) {
        if (hasSpot(line, i, spots)) {
          return true
        }
      }
    }

    // Check edges on the interior of the rect as to not touch potential overlapping polygon edges
    const edges = [
      [xSpots, x0 + 1, y0, y1],
      [xSpots, x1 - 1, y0, y1],
      [ySpots, y0 + 1, x0, x1],
      [ySpots, y1 - 1, x0, x1],
    ]
    if (edges.some(edge => checkEdge(...edge))) {
      return false
    }

    // If there are no through lines, check any spot inside the rect to see if we are inside the polygon or not.
    return spotInside(x0 + 1, y0 + 1)
  }

  return rectInsideEdgeCheck
}

function drawMap(contents) {
  const tileIds = contents.split('\n')
  let tiles = tileIds.map(t => t.split(',').map(n => parseInt(n)))
  const [xs, ys] = tiles.reduce(([xs, ys], [x, y]) => [[...xs, x], [...ys, y]], [[], []])
  const minX = Math.min(...xs), minY = Math.min(...ys)
  tiles = tiles.map(([x, y]) => [x - minX, y - minY])
  const [xss, yss] = tiles.reduce(([xs, ys], [x, y]) => [[...xs, x], [...ys, y]], [[], []])
  const maxX = Math.max(...xss), maxY = Math.max(...yss)

  const spots = []
  const setSpot = (y, x) => {
    if (!spots[y]) spots[y] = new Set()
    spots[y].add(x)
  }

  const getSpot = (y, x) => spots[y] ? spots[y].has(x) : false
  const getSpots = (y) => spots[y] ? spots[y] : []

  // Collect all the lines between red tiles
  tiles.forEach(([x, y], i) => {
    setSpot(y, x)
    const [px, py] = tiles.at(i - 1)
    if (px === x) {
      for (let j = Math.min(y, py) + 1; j < Math.max(y, py); j++) {
        setSpot(j, x)
      }
    } else if (py === y) {
      const minX = Math.min(x, px), maxX = Math.max(x, px)
      for (let j = minX + 1; j < maxX; j++) {
        setSpot(y, j)
      }
    }
  })

  // This recursion takes literally forever
  // Collect all the space in the shape
  // const points = [[Math.min(...getSpots(0)) + 1, 1]]
  // while (points.length) {
  //   const [[x, y]] = points.splice(0, 1)
  //   setSpot(y, x);
  //   [
  //     [y - 1, x - 1],
  //     [y - 1, x],
  //     [y - 1, x + 1],
  //     [y + 1, x - 1],
  //     [y + 1, x],
  //     [y + 1, x + 1],
  //     [y, x - 1],
  //     [y, x + 1]
  //   ].forEach(([yy, xx]) => !getSpot(yy, xx) && points.push([xx, yy]))
  // }

  return (tileI, tileJ) => {
    let start = 0, end = maxY, partial = false, ix, iy, jx, jy
    if (tileI && tileJ) {
      ([ix, iy] = tileI, [jx, jy] = tileJ);
      start = Math.min(iy, jy) - minY
      end = Math.max(iy, jy) - minY
      console.log([ix, iy], [jx, jy])
      partial = true
    }

    for (let y = start; y <= end; y++) {
      const newLine = partial
        ? Array(Math.abs(jx - ix) + 1).fill('.')
        : Array(maxX + 1).fill('.')
      for (const x of getSpots(y)) {
        if (partial) {
          const minIJX = Math.min(ix, jx) - minX
          if (minIJX <= x && x <= Math.max(ix, jx) - minX) {
            newLine[x - minIJX] = 'X'
          }
        } else {
          newLine[x] = 'X'
        }
      }
      console.log(newLine.join(''))
    }
  }
}
