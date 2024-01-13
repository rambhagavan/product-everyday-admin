require('dotenv').config();
const chalk = require('chalk');
const mongoose = require('mongoose');

const keys = require('../core/configs');
const logger = require('../core/logger')

const { database } = keys;

const setupDB = async () => {
  try {
    // Connect to MongoDB
    mongoose
      .connect(database.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() =>
        logger.info(`${chalk.green('✓')} ${chalk.blue('MongoDB Connected!')}`)
      )
      .catch(err => logger.fatal(err));
  } catch (error) {
    logger.fatal(`${chalk.red(error)}`)
    return null;
  }
};

module.exports = setupDB;
