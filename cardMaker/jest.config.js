module.exports = {
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "roots": [
        __dirname + "/src",
    ],
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
};