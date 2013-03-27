/*!
 * Scriptme.PreCompiler
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

var 
	fs = require('fs'),
	Cache = require('./cache'),
	beautify = require('js-beautify').js_beautify;

/**
 * Initialize a new PreCompiler with the 'options'.
 *
 * @param {Object} options
 */
var PreCompiler = module.exports = function PreCompiler(options) {
	var self = this,
		cacheOps = {};

	// extract cache options
	cacheOps.cachePath = options.cachePath;
	self.cache = new Cache(cacheOps);

	self.interpreter = options.interpreter;

	return self;
};

PreCompiler.prototype = {

	constructor:  PreCompiler,

	precompile: function(template, options, callback) {
		var self = this;

		var it = this.interpreter;
	    it.template(template);
	    it.render();

		// temp log
		fs.writeFile('./cache/precompiler.log', beautify(it.output));

	    if (callback && typeof callback === 'function')  {
	    	callback(null, it.output);
	    }
	},

	precompileSync: function(template, options) {
		throw new Error("Not implemented yet!");
	}

};