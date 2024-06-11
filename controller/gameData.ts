import express from "express";
import { PrismaClient } from "@prisma/client";
import { resetLimits } from "../middlewares/resetLimits";
import {
  createFirstTreasure,
  createTrade,
  findPlayerStatistics,
  findTheUserTreasure,
  getLeaderboardQuery,
  getPlayerStatistics,
  updatePlayerStatistics,
  updateUserTreasure,
} from "../helper/prismaQuery";
import { UserInterface } from "../interface/user";

const prisma = new PrismaClient();

export const storeTreasure = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req.params;
  const { treasure_id, quantity } = req.body;
  try {
    if (typeof quantity !== "number" || isNaN(quantity)) {
      return res.status(400).json({ error: "quantity is not a number" });
    }

    const userTreasure = await findTheUserTreasure(Number(userId) as number);
    if(userTreasure && userTreasure.treasureId === treasure_id) {
      updateUserTreasure(treasure_id, quantity, userTreasure.quantity);
      const userStat = await findPlayerStatistics(Number(userId) as number);
      if(!userStat) {
        return res.status(404).json({ error: 'Statistics for this treasure did not found' });
       }
    
       if(userStat.dailyLimitReached || userStat.weeklyLimitReached) {
          return res.status(400).json({ error: 'Daily or weekly limit reached' });
      }
      const { resetDaily, resetWeekly } = await resetLimits(
        userStat as unknown as UserInterface
      );
      if (resetDaily || resetWeekly) {
        // Update Statistics for the user
        updatePlayerStatistics(
          userStat as unknown as UserInterface,
          resetDaily as unknown as boolean,
          resetWeekly as unknown as boolean
        );
      }
    }
    else if(userTreasure && userTreasure.treasureId !== treasure_id) {

    }
    else {
      createFirstTreasure(
        Number(userId) as number,
        treasure_id as number,
        quantity as number
      );
    }

      // const newDailyCount = user.dailyTreasures + quantity;
      // const newWeeklyCount = user.weeklyTreasures + quantity;

      // // If limits are not exceeded, proceed to the next middleware or route handler
      // await prisma.$transaction(async (prisma) => {
      //   await prisma.userTreasure.upsert({
      //     where: { unique_user_treasure: { userId: parseInt(userId), treasureId: parseInt(treasure_id) } },
      //     update: { quantity: { increment: quantity } },
      //     create: { userId: parseInt(userId), treasureId: parseInt(treasure_id), quantity }
      //   });

      //   await prisma.statistic.update({
      //     where: { userId: parseInt(userId) },
      //     data: {
      //       dailyTreasures: { increment: quantity },
      //       weeklyTreasures: { increment: quantity },
      //       totalTreasures: { increment: quantity }
      //     }
      //   });
      // });

    return res.status(201).json({ message: "Treasure collected" });
  } catch (error) {
    console.error("Error details:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", details: error });
  }
};

export const getPlayerStats = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const playerStatictics = getPlayerStatistics(Number(userId) as number)
    res.status(200).json({ playerStatictics });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve player stats", details: error });
  }
};

export const getLeaderboard = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const leaderboard = getLeaderboardQuery();
    return res.status(200).json(leaderboard);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve leaderboard", details: error });
  }
};

export const tradeTreasure = async (
  req: express.Request,
  res: express.Response
) => {
  const { fromUserId, toUserId, treasureId, quantity } = req.body;

  const fromUserTreasure = await prisma.userTreasure.findUnique({
    where: { unique_user_treasure: { userId: fromUserId, treasureId } },
  });

  if (!fromUserTreasure || fromUserTreasure.quantity < quantity) {
    return res.status(400).json({ error: "Insufficient treasures to trade" });
  }
  const result = await prisma.$transaction(async (prisma) => {
    createTrade(fromUserId as number, toUserId as number, treasureId as number,quantity as number)
    updateUserTreasure(treasureId, quantity, quantity);
    await prisma.userTreasure.update({
      where: { id: fromUserTreasure.id },
      data: {
        quantity: { decrement: quantity },
      },
    });

    await prisma.userTreasure.upsert({
      where: { unique_user_treasure: { userId: toUserId, treasureId } },
      update: { quantity: { increment: quantity } },
      create: { userId: toUserId, treasureId, quantity },
    });
  });
  console.log(result);
  res.status(200).json({ message: "trade have successfully done" });
};

export const insertTreasureRecords = async (
  req: express.Request,
  res: express.Response
) => {
  const treasures = [];
  try {
    for (let i = 1; i <= 15; i++) {
      treasures.push({
        name: `Treasure ${i}`,
        type: `Type ${i % 10}`, // Example type distribution
        value: Math.floor(Math.random() * 1000) + 1, // Random value between 1 and 1000
        createdAt: new Date(),
      });
    }

    await prisma.treasure.createMany({
      data: treasures,
    });
    res.status(200).json({ message: "created" });
  } catch (error) {
    console.error("Error inserting treasures:", error);
  } finally {
    await prisma.$disconnect();
  }
};

