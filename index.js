'use strict';

var _lodash = require('lodash');

var winston = require('winston');
var fs = require('fs');

var LOG_NAME = process.env.LOG_NAME || 'bsc-svc.log';
var LOG_LEVEL = process.env.LOG_LEVEL || 'info';
var LOG_LEVEL_CONSOLE = process.env.LOG_LEVEL_CONSOLE || 'verbose';
var LOG_DIR = '/svc/logs';

// Create the log directory if it does not exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}
var tsFormat = function tsFormat() {
  return new Date().toLocaleTimeString();
};
var LOGGER = new winston.Logger({
  transports: [
    // colorize the output to the console
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
      level: LOG_LEVEL_CONSOLE,
      showLevel: false
    }), new winston.transports.File({
      filename: LOG_DIR + '/' + LOG_NAME,
      timestamp: tsFormat,
      level: LOG_LEVEL,
      json: false,
      showLevel: false
    })]
});

var log = function log(level, title, params, subTitle) {
  var rect = level === 'error' ? '\x1b[41m   \x1b[0m' : '\x1b[42m   \x1b[0m';

  if (level === 'info') {
    LOGGER[level](title);
  } else if (level === 'verbose') {
    if (subTitle) {
      LOGGER[level](rect + '  ' + title + ' ---- ' + subTitle + '\n');
    } else {
      LOGGER[level](rect + '  ' + title + '\n');
    }
  } else {
    var pStr = '\n';
    _lodash._.each(params, function (obj) {
      _lodash._.each(obj, function (value, key) {
        pStr += '\n' + key + ' \x1B[2m::: ' + value + '\x1B[0m';
      });
    });

    if (subTitle) {
      LOGGER[level]('\n\n' + rect + ' ' + title + ' ---------- ' + subTitle + ' ---------- ' + pStr + '\n');
    } else {
      LOGGER[level]('\n\n' + rect + '  ' + title + ' ---------- ' + pStr + '\n');
    }
  }
};

module.exports = {
  LOGGER: LOGGER, log: log
};