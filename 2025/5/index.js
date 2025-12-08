
import { runWithFileContents, log } from '../../utils.js';

runWithFileContents((contents) => {
  let [ranges, ids] = contents.split('\r\n\r\n')
  ranges = ranges.split('\r\n').map(r => r.split('-').map(n => parseInt(n)))

  // return bruteForceMethod(ranges)
  // return buildList(ranges)
  // return unifiedIntervalsMethod(ranges)
  return sweepLineEndpointSorting(ranges)
})

/**
 * This method never actually finished for the entire puzzle input on my
 * windows machine.
 * */
function bruteForceMethod(ranges) {
  const overallMin = Math.min(...ranges.map(([min]) => min))
  const overallMax = Math.max(...ranges.map(([_, max]) => max))

  let answer = 0;
  for (let i = overallMin; i <= overallMax; i++) {
    if (ranges.find(([min, max]) => min <= i && i <= max)) answer++;
  }

  return answer;
}

/**
 * This method errored out bc of Set size restrictions.
 */
function buildList(ranges) {
  const freshIds = new Set;

  ranges.forEach(([min, max]) => {
    for (let i = min; i <= max; i++) {
      freshIds.add(i)
    }
  })

  return freshIds.size
}

class Intervals {
  ranges = [];

  add([minR, maxR]) {
    let front, back, backIndex
    for (let i = 0, r = this.ranges[0]; i < this.ranges.length; r = this.ranges[++i]) {
      const [min, max] = r

      if (minR <= min && max <= maxR) {
        this.ranges.splice(i, 1)
        i--
        continue
      }

      if (min <= minR && minR <= max) {
        front = r
      }

      if (min <= maxR && maxR <= max) {
        back = r
        backIndex = i
      }
    }

    if (front && back && front !== back) {
      front[1] = back[1]
      this.ranges.splice(backIndex, 1)
    }
    else if (front && !back) {
      front[1] = maxR
    }
    else if (!front && back) {
      back[0] = minR
    }
    else if (!front && !back) {
      this.ranges.push([minR, maxR])
    }

    log(this.ranges)
  }
}

function unifiedIntervalsMethod(ranges) {
  const intervals = new Intervals
  ranges.forEach(r => intervals.add(r))
  return intervals.ranges.reduce((ac, [min, max]) => ac + max - min + 1, 0)
}

/**
 * Sweep-Line/Endpoint Sorting from Gemini
 */
function sweepLineEndpointSorting(ranges) {
  const endpoints = ranges
    .reduce((ac, [min, max]) => {
      ac.push([min, 1])
      ac.push([max, -1])
      return ac
    }, [])
    .sort(([pointA, amountA], [pointB, amountB]) => pointA !== pointB ? pointA - pointB : amountB - amountA)

  let counter = 0, currentStart, total = 0
  for (const [point, amount] of endpoints) {
    if (counter === 0) {
      currentStart = point
    }

    counter += amount

    if (counter === 0) total += point - currentStart + 1
  }

  return total
}

/**
3759394963292 is too low
didn't add the accumulator correctly in a reducer

338798804433816 is too high
wasn't removing ranges within ranges correctly

256276587393667 is too low
needed to do the subrange removal before detecting surrounding ranges

332998283036769 is correct
*/
