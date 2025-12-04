
import { runWithFileContents, log } from '../../utils.js';

runWithFileContents((contents) => {
  const banks = contents.split('\n')
  return banks.reduce((ac, bank) => {
    log({ bank })

    let digitIndex = 0;
    let joltage = '';
    for (let i = -11; i <= 0; i++) {
      const front = i === 0
        ? Array.from(bank.slice(digitIndex))
        : Array.from(bank.slice(digitIndex, i))
      log({ front })

      const digit = front.slice().sort().at(-1)
      digitIndex += front.findIndex(f => f === digit) + 1
      joltage += digit
      log({ joltage, digitIndex })
    }

    log({joltage})
    return ac + parseInt(joltage)
  }, 0)
})

function partOne(contents) {
  const banks = contents.split('\n')
  return banks.reduce((ac, bank) => {
    const front = Array.from(bank.slice(0, -1))
    const firstDigit = front.slice().sort().at(-1)
    const firstDigitIndex = front.findIndex(f => f === firstDigit)

    const back = Array.from(bank.slice(firstDigitIndex + 1))
    const secondDigit = back.sort().at(-1)
    log({ firstDigit, secondDigit, front, back })
    return ac + parseInt(firstDigit + secondDigit)
  }, 0)
}