import express from "express";
import authentication from "./authentication";
import gameData from "./gameData";

const router = express.Router();
export default (): express.Router => {
  authentication(router);
  gameData(router);
  return router;
};
