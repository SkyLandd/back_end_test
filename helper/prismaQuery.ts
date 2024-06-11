import { PrismaClient } from "@prisma/client";
import { TreasureInterface, UserInterface } from "../interface/user";
const prisma = new PrismaClient();

export const findTheUserTreasure = async (userId: number) => {
  return await prisma.userTreasure.findFirst({
    where: {
      userId,
    },
  });
};
export const updateUserTreasure = async (
  treasure_id: number,
  quantity: number,
  addQantity: number
) => {
  return await prisma.userTreasure.update({
    where: { id: treasure_id },
    data: {
      quantity: addQantity + quantity,
    },
  });
};

export const findPlayerStatistics = async (userId: number) => {
  const data = await prisma.statistic.findUnique({
    where: { userId },
  });
  return data;
};

export const updatePlayerStatistics = async (
  userStat: UserInterface,
  resetDaily: boolean,
  resetWeekly: boolean
) => {
  return await prisma.statistic.update({
    where: { userId: userStat.userId },
    data: {
      dailyTreasures: resetDaily ? 0 : userStat.dailyTreasures,
      dailyLimitReached: false,
      lastDailyReset: new Date(),
      weeklyTreasures: resetWeekly ? 0 : userStat.weeklyTreasures,
      weeklyLimitReached: false,
      lastWeeklyReset: new Date(),
    },
  });
};

export const createFirstTreasure = async (
  userId: number,
  treasure_id: number,
  quantity: number
) => {
  return await prisma.$transaction(async (prisma) => {
    await prisma.userTreasure.create({
      data: {
        userId,
        treasureId: treasure_id,
        quantity: quantity,
        acquiredAt: new Date(),
      },
    });

    await prisma.statistic.create({
      data: {
        userId: userId,
        totalTreasures: quantity,
        dailyTreasures: quantity,
        weeklyTreasures: quantity,
        dailyLimitReached: false,
        weeklyLimitReached: false,
        lastDailyReset: new Date(),
        lastWeeklyReset: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.leaderboard.create({
      data: {
        userId: userId,
        totalScore: quantity,
      },
    });
  });
};

export const getPlayerStatistics = async (userId: number) => {
  return await prisma.statistic.findUnique({
    where: { userId },
  });
};

export const getLeaderboardQuery = async () => {
  return await prisma.leaderboard.findMany({
    orderBy: {
      totalScore: "desc",
    },
    include: {
      user: true,
    },
  });
};

export const createTrade = async (
  fromUserId: number,
  toUserId: number,
  treasureId: number,
  quantity: number
) => {
  return await prisma.trade.create({
    data: {
      fromUserId,
      toUserId,
      userTreasureId: treasureId,
      quantity,
      status: "completed",
    },
  });
};
