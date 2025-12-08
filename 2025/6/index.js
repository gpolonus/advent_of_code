
import { runWithFileContents, log } from '../../utils.js';

runWithFileContents((contents) => {
  const lineNumber = contents.match(new RegExp('\r\n', 'g')).length + 1
  return transposeString(contents, '\r\n')
    .split(Array(lineNumber).fill(' ').join(''))
    .reduce((ac, problemText) => ac + doProblem(problemText), 0)
})

function transposeString(str, delimiter) {
  const chars = str.split(delimiter).map(s => s.split(''))
  const newChars = []
  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars[i].length; j++) {
      newChars[j] ??= []
      newChars[j][i] = chars[i][j]
    }
  }

  return newChars.map(nc => nc.join('')).join(delimiter)
}

function doProblem(problemText) {
  const op = problemText.match(/[*+]/g)[0]

  let func
  switch (op) {
    case '+':
      func = (a, b) => a + b
      break
    case '*':
      func = (a, b) => a * b
      break
  }

  return problemText.match(/\d+/g).map(n => parseInt(n)).reduce(func)
}

function partOne(contents) {
  const rows = contents.split('\r\n')

  rows.slice(1, -1).forEach(r => {
    splitRow(r).forEach((n, i) => problems[i].push(parseInt(n)))
  });
  splitRow(rows.at(-1)).forEach((op, i) => problems[i].push(op))

  return problems.reduce((ac, p)=> {
    return ac + doProblem(p.at(-1))(p.slice(0, -1))
  }, 0)

}

function splitRow(row) {
  return row.match(/([\d\*\+]+)/g)
}