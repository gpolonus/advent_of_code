
import { runWithFileContents, log } from '../../utils.js';

function partTwo(contents) {

}

runWithFileContents((contents, isTesting) => {
  // return partOne(contents, isTesting)
  return partTwo(contents)
})

function adjacencyAnalysis(contents) {
  const tileIds = contents.split('\n')
  const tiles = tileIds.map(t => t.split(',').map(n => parseInt(n)))
  const [xs, ys] = tiles.reduce(([xs, ys], [x, y]) => [[...xs, x], [...ys, y]], [[], []]);
  console.log('x adjacents')
  xs.sort().forEach((x, i, list) => x + 1 === list[i + 1] && console.log(x))
  console.log('y adjacents')
  ys.sort().forEach((y, j, list) => y + 1 === list[j + 1] && console.log(y))
}
