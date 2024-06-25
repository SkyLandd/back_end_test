const express = require('express');
const { register, login, verifyEmail } = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const { registerSchema, loginSchema } = require('../validation/authValidation');
const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/verify/:token', verifyEmail);

module.exports = router;
