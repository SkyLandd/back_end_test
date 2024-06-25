const express = require('express');
const { createTreasure, collectTreasure, getStats, getLeaderBoard, tradeTreasure } = require('../controllers/treasureController');
const validate = require('../middlewares/validationMiddleware');
const { createTreasureSchema, collectTreasureSchema, tradeTreasureSchema } = require('../validation/treasureValidation');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

//create only for admin role
router.post('/create', authenticate, validate(createTreasureSchema), createTreasure);

router.post('/collect', authenticate, validate(collectTreasureSchema), collectTreasure);
router.get('/stats', authenticate, getStats);
router.get('/leader-board', authenticate, getLeaderBoard);
router.post('/trade', authenticate, validate(tradeTreasureSchema), tradeTreasure);

module.exports = router;
