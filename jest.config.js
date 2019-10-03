module.exports = {
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/$1",
  },
  "automock": false,
  "setupFiles": ["./setupJest.ts"]
}
