import express from "express";
import { isAuthentcated } from "../middlewares";
import {
  storeTreasure,
  getPlayerStats,
  getLeaderboard,
  tradeTreasure,
  insertTreasureRecords,
} from "../controller/gameData";
import { isOwner } from "../middlewares/isOwner";

export default (router: express.Router): express.Router => {
  router.post("/treasure/:userId", isAuthentcated, isOwner, storeTreasure);
  router.get("/treasure/:userId/stat", isAuthentcated, isOwner, getPlayerStats);
  router.get("treasure/leaderboard", isAuthentcated, getLeaderboard);
  router.post("/trade", isAuthentcated, tradeTreasure);
  router.get("/insertTreasure", isAuthentcated, insertTreasureRecords);
  return router;
};
