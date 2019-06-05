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
const crypto = require("crypto");
const db_1 = require("../db");
const error_1 = require("../error");
const { SECRET = "shhhhhhhh" } = process.env;
exports.createToken = (data) => __awaiter(this, void 0, void 0, function* () {
    const stringified = JSON.stringify(data);
    const b64 = Buffer.from(stringified).toString('base64');
    const hash = yield makeHash(b64, SECRET);
    return b64 + "." + hash;
});
exports.verifyToken = (token) => __awaiter(this, void 0, void 0, function* () {
    console.log('token', token);
    const [b64, userHash] = token.split('.');
    const hash = yield makeHash(b64, SECRET);
    return hash === userHash;
});
exports.makeHashAndSalt = (password) => __awaiter(this, void 0, void 0, function* () {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = yield makeHash(password, salt);
    return { salt, hash };
});
exports.verifyPasswordForEmail = (email, password) => __awaiter(this, void 0, void 0, function* () {
    const user = yield db_1.userRepo.findOne({ email });
    if (!user) {
        throw "Couldn't find email: " + email;
    }
    const hash = yield makeHash(password, user.salt);
    return hash === user.password;
});
const makeHash = (password, salt) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        crypto.pbkdf2(password, salt, 2048, 32, 'sha512', (err, hashbuffer) => {
            if (err) {
                console.error("error while creating hash", err);
                rej("Failed to make hash");
            }
            else {
                const hash = hashbuffer.toString('hex');
                res(hash);
            }
        });
    });
});
const reqToUser = (req) => __awaiter(this, void 0, void 0, function* () {
    const token = req.headers.authorization;
    if (!exports.verifyToken(token)) {
        throw error_1.ErrorEnum.INVALID_TOKEN;
    }
    const username = tokenToUsername(token);
    const user = yield db_1.userRepo.findOne({ username });
    return user;
});
const tokenToUsername = (token) => {
    const [b64] = token.split('.');
    const stringified = Buffer.from(b64, 'base64').toString('utf8');
    const { username } = JSON.parse(stringified);
    return username;
};
exports.getVerifiedUsername = (token) => __awaiter(this, void 0, void 0, function* () {
    console.log("Token!: ", token);
    if (!token) {
        return null;
    }
    const isValid = yield exports.verifyToken(token);
    if (isValid) {
        console.log('is valid');
        return tokenToUsername(token);
    }
    console.log('is not valid');
    return null;
});
exports.authMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        if (req.headers.authorization) {
            req.user = yield reqToUser(req);
            next();
        }
        else {
            res.status(403).send();
        }
    }
    catch (err) {
        console.error(err);
        res.status(403).send();
    }
});
