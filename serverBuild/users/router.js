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
const express_1 = require("express");
const users_1 = require("./users");
exports.userRouter = express_1.Router();
exports.userRouter.post('/create', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        console.log('making ', req.body);
        if (users_1.validateEmail(req.body.email) && users_1.validatePassword(req.body.password)) {
            const token = yield users_1.createUser(req.body.email, req.body.password);
            res.status(202).send(token);
        }
        else {
            res.status(400).send("Invalid username or password");
        }
    }
    catch (err) {
        console.error(err);
        res.status(400).send("Failed to make user");
    }
}));
exports.userRouter.post('/login', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const token = yield users_1.loginWithEmail(req.body.email, req.body.password);
        res.status(200).send(token);
    }
    catch (err) {
        console.error(err);
        res.status(400).send("Invalid Login");
    }
}));
