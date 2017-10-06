import { _ } from 'lodash';

const winston = require('winston');
const fs = require('fs');

const LOG_NAME = process.env.LOG_NAME || 'bsc-svc.log';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const LOG_LEVEL_CONSOLE = process.env.LOG_LEVEL_CONSOLE || 'verbose';
const LOG_DIR = '/svc/logs';

// Create the log directory if it does not exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const LOGGER = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: LOG_LEVEL_CONSOLE,
      showLevel: false,
    }),
    new (winston.transports.File)({
      filename: `${LOG_DIR}/${LOG_NAME}`,
      timestamp: tsFormat,
      level: LOG_LEVEL,
      json: false,
      showLevel: false,
    }),
  ],
});

const log = (level, title, params, subTitle) => {
  const rect = (level === 'error') ? '\x1b[41m   \x1b[0m' : '\x1b[42m   \x1b[0m';

  if (level === 'info') {
    LOGGER[level](title);
  } else if (level === 'verbose') {
    if (subTitle) {
      LOGGER[level](
        `${rect}  ${title} ---- ${subTitle}\n`,
      );
    } else {
      LOGGER[level](
        `${rect}  ${title}\n`,
      );
    }
  } else {
    let pStr = '\n';
    _.each(params, (obj) => {
      _.each(obj, (value, key) => {
        pStr += `\n${key} \x1b[2m::: ${value}\x1b[0m`;
      });
    });

    if (subTitle) {
      LOGGER[level](
        `\n\n${rect} ${title} ---------- ${subTitle} ---------- ${pStr}\n`,
      );
    } else {
      LOGGER[level](
        `\n\n${rect}  ${title} ---------- ${pStr}\n`,
      );
    }
  }
};

module.exports = {
  LOGGER, log,
};
