import { nouns } from "./nouns";
import { userRepo } from "../db";

const generateUsername = () => {
  const firstIndex = Math.floor(Math.random() * nouns.length);
  let secondIndex = firstIndex;
  while (secondIndex === firstIndex || secondIndex === undefined) {
    secondIndex = Math.floor(Math.random() * nouns.length);
  }
  return nouns[firstIndex] + " " + nouns[secondIndex];
};

export const makeValidUsername = async () => {
  let username = "";
  let lookingForName = true;
  while (lookingForName) {
    username = generateUsername();
    const user = await userRepo.findOne({ username });
    if (!user) {
      lookingForName = false;
    }
    console.log("Found user: ", user);
  }
  return username;
};
