module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}", // for future typescript support
    "!**/node_modules/**",
    "!**/__tests__/**"
  ],
  projects: [
    '<rootDir>/__tests__/api/jest.config.js',
  ],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"  // for future typescript support
  },
};