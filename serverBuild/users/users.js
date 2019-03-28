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
const username_1 = require("./username");
const user_1 = require("../db/entities/user");
const auth_1 = require("../auth");
const db_1 = require("../db");
exports.createUser = (email, userPassword) => __awaiter(this, void 0, void 0, function* () {
    const user = new user_1.DBUser();
    const username = yield username_1.makeValidUsername();
    console.log("Useranme: ", username);
    const { salt, hash } = yield auth_1.makeHashAndSalt(userPassword);
    console.log(salt, "\n", hash);
    user.salt = salt;
    user.password = hash;
    user.username = username;
    user.email = email;
    yield db_1.userRepo.save(user);
    const token = yield auth_1.createToken(user.serialize());
    return token;
});
exports.loginWithEmail = (email, password) => __awaiter(this, void 0, void 0, function* () {
    if (!auth_1.verifyPasswordForEmail(email, password)) {
        throw "Coudldn't verify";
    }
    const user = yield db_1.userRepo.findOne({ email });
    if (!user) {
        throw "Couldn't find user, this is weird since you have a token";
    }
    const token = yield auth_1.createToken(user.serialize());
    return token;
});
exports.verifyUser = (token) => __awaiter(this, void 0, void 0, function* () {
    const verified = yield auth_1.verifyToken(token);
    if (verified) {
        return "Verified";
    }
    else {
        return "Booooooooo, bad token";
    }
});
