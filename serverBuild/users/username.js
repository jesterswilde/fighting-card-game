"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.makeValidUsername = () => __awaiter(this, void 0, void 0, function* () {
    let username;
    let lookingForName = true;
    while (lookingForName) {
        username = generateUsername();
        const user = yield db_1.userRepo.findOne({ username });
        if (!user) {
            lookingForName = false;
        }
        console.log("Found user: ", user);
    }
    return username;
});
