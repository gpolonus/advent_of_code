
import { runWithFileContents, log } from '../../utils.js';

/**
 * Part two solution that traces where removals happen and then only processes
 * those locations instead of looping over the entire map again.
 */
runWithFileContents((contents) => {
  let removed = 0
  const removalsToProcess = []

  const rows = contents.split('\n').map(row => row.split('')).map((row, i, rows) => {
    return row.map((roll, j) => {
      if (roll !== '@') return '.'

      const adjacentRolls = (
        (rows[i + 1]?.[j + 1] === '@' ? 1 : 0) +
        (rows[i + 1]?.[j] === '@' ? 1 : 0) +
        (rows[i + 1]?.[j - 1] === '@' ? 1 : 0) +
        (rows[i - 1]?.[j + 1] === '@' ? 1 : 0) +
        (rows[i - 1]?.[j] === '@' ? 1 : 0) +
        (rows[i - 1]?.[j - 1] === '@' ? 1 : 0) +
        (rows[i][j + 1] === '@' ? 1 : 0) +
        (rows[i][j - 1] === '@' ? 1 : 0)
      )

      if (adjacentRolls < 4) {
        removed++
        removalsToProcess.push([i, j])
        return '.'
      }

      return adjacentRolls
    })
  })

  let removal;
  while ((removal = removalsToProcess.shift())) {
    const [i, j] = removal;
    [
      [i + 1, j + 1],
      [i + 1, j],
      [i + 1, j - 1],
      [i - 1, j + 1],
      [i - 1, j],
      [i - 1, j - 1],
      [i, j + 1],
      [i, j - 1],
    ].forEach(([ii, jj]) => {
      const roll = rows[ii]?.[jj]

      if (!roll || roll === '.') return;

      if (roll - 1 < 4) {
        removalsToProcess.push([ii, jj])
        removed++
        rows[ii][jj] = '.'
      } else {
        rows[ii][jj]--
      }
    })
  }

  return removed
})

/**
 * Part two solution that loops over the whole map repeatedly until it can't
 * remove rolls anymore.
 */
function partTwoLooping(contents) {
  let removed = 0

  let rows = contents.split('\n').map(row => row.split(''))

  while (true) {
    let didRemove = false

    rows = rows.map((row, i) => {
      return row.map((roll, j) => {
        if (roll !== '@') return roll

        const adjacentRolls = (
          (rows[i + 1]?.[j + 1] === '@' ? 1 : 0) +
          (rows[i + 1]?.[j] === '@' ? 1 : 0) +
          (rows[i + 1]?.[j - 1] === '@' ? 1 : 0) +
          (rows[i - 1]?.[j + 1] === '@' ? 1 : 0) +
          (rows[i - 1]?.[j] === '@' ? 1 : 0) +
          (rows[i - 1]?.[j - 1] === '@' ? 1 : 0) +
          (rows[i][j + 1] === '@' ? 1 : 0) +
          (rows[i][j - 1] === '@' ? 1 : 0)
        )

        if (adjacentRolls < 4) {
          removed++
          didRemove = true
          return '.'
        }

        return roll
      }, row.slice())
    })

    if (!didRemove) break;
  }

  log(rows.map(row => row.join('')).join('\n'))
  return removed
}

function partOne(contents) {
  const rows = contents.split('\n')

  let answer = 0

  rows.forEach((row, i) => {
    row.split('').forEach((roll, j) => {
      if (roll !== '@') return;

      const adjacentRolls = (
        (rows[i + 1]?.[j + 1] === '@' ? 1 : 0) +
        (rows[i + 1]?.[j] === '@' ? 1 : 0) +
        (rows[i + 1]?.[j - 1] === '@' ? 1 : 0) +
        (rows[i - 1]?.[j + 1] === '@' ? 1 : 0) +
        (rows[i - 1]?.[j] === '@' ? 1 : 0) +
        (rows[i - 1]?.[j - 1] === '@' ? 1 : 0) +
        (rows[i][j + 1] === '@' ? 1 : 0) +
        (rows[i][j - 1] === '@' ? 1 : 0)
      )

      if (adjacentRolls < 4) answer++
    })
  })

  return answer
}
