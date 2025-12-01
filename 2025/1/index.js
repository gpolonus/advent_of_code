
import { runWithFileContents, log } from "../../utils.js";

runWithFileContents((contents) => {
  const lines = contents.split('\n')
  let start = 50
  let answer = 0
  log({ start })
  for(const line of lines) {
    const dir = line[0]
    let num = parseInt(line.slice(1))

    answer += Math.floor(num / 100)
    num = (num + 100) % 100

    const nextStart = ({
      L: start - num,
      R: start + num
    }[dir])

    if ((nextStart + 100) % 100 === 0 || (start !== 0 && (nextStart > 100 || nextStart < 0))) answer++;

    log({ line, start, answer })
    start = (nextStart + 100) % 100
  }

  return answer
})

/** Results
part 2
2256 is too low

Had to include spins hitting 0 multiple times in one line
*/