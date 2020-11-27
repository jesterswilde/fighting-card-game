"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateEmail = exports.getVerifieduser = exports.loginWithEmail = exports.createUser = void 0;
const username_1 = require("./username");
const user_1 = require("../db/entities/user");
const auth_1 = require("../auth");
const db_1 = require("../db");
const error_1 = require("../error");
exports.createUser = async (email, userPassword) => {
    const user = new user_1.DBUser();
    const username = await username_1.makeValidUsername();
    const { salt, hash } = await auth_1.makeHashAndSalt(userPassword);
    user.salt = salt;
    user.password = hash;
    user.username = username;
    user.email = email;
    await db_1.userRepo.save(user);
    const token = await auth_1.createToken(user.serialize());
    return token;
};
exports.loginWithEmail = async (email, password) => {
    if (!auth_1.verifyPasswordForEmail(email, password)) {
        throw error_1.ErrorEnum.INCORRECT_USER_OR_PW;
    }
    const user = await db_1.userRepo.findOne({ email });
    if (!user) {
        throw error_1.ErrorEnum.INCORRECT_USER_OR_PW;
    }
    const token = await auth_1.createToken(user.serialize());
    return token;
};
exports.getVerifieduser = async (token) => {
    try {
        const verified = await auth_1.verifyToken(token);
        if (verified) {
            const [b64] = token.split('.');
            const stringified = Buffer.from(b64).toString('utf-8');
            const { username } = JSON.parse(stringified);
            if (username) {
                const user = await db_1.userRepo.findOne({ username });
                return user;
            }
        }
        throw error_1.ErrorEnum.INVALID_TOKEN;
    }
    catch (err) {
        throw err;
    }
};
exports.validateEmail = (email) => {
    return !!email;
};
exports.validatePassword = (pw) => {
    return pw.length > 7;
};
