/*!
 * Scriptme.Response
 * Copyright(c) 2012 2012-2013 Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/**
 * Response is the interface between the runtime compiler and the output.
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
 * Constructor
 */
Response.prototype.constructor = Response;

/**
 * Response prototype.
 */
Response.prototype = {

    /**
     * @param {String} str - wirte str into buffer/stream.
     * 
     */
    write: function(str) {
    	this.stream.write((str  || '') + env.newLine);
        this.buffer += (str  || '') + env.newLine;
        return this;
    },

    /**
     * @param {String} str - add str into buffer/stream and add new line.
     *
     */
    writeLine: function(str) {
        this.stream.write((str  || '') + env.newLine);
        this.buffer += (str  || '') + env.newLine;
        return this;
    },

    /**
     * override toString return the buffer
     */
    toString: function() {
        return this.buffer || '';
    }

};
