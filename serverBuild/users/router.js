"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const users_1 = require("./users");
const auth_1 = require("../auth");
const feedback_1 = require("../db/entities/feedback");
exports.userRouter = express_1.Router();
exports.userRouter.post("/feedback", auth_1.authMiddleware, async (req, res) => {
    const feedback = new feedback_1.DBFeedback();
    feedback.user = req.user;
    feedback.feedback = req.body.feedback;
});
exports.userRouter.post("/create", async (req, res) => {
    try {
        if (users_1.validateEmail(req.body.email) && users_1.validatePassword(req.body.password)) {
            const token = await users_1.createUser(req.body.email, req.body.password);
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
});
exports.userRouter.post("/login", async (req, res) => {
    try {
        const token = await users_1.loginWithEmail(req.body.email, req.body.password);
        res.status(200).send(token);
    }
    catch (err) {
        console.error(err);
        res.status(400).send("Invalid Login");
    }
});
