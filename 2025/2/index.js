
import { runWithFileContents, log } from '../../utils.js';

runWithFileContents((contents) => {
  const ranges = contents.split(',')
  return ranges.reduce((ac, range) => {
    const [min, max] = range.split('-').map(n => parseInt(n))
    return ac + sumRangeInvalidIds(min, max)
  }, 0)
})

function sumRangeInvalidIds(min, max) {
  let invalidIdSum = 0
  for(let id = min; id <= max; id++) {
    if (checkIdInvalid(id)) {
      invalidIdSum += id
    }
  }
  return invalidIdSum
}

function checkIdInvalid(id) {
  const stringId = `${id}`
  const halfLength = stringId.length / 2

  for (let repeatSize = 1; repeatSize <= halfLength; repeatSize++) {
    if (
      stringId.length % repeatSize === 0 &&
      repeatString(stringId.slice(0, repeatSize), stringId.length / repeatSize) === stringId
    )
      return true
  }

  return false
}

function repeatString(str, times) {
  return Array(times).fill(str).join('')
}
