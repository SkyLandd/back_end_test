import express from "express";
import { authentication, random } from "../helper";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response<any, Record<string, any>>> => {
  try {
    const { username, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email && !username && !password) {
      return res.status(400).send("All input is required");
    }
    if (!emailRegex.test(email)) {
      return res.status(409).send("Email is not in correct format");
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    const salt: string = random();
    const user = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        salt,
        sessionToken: authentication(salt, password),
        password: authentication(salt, password),
      },
    });
    return res.status(201).json(user).end();
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }
    const createdHash = authentication(user.salt, password);
    if (user.password !== createdHash) {
      return res.status(403).json({ error: "password is not valid" });
    }
    const salt = random();
    const newSession = authentication(salt, user.email);
    user.sessionToken = newSession;
    await prisma.user.update({
      where: {
        email: email.toLowerCase(),
      },
      data: {
        sessionToken: newSession,
      },
    });
    res.cookie("AUTH_COOKIE", newSession, { domain: "localhost", path: "/" });
    return res.status(201).json(user).end();
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUser = async (
  req: express.Request,
  res: express.Response
) => {
  const allUser = await prisma.user.findMany();
  res.json(allUser);
};
