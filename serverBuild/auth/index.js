"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = exports.getVerifiedUsername = exports.verifyPasswordForEmail = exports.makeHashAndSalt = exports.verifyToken = exports.createToken = void 0;
const crypto = require("crypto");
const db_1 = require("../db");
const error_1 = require("../error");
const { SECRET = "shhhhhhhh" } = process.env;
exports.createToken = async (data) => {
    const stringified = JSON.stringify(data);
    const b64 = Buffer.from(stringified).toString("base64");
    const hash = await makeHash(b64, SECRET);
    return b64 + "." + hash;
};
exports.verifyToken = async (token) => {
    console.log("token", token);
    const [b64, userHash] = token.split(".");
    const hash = await makeHash(b64, SECRET);
    return hash === userHash;
};
exports.makeHashAndSalt = async (password) => {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = await makeHash(password, salt);
    return { salt, hash };
};
exports.verifyPasswordForEmail = async (email, password) => {
    const user = await db_1.userRepo.findOne({ email });
    if (!user) {
        throw "Couldn't find email: " + email;
    }
    const hash = await makeHash(password, user.salt);
    return hash === user.password;
};
const makeHash = async (password, salt) => {
    return new Promise((res, rej) => {
        crypto.pbkdf2(password, salt, 2048, 32, "sha512", (err, hashbuffer) => {
            if (err) {
                console.error("error while creating hash", err);
                rej("Failed to make hash");
            }
            else {
                const hash = hashbuffer.toString("hex");
                res(hash);
            }
        });
    });
};
const reqToUser = async (req) => {
    let token = req.headers.authorization;
    let spaceIndex = token.indexOf(" ");
    if (spaceIndex >= 0) {
        token = token.split(" ")[1];
    }
    if (!exports.verifyToken(token)) {
        throw error_1.ErrorEnum.INVALID_TOKEN;
    }
    const username = tokenToUsername(token);
    const user = await db_1.userRepo.findOne({ username });
    return user;
};
const tokenToUsername = (token) => {
    const [b64] = token.split(".");
    const stringified = Buffer.from(b64, "base64").toString("utf8");
    const { username } = JSON.parse(stringified);
    return username;
};
exports.getVerifiedUsername = async (token) => {
    console.log("Token!: ", token);
    if (!token) {
        return null;
    }
    const isValid = await exports.verifyToken(token);
    if (isValid) {
        console.log("is valid");
        return tokenToUsername(token);
    }
    console.log("is not valid");
    return null;
};
exports.authMiddleware = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            req.user = await reqToUser(req);
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
};
