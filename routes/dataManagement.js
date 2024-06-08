const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Log = require('../models/log');
const NodeCache = require('node-cache');

// Middleware to reset daily/weekly limits
const resetLimits = (user) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    if (now - user.dailyTreasureDate >= oneDay) {
        user.dailyTreasure = 0;
        user.dailyTreasureDate = now;
    }

    if (now - user.weeklyTreasureDate >= oneWeek) {
        user.weeklyTreasure = 0;
        user.weeklyTreasureDate = now;
    }
};

const logActivity = async (userId, action, amount) => {
    const log = new Log({
        userId,
        action,
        amount
    });
    await log.save();
};

router.put('/collect', auth, async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ msg: 'Amount must be a positive number' });
        }

        const user = await User.findById(req.user.id);

        resetLimits(user);

        const dailyLimit = 100; // example daily limit
        const weeklyLimit = 500; // example weekly limit

        if (user.dailyTreasure + amount > dailyLimit) {
            return res.status(400).json({ msg: 'Daily treasure limit exceeded' });
        }

        if (user.weeklyTreasure + amount > weeklyLimit) {
            return res.status(400).json({ msg: 'Weekly treasure limit exceeded' });
        }

        user.dailyTreasure += amount;
        user.weeklyTreasure += amount;
        user.treasures += amount;

        await user.save();
        await logActivity(req.user.id, 'collect', amount); // Log the activity

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const myCache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

router.get('/stats', auth, async (req, res) => {
    try {
        let userStats = myCache.get(`stats_${req.user.id}`);
        if (!userStats) {
            userStats = await User.findById(req.user.id).select('-password -__v -verificationToken');
            if (!userStats) {
                return res.status(404).json({ msg: 'User not found' });
            }
            myCache.set(`stats_${req.user.id}`, userStats);
        }
        res.json(userStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        let topPlayers = myCache.get('leaderboard');
        if (!topPlayers) {
            topPlayers = await User.find().sort({ treasures: -1 }).limit(10).select('name treasures');
            myCache.set('leaderboard', topPlayers);
            
            console.log('Fetching leaderboard from database');
            
        }else{
            console.log('leaderboard cached');
        }
        res.json(topPlayers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/trade', auth, async (req, res) => {
    try {
        const { recipientId, amount } = req.body;

        if (!recipientId || !amount || amount <= 0) {
            return res.status(400).json({ msg: 'Invalid trade details' });
        }

        const sender = await User.findById(req.user.id);
        const recipient = await User.findById(recipientId);

        if (!sender || !recipient) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (sender.treasures < amount) {
            return res.status(400).json({ msg: 'Insufficient treasures' });
        }

        sender.treasures -= amount;
        recipient.treasures += amount;

        await sender.save();
        await recipient.save();
        await logActivity(req.user.id, 'trade', amount); // Log the activity

        res.json({ sender, recipient });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
    