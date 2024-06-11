import { UserInterface } from "../interface/user";

export const resetLimits = async(userInfo:UserInterface) => {
  const now = new Date().getTime();
  const resetDaily = now - new Date(userInfo.lastDailyReset).getTime() > 24 * 60 * 60 * 1000;
  const resetWeekly = now - new Date(userInfo.lastWeeklyReset).getTime() > 7 * 24 * 60 * 60 * 1000;
  return {resetDaily,resetWeekly}
}