/*!
 * Scriptme.PreCompiler
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var fs = require('fs')
  , Cache = require('./cache')
  , beautify = require('js-beautify').js_beautify;

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

PreCompiler.prototype.constructor = PreCompiler;

/**
 * Pre-compile the `template` with `options`
 *
 * @param {String} template
 * @param {Object} options
 * @param {Function} fn
 */
PreCompiler.prototype.precompile = function(template, options, fn) {
	var self = this
	  , it = this.interpreter;

    it.template(template).render();
    
    if (options && typeof options === 'function')  {
    	fn = options;
    	options = {};
    }

    fn && fn(null, it.output);
};

/**
 * TODO: Pre-compile the `template` with `options` synchronously
 *
 * @param {String} template
 * @param {Object} options
 * @param {Function} fn
 */
PreCompiler.prototype.precompileSync = function(template, options) {
	throw new Error("Not implemented yet!");
};
