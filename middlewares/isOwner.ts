import express from "express";
import {  get} from "lodash";
import  {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const isOwner = async(req:express.Request,res:express.Response,next:express.NextFunction):Promise<void | express.Response<any, Record<string, any>>> => {
 
    try {
      const { userId } = req.params;
      const currentUserId = get(req , 'identity.id');
      if(!currentUserId) {
        return res.sendStatus(403);
      }
     
      if(currentUserId !== parseInt(userId)) {
        return res.sendStatus(403)
      }
      return next();
    }
    catch(error){
      console.log(error);
      return res.sendStatus(400);
    }
}