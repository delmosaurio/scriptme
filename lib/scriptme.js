/*!
 * Scriptme
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

var 
    // ext modules  
    fs = require('fs'),
    // scriptme modules
    scriptme = require('../lib/scriptme'),
    env =  require('./environment'),
    TemplateHost =  require('./templatehost');

/**
 * Expose current version.
 */
module.exports.version = '0.1.4';

/**
 * Expose constructors.
 */
module.exports.TemplateHost = require('./templatehost');

/**
 * Render a temaplte.
 *
 * @param {String} template
 * @param {Stream} response
 * @param {Object} data
 * @return {function} callback(error, response)
 */
 module.exports.render = function(template, response, data, callback) {
    new TemplateHost().render(template, response, data, callback);
 };

/**
 * Expose helpers.
 */
module.exports.env = require('./environment');

