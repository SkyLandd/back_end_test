export interface UserInterface {
  id: number;
  userId: number;
  totalTreasures: number;
  dailyTreasures: number;
  weeklyTreasures: number;
  dailyLimitReached: boolean;
  weeklyLimitReached: boolean;
  lastDailyReset: Date;
  lastWeeklyReset: Date;
  updatedAt: Date;
}

export interface TreasureInterface {
  name: String;
  type: String;
  value: number;
  createdAt: Date;
}
