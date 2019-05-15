import { DBUser } from "../db/entities/user";

//This allows me to modify the req object for my auth middleware
declare global{
    namespace Express{
        export interface Request{
            user?: DBUser
        }
    }
}