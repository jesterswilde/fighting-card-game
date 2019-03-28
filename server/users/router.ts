import { Router } from "express";
import { createUser, loginWithEmail } from "./users";
import { verifyToken } from "../auth";

export const userRouter = Router(); 

userRouter.post('/create', async(req, res)=>{
    try{
        const token = await createUser(req.body.email, req.body.password);
        res.status(202).send(token);  
    }catch(err){
        console.error(err); 
        res.status(400).send("Failed to make user"); 
    }
})

userRouter.post('/login', async(req,res)=>{
    try{
        const token = await loginWithEmail(req.body.email, req.body.password); 
        res.status(200).send(token); 
    }catch(err){
        console.error(err); 
        res.status(400).send("Invalid Login"); 
    }
})