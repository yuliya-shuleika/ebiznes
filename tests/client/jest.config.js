module.exports = {
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "/node_modules/(?!(axios)/)"
    ],
    moduleFileExtensions: ["js", "jsx"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
    testEnvironment: "jsdom",
};