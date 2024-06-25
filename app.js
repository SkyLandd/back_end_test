const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morganMiddleware = require('./middlewares/loggerMiddleware');
const config = require('./config/config');
const authRoutes = require('./routes/authRoutes');
const treasureRoutes = require('./routes/treasureRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morganMiddleware);
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/treasure', treasureRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
