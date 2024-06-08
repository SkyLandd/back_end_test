const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const dataManagementRouts = require('./routes/dataManagement');
const morgan = require('morgan');
const winston = require('winston');
const expressWinston = require('express-winston');

dotenv.config();
const app = express();
app.use(morgan('combined'));

// Setup morgan for HTTP request logging
app.use(morgan('combined'));

// Setup winston for logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Log all requests and responses
app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    colorStatus: true
}));

// Error logging
app.use(expressWinston.errorLogger({
    winstonInstance: logger
}));

// Connect to the database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/dataManagement', dataManagementRouts);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
