import { makeValidUsername } from "./username";
import { DBUser } from "../db/entities/user";
import { makeHashAndSalt, createToken, verifyToken, verifyPasswordForEmail } from "../auth";
import { userRepo } from "../db";

export const createUser = async (email: string, userPassword: string) => {
    const user = new DBUser();
    const username = await makeValidUsername();
    console.log("Useranme: ", username);
    const { salt, hash } = await makeHashAndSalt(userPassword);
    console.log(salt, "\n", hash);
    user.salt = salt;
    user.password = hash;
    user.username = username;
    user.email = email;
    await userRepo.save(user);
    const token = await createToken(user.serialize());
    return token;
}


export const loginWithEmail = async (email: string, password: string) => {
    if (!verifyPasswordForEmail(email, password)) {
        throw "Coudldn't verify"
    }
    const user = await userRepo.findOne({ email });
    if (!user) {
        throw "Couldn't find user, this is weird since you have a token"
    }
    const token = await createToken(user.serialize());
    return token;
}


export const verifyUser = async (token: string) => {
    const verified = await verifyToken(token);
    if (verified) {
        return "Verified"
    } else {
        return "Booooooooo, bad token"
    }
}

export const validateEmail = (email: string) => {
    return !!email
}

export const validatePassword = (pw: string) => {
    return pw.length > 7; 
}