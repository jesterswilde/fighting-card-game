import { Router } from "express";
import {
  createUser,
  loginWithEmail,
  validateEmail,
  validatePassword
} from "./users";
import { authMiddleware } from "../auth";
import { DBFeedback } from "../db/entities/feedback";

export const userRouter = Router();

userRouter.post("/feedback", authMiddleware, async (req, res) => {
  const feedback = new DBFeedback();
  feedback.user = req.user;
  feedback.feedback = req.body.feedback;
});

userRouter.post("/create", async (req, res) => {
  try {
    if (validateEmail(req.body.email) && validatePassword(req.body.password)) {
      const token = await createUser(req.body.email, req.body.password);
      res.status(202).send(token);
    } else {
      res.status(400).send("Invalid username or password");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Failed to make user");
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const token = await loginWithEmail(req.body.email, req.body.password);
    res.status(200).send(token);
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid Login");
  }
});
