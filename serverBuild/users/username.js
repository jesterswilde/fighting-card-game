"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeValidUsername = void 0;
const nouns_1 = require("./nouns");
const db_1 = require("../db");
const generateUsername = () => {
    const firstIndex = Math.floor(Math.random() * nouns_1.nouns.length);
    let secondIndex;
    while (secondIndex === firstIndex || secondIndex === undefined) {
        secondIndex = Math.floor(Math.random() * nouns_1.nouns.length);
    }
    return nouns_1.nouns[firstIndex] + ' ' + nouns_1.nouns[secondIndex];
};
exports.makeValidUsername = async () => {
    let username;
    let lookingForName = true;
    while (lookingForName) {
        username = generateUsername();
        const user = await db_1.userRepo.findOne({ username });
        if (!user) {
            lookingForName = false;
        }
        console.log("Found user: ", user);
    }
    return username;
};
