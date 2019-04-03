import { makeValidUsername } from "./username";
import { DBUser } from "../db/entities/user";
import { makeHashAndSalt, createToken, verifyToken, verifyPasswordForEmail } from "../auth";
import { userRepo } from "../db";
import { ErrorEnum } from "../error";

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
        throw ErrorEnum.INCORRECT_USER_OR_PW
    }
    const user = await userRepo.findOne({ email });
    if (!user) {
        throw ErrorEnum.INCORRECT_USER_OR_PW
    }
    const token = await createToken(user.serialize());
    return token;
}


export const getVerifieduser = async (token: string) => {
    try{
        const verified = await verifyToken(token);
        if (verified) {
            const [b64] = token.split('.'); 
            const stringified = Buffer.from(b64).toString('utf-8');
            const {username} = JSON.parse(stringified); 
            if(username){
                const user = await userRepo.findOne({username});
                return user; 
            }
        }
        throw ErrorEnum.INVALID_TOKEN
    }catch(err){
        throw err; 
    }
}

export const validateEmail = (email: string) => {
    return !!email
}

export const validatePassword = (pw: string) => {
    return pw.length > 7; 
}