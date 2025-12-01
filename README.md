# Grif's Advent of Code Solutions

## scaffoldSoln

`./scaffoldSoln year day`

Generates the following file structure:
```
./[year]
└── [day]
    ├── index.js
    ├── puzzleInput.txt
    └── testInput.txt
```

## runSoln

`./runSoln year day [test]`

Runs the following command: `node "./year/day" [test]`

Adding `test` at the end uses the `testInput.txt` file contents, and omitting it uses the `puzzleInput.txt` file.
