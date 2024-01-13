const chalk = require('chalk');

const app = require('./app/app')
const config = require('./app/core/configs')
const logger = require('./app/core/logger')

const port = config.port || 3000
logger.info(port)
app.listen(port, (err) => {
  if(err){
    logger.fatal(`${chalk.red(err)}`)
  }
  logger.info(
    `${chalk.green('✓')} ${chalk.blue(
      `Listening on port ${port}. Visit http://localhost:${port}/ in your browser.`
    )}`
  );
});