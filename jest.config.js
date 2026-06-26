module.exports = {
  testEnvironment: "jest-environment-jsdom",
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "test-results/jest" }]
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};