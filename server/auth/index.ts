import * as crypto from 'crypto';
import { userRepo } from '../db';
const { SECRET = "shhhhhhhh" } = process.env

export const createToken = async (data: object) => {
    const stringified = JSON.stringify(data);
    const b64 = Buffer.from(stringified).toString('base64');
    const hash = await makeHash(b64, SECRET);
    return b64 + "." + hash;
}

export const verifyToken = async (token) => {
    const [b64, userHash] = token.split('.');
    const hash = await makeHash(b64, SECRET);
    return hash === userHash;
}

export const makeHashAndSalt = async (password: string) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await makeHash(password, salt);
    return { salt, hash }
}

export const verifyPasswordForEmail = async (email: string, password: string) => {
    const user = await userRepo.findOne({ email });
    if (!user) {
        throw "Couldn't find email: " + email;
    }
    const hash = await makeHash(password, user.salt);
    return hash === user.password;
}

const makeHash = async (password: string, salt: string) => {
    return new Promise<string>((res, rej) => {
        crypto.pbkdf2(password, salt, 2048, 32, 'sha512', (err, hashbuffer) => {
            if (err) {
                console.error("error while creating hash", err);
                rej("Failed to make hash");
            } else {
                const hash = hashbuffer.toString('hex');
                res(hash)
            }
        })
    })
}