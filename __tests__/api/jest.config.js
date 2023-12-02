module.exports = {
  displayName: "api",
  testMatch: ['**/*.test.ts'],
  transform: {
    "^.+\\.ts$": "babel-jest"
  },
  testEnvironment: "node",
};
