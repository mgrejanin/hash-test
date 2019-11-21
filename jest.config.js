module.exports = {
    "roots": [
      "<rootDir>/src"
    ],
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    "moduleNameMapper": {
        "^.+\\.(css|less|scss)$": "identity-obj-proxy"
      }
  }