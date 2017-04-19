"use strict";

/* eslint-disable no-console */

/**
 * Logger - wraps console methods
 *
 */
module.exports = {
  info: function info(msg) {
    return console.log.apply(console, [msg]);
  },
  error: function error(msg) {
    return console.error.apply(console, [msg]);
  }
};