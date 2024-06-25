const Treasure = require('../models/Treasure');
const Transaction = require('../models/Transaction');

const { TreasurePointCollectionRules } = require('../constants/TreasureCollectRules');

module.exports.createTreasure = async (req) => {
  try {

    const { type, point } = req.body;
    const treasure = new Treasure({ type, point });

    return await treasure.save();

  } catch (error) {
    throw error;
  }
};

module.exports.collectTreasure = async (req) => {
  try {

    const { treasureId, value } = req.body;

    const treasure = await Treasure.findById(treasureId);

    if (!treasure) {
      throw new Error('Treasure not found');
    }

    await checkTreasurePointCollectionRules(req.user._id);

    const transaction = new Transaction({ treasureId, value, userId: req.user._id, type: 'Credit' });
    return await transaction.save();

  } catch (error) {
    throw error;
  }
};

const checkTreasurePointCollectionRules = async (userId) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const totalPoints = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'Credit',
          createdAt: {
            $gte: startOfToday,
            $lte: endOfToday
          }
        }
      },
      {
        $lookup: {
          from: 'treasures',
          localField: 'treasureId',
          foreignField: '_id',
          as: 'treasure'
        }
      },
      {
        $unwind: '$treasure'
      },
      {
        $group: {
          _id: null,
          totalPoints: { $sum: { $multiply: ['$value', '$treasure.point'] } }
        }
      }
    ]);

    const totalPointsToday = totalPoints.length > 0 ? totalPoints[0].totalPoints : 0;

    if (totalPointsToday >= TreasurePointCollectionRules.DAILY) {
      throw new Error('Daily point collection limit reached');
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.getStats = async (req) => {
  try {
    const userStats = await Transaction.aggregate([
      {
        $lookup: {
          from: 'treasures',
          localField: 'treasureId',
          foreignField: '_id',
          as: 'treasure'
        }
      },
      {
        $unwind: '$treasure'
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            treasureId: '$treasureId'
          },
          totalCredits: {
            $sum: {
              $cond: [{ $eq: ['$type', 'Credit'] }, '$value', 0]
            }
          },
          totalDebits: {
            $sum: {
              $cond: [{ $eq: ['$type', 'Debit'] }, '$value', 0]
            }
          },
          treasure: { $first: '$treasure' }
        }
      },
      {
        $project: {
          userId: '$_id.userId',
          treasureId: '$_id.treasureId',
          netValue: { $subtract: ['$totalCredits', '$totalDebits'] },
          treasureType: '$treasure.type',
          treasurePoint: '$treasure.point'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$user._id',
          name: { $first: '$user.name' },
          treasures: {
            $push: {
              treasureType: '$treasureType',
              netValue: '$netValue',
              treasurePoint: '$treasurePoint'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$name',
          treasures: 1
        }
      }
    ]);

    return userStats;

  } catch (error) {
    throw error;
  }
};

module.exports.getLeaderBoard = async (req) => {
  try {
    const topUsers = await Transaction.aggregate([
      {
        $lookup: {
          from: 'treasures',
          localField: 'treasureId',
          foreignField: '_id',
          as: 'treasure'
        }
      },
      {
        $unwind: '$treasure'
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            treasureId: '$treasureId'
          },
          totalCredits: {
            $sum: {
              $cond: [{ $eq: ['$type', 'Credit'] }, '$value', 0]
            }
          },
          totalDebits: {
            $sum: {
              $cond: [{ $eq: ['$type', 'Debit'] }, '$value', 0]
            }
          },
          treasurePoint: { $first: '$treasure.point' }
        }
      },
      {
        $project: {
          userId: '$_id.userId',
          netValue: { $subtract: ['$totalCredits', '$totalDebits'] },
          totalPoints: { $multiply: [{ $subtract: ['$totalCredits', '$totalDebits'] }, '$treasurePoint'] }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$totalPoints' }
        }
      },
      {
        $sort: { totalPoints: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          userName: '$user.name',
          totalPoints: 1
        }
      }
    ]);

    return topUsers;

  } catch (error) {
    throw error;
  }
};

module.exports.tradeTreasure = async (req) => {
try {
    const userId1 = req.user._id;
    const { userId2, treasureId1, treasureId2, quantity } = req.body;
    // Fetch the treasures involved in the trade
    const [treasure1, treasure2] = await Promise.all([
      Treasure.findById(treasureId1),
      Treasure.findById(treasureId2)
    ]);

    if (!treasure1 || !treasure2) {
      throw new Error('One or both treasures not found');
    }

    // Validate trade rules
    if (treasure1._id.equals(treasure2._id)) {
      throw new Error('Cannot trade the same type of treasure');
    }

    const treasure1PointValue = treasure1.point;
    const treasure2PointValue = treasure2.point;

    // Calculate required quantity of treasure2 for treasure1
    const requiredTreasure2Quantity = (treasure1PointValue / treasure2PointValue) * quantity;

    // Fetch user transactions to ensure they have enough treasures
    const [user1Transactions, user2Transactions] = await Promise.all([
      Transaction.find({ userId: userId1, treasureId: treasureId1 }),
      Transaction.find({ userId: userId2, treasureId: treasureId2 })
    ]);

    const user1Treasure1Quantity = user1Transactions.reduce((acc, txn) => {
      return txn.type === 'Credit' ? acc + txn.value : acc - txn.value;
    }, 0);

    const user2Treasure2Quantity = user2Transactions.reduce((acc, txn) => {
      return txn.type === 'Credit' ? acc + txn.value : acc - txn.value;
    }, 0);

    if (user1Treasure1Quantity < quantity) {
      throw new Error(`User ${userId1} does not have enough of treasure ${treasureId1} to trade`);
    }

    if (user2Treasure2Quantity < requiredTreasure2Quantity) {
      throw new Error(`User ${userId2} does not have enough of treasure ${treasureId2} to trade`);
    }

    // Create transactions
    const transactions = [
      {
        userId: userId1,
        treasureId: treasureId1,
        type: 'Debit',
        value: quantity
      },
      {
        userId: userId1,
        treasureId: treasureId2,
        type: 'Credit',
        value: requiredTreasure2Quantity
      },
      {
        userId: userId2,
        treasureId: treasureId1,
        type: 'Credit',
        value: quantity
      },
      {
        userId: userId2,
        treasureId: treasureId2,
        type: 'Debit',
        value: requiredTreasure2Quantity
      }
    ];

    // Save transactions
    return await Transaction.insertMany(transactions);

  } catch (error) {
    throw error;
  }
};
