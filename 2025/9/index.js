
import { runWithFileContents, log } from '../../utils.js';

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

}


runWithFileContents((contents) => {
  return partOne(contents)
  // return partTwo(contents)
})
