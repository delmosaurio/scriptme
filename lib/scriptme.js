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
  , PreCompiler = require('./precompiler')
  , Compiler = require('./compiler')
  , TemplateHost =  require('./templatehost')
  , Interpreter = require('./interpreter')
  , Response = require('./response');

/**
 * Expose current version.
 */
module.exports.version = '0.0.10';

/**
 * Expose constructors.
 */
module.exports.TemplateHost = TemplateHost;
module.exports.PreCompiler = PreCompiler;
module.exports.Compiler = Compiler;
module.exports.Interpreter = Interpreter;
module.exports.Response = Response;

/**
 * Render a `template`.
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
 * Precompile a `temaplate` with `options`
 *
 * @param {String} template
 * @return {Function} fn
 */
 module.exports.precompile = function(template, options, fn) {
    	
    	if (options && typeof options === 'function') {
    		fn = options;
    		options = {};
    	}

    	var ops = {};
    	ops.interpreter = options.interpreter || new Interpreter();

    	// precompile
    	new PreCompiler(ops)
    		.precompile(template, fn);

 };

 /**
 * Precompile a `precopiled` template with `options`
 *
 * @param {String} precopiled
 * @param {Stream} stream
 * @param {Object} data
 * @return {Function} fn
 */
 module.exports.compile = function(precopiled, stream, data, options, fn) {
    	
    	if (!data || typeof options === 'function') {
    		fn(new Error('The `data` is null or an callback function'));
    	}

    	if (options && typeof options === 'function') {
    		fn = options;
    		options = {};
    	}
    	
    	var sandbox = {
	      response: new Response(stream),
	      context: data,
	    };

    	// precompile
    	new Compiler(options)
    		.compile(precopiled, { sandbox: sandbox }, fn);

 };


/**
 * Expose helpers.
 */
module.exports.env = require('./environment');

