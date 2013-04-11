/*!
 * Scriptme
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var fs = require('fs')
  , env =  require('./environment')
  , TemplateHost =  require('./templatehost');

/**
 * Expose current version.
 */
module.exports.version = '0.0.7';

/**
 * Expose constructors.
 */
module.exports.TemplateHost = require('./templatehost');

/**
 * Render a temaplate.
 *
 * @param {String} template
 * @param {Stream} response
 * @param {Object} data
 * @return {Function} fn(error, response)
 */
 module.exports.render = function(template, response, data, fn) {
    new TemplateHost().render(template, response, data, fn);
 };

/**
 * Expose helpers.
 */
module.exports.env = require('./environment');

