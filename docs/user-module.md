# User Module

Responsible for maintaining user related data. 
1. Profile data
2. User Inventory data (Treasures collected are stored here)
3. Trade data

Responsible for maintaining and managing user statistics, and leaderboard.

## Exposes some user related endpoints (user prefix) All are authenticated using bearer token

### GET trade-market
Exposes a list of inventory from different players which can be traded. I have assumed all the treasures owned by users are applicable for trade. Ideally some logic should be in place for this.

***

### POST trade-treasure
This endpoint is responsible for initiating a trade. Idea is for a user to initiate a trade by selecting a treasure from his own inventory and another from trade market i.e someone else's inventory.

By default when a treasure is added to a user inventory, I am maintaining a inventoryStatus whose value is `COLLECTED` by default.

When trade initiation happens:
1. Request is validated, both initiator and recepient in request should own the inventory and it should be in `COLLECTED` state
2. I update the status of both the participant inventories to `ACTIVE_TRADE` which signifies that it is part of some pending trade and should not be available on market anymore.
3. Then the trade is saved in `Pending` state. (Idea is for an initiator to request and if the recepient accepts the trade is completed) In an ideal world here a notification should go to the recepient that someone has requested for a trade.

Two tables are involved in this:
`user_inventory` -> used to store the users treasures
`trade` -> used to store trade information

***

### GET requested-trade
This endpoint lists down all the trade request received which can be accepted.

***

### GET initaited-trade
This endpoint lists down all the trade request initaited by the user and which are not yet accepted or rejected or cancelled.

***

### GET treasures
This endpoint lists down all the treasures owned by user.

***

### POST accept-trade/:tradeId
This endpoint is responsible for a user to accept a trade as a result trade get's completed.

How it works?
1. Check if the trade exists and the users is recepient in saved trade details
2. Start a transaction
3. Validat if the inventory exists and the status is `ACTIVE_TRADE` 
4. Update the initiator inventory to `TRADED` (Signifies that the inventory does not belong to initiator anymore but I have kept it in the table so that auditing and tracing is easier) status and add the treasure in recepient inventory with `COLLECTED` state. Do the same for recepient inventory to understand thsi look at `toTradeAcceptedTreasureEntity` method in [User Mapper Class](../src/modules/user/user.mapper.ts) 
5. Finally update the trade to `COMPLETED` status 

NOTE: Cancellation and Rejection of request is not implemented, Idea was to showcase the flow

***

### GET statistics
This endpoint is responsible for getting the user statistics

Statistics Tracked:
```json
export interface IUserStatistics {
  totalCollectedTreasures: number;
  totalTradedTreasures: number;
  totalActiveTrades: number;
  todaysGameTreasureCollection: number;
  weeksGameTreasureCollection: number;
}
```

Based on request it is cached and evicted if there is any change in user inventory.

>NOTE: While writing this documentation, I realized that the statistics are not updated when the trade is initiated or accepted.

***

### GET leaderboard
This endpoint is responsible for getting the users leaderboard

Leaderboard service manages generation and caching of leaderboard, sort the users based on treasure count.

***

