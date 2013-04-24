/*!
 * Scriptme.Response
 * Copyright(c) 2012 2012-2013 Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/**
 * Response is the interface between the runtime compiler and the output.
 */

 /**
  * Module dependencies.
  */
var env = require('./environment');

/**
 * Initialize a new Response
 *
 * options
 *      - writeBuffer define if the Response use the internal buffer
 *
 * @param {Object} stream - a stream writer ready to use.
 * @param {Object} options
 * @see http://nodejs.org/api/stream.html#stream_writable_stream
 */
var Response = module.exports = function Response(stream, options) {
	var self = this;

    options = options || {};
    options.writeBuffer  = options.writeBuffer || true;
    options.writeStream  = stream != undefined;

    this.stream = stream;
    this.buffer = '';

    this.options = options;

	return self;
};

/**
 * Response constructor
 */
Response.prototype.constructor = Response;

/**
 * Wirte `str` into buffer/stream.
 * 
 * @param {String} str
 * 
 */
Response.prototype.write = function(str) {
    var self = this;
    self.stream.write((str  || ''));
    self.buffer += (str  || '');

    return self;
};

/**
 * Add `str` into buffer/stream and add new line.
 *
 * @param {String} str
 *
 */
Response.prototype.writeLine = function(str) {
    var self = this;
    self.stream.write((str  || '') + env.newLine);
    self.buffer += (str  || '') + env.newLine;
    return self;
};

/**
 * end of stream
 *
 */
Response.prototype.end = function() {
    var self = this;
    self.stream.end();
};

 /**
 * override toString
 *
 * @returns {String} buffer
 */
Response.prototype.toString = function() {
    var self = this;
    return self.buffer || '';
};
