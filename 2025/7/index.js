
import { runWithFileContents, log } from '../../utils.js';

const flipBits = n => {
  return n ^ BigInt(`0b${Array(n.toString(2).length).fill(1).join('')}`)
}

function partOne(contents) {
  const lines = contents
    .replaceAll('.', '0')
    .replace(/[\^S]/g, '1')
    .split('\n')
    // Had to use BigInts bc JS Numbers are only 64 bit
    .map(n => BigInt(`0b${n}`))

  let missingSplits = 0;
  let a = lines[0]
  lines.slice(1).forEach((b, i) => {
    if (!b) return

    // Particles to the right of splits
    const x = (a & b) / 2n
    // Particles to the left of splits
    const y = (a & b) * 2n
    // Particles falling down and not hitting splits
    const z = a & flipBits(b)

    const leftoverSplits = ((a - b) & b).toString(2).match(/1/g)?.length || 0
    missingSplits += leftoverSplits
    a = x | y | z
  })

  return contents.match(/\^/g).length - missingSplits
}

/**
 * The second part of this problem is basically asking you to make an uneven
 * Pascal's triangle. Here's a data structure of keeping track of that.
 */
class Digits {
  digits = []

  constructor(digits) {
    this.digits = digits
  }

  or({ digits }) {
    return new Digits(this.digits.map((d, i) => d + (digits[i] || 0)))
  }

  and({ digits }) {
    return new Digits(this.digits.map((d, i) => d && digits[i] ? d : 0 ))
  }

  flip() {
    return new Digits(this.digits.map(d => !d ? 1 : 0))
  }

  shiftLeft() {
    return new Digits(this.digits.slice(1).concat(0))
  }

  shiftRight() {
    return new Digits([0].concat(this.digits.slice(0, -1)))
  }

  sumDigits() {
    return this.digits.reduce((ac, d) => ac + d)
  }

  toString() {
    return this.digits.join()
  }
}

function partTwo(contents) {
  const lines = contents
    .replaceAll('.', '0')
    .replace(/[\^S]/g, '1')
    .split('\n')
    .map(n => new Digits(n.split('').map(nn => parseInt(nn))))

  let a = lines[0]
  lines.slice(1).forEach((b, i) => {
    if (!b.sumDigits()) return

    const ab = a.and(b)
    const x = ab.shiftLeft()
    const y = ab.shiftRight()
    const z = a.and(b.flip())
    a = x.or(y).or(z)
  })

  return a.sumDigits()
}

runWithFileContents((contents) => {
  return partTwo(contents)
})