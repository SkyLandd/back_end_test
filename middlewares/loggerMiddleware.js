const morgan = require('morgan');
const logger = require('../logs/logger');

// Stream to use with morgan
const stream = {
    write: (message) => logger.info(message.trim()),
};

// Setup morgan to use the stream
const morganMiddleware = morgan('combined', { stream });

module.exports = morganMiddleware;
