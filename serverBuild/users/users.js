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
const error_1 = require("../error");
exports.createUser = (email, userPassword) => __awaiter(this, void 0, void 0, function* () {
    const user = new user_1.DBUser();
    const username = yield username_1.makeValidUsername();
    const { salt, hash } = yield auth_1.makeHashAndSalt(userPassword);
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
        throw error_1.ErrorEnum.INCORRECT_USER_OR_PW;
    }
    const user = yield db_1.userRepo.findOne({ email });
    if (!user) {
        throw error_1.ErrorEnum.INCORRECT_USER_OR_PW;
    }
    const token = yield auth_1.createToken(user.serialize());
    return token;
});
exports.getVerifieduser = (token) => __awaiter(this, void 0, void 0, function* () {
    try {
        const verified = yield auth_1.verifyToken(token);
        if (verified) {
            const [b64] = token.split('.');
            const stringified = Buffer.from(b64).toString('utf-8');
            const { username } = JSON.parse(stringified);
            if (username) {
                const user = yield db_1.userRepo.findOne({ username });
                return user;
            }
        }
        throw error_1.ErrorEnum.INVALID_TOKEN;
    }
    catch (err) {
        throw err;
    }
});
exports.validateEmail = (email) => {
    return !!email;
};
exports.validatePassword = (pw) => {
    return pw.length > 7;
};
