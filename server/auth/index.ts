import * as crypto from "crypto";
import { userRepo } from "../db";
import { Request, Response, NextFunction } from "express";
import { ErrorEnum } from "../error";
const { SECRET = "shhhhhhhh" } = process.env;

export const createToken = async (data: object) => {
  const stringified = JSON.stringify(data);
  const b64 = Buffer.from(stringified).toString("base64");
  const hash = await makeHash(b64, SECRET);
  return b64 + "." + hash;
};

export const verifyToken = async token => {
  console.log("token", token);
  const [b64, userHash] = token.split(".");
  const hash = await makeHash(b64, SECRET);
  return hash === userHash;
};

export const makeHashAndSalt = async (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await makeHash(password, salt);
  return { salt, hash };
};

export const verifyPasswordForEmail = async (
  email: string,
  password: string
) => {
  const user = await userRepo.findOne({ email });
  if (!user) {
    throw "Couldn't find email: " + email;
  }
  const hash = await makeHash(password, user.salt);
  return hash === user.password;
};

const makeHash = async (password: string, salt: string) => {
  return new Promise<string>((res, rej) => {
    crypto.pbkdf2(password, salt, 2048, 32, "sha512", (err, hashbuffer) => {
      if (err) {
        console.error("error while creating hash", err);
        rej("Failed to make hash");
      } else {
        const hash = hashbuffer.toString("hex");
        res(hash);
      }
    });
  });
};

const reqToUser = async (req: Request) => {
  let token = req.headers.authorization;
  let spaceIndex = token.indexOf(" ");
  if (spaceIndex >= 0) {
    token = token.split(" ")[1];
  }
  if (!verifyToken(token)) {
    throw ErrorEnum.INVALID_TOKEN;
  }
  const username = tokenToUsername(token);
  const user = await userRepo.findOne({ username });
  return user;
};

const tokenToUsername = (token: string): string => {
  const [b64] = token.split(".");
  const stringified = Buffer.from(b64, "base64").toString("utf8");
  const { username } = JSON.parse(stringified);
  return username;
};

export const getVerifiedUsername = async (token: string) => {
  console.log("Token!: ", token);
  if (!token) {
    return null;
  }
  const isValid = await verifyToken(token);
  if (isValid) {
    console.log("is valid");
    return tokenToUsername(token);
  }
  console.log("is not valid");
  return null;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.headers.authorization) {
      req.user = await reqToUser(req);
      next();
    } else {
      res.status(403).send();
    }
  } catch (err) {
    console.error(err);
    res.status(403).send();
  }
};
