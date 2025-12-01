
import fs from 'fs'
import path from 'path'

export const isTesting = process.argv[2] === 'test'

export function runWithFileContents(fn) {
  const filePath = getContentsFilePath()
  const contents = fs.readFileSync(filePath, 'utf8').toString();
  console.log(fn(contents))
}

export function getContentsFilePath() {
  const filePath = isTesting
    ? 'testInput.txt'
    : 'puzzleInput.txt'
  return path.join(process.argv[1], filePath)
}


let logging = false

export function logAlways() {
  logging = true
}

export function log(...args) {
  if (isTesting || logging) console.log(...args)
}
