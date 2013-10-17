/*!
 * Scriptme.TemplateHost
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var Interpreter = require('./interpreter')
  , PreCompiler = require('./precompiler')
  , Compiler = require('./compiler')
  , Response = require('./response')
  , StringBuilder = require('stringbuilder')
  , async = require('async');

/**
 * Initialize a new TemplateHost with the 'options'.
 *
 * @param {Object} options
 * @api public
 */
var TemplateHost = module.exports =  function TemplateHost(options) {
	var self = this,
		preOps = {}
		cops = {};

	var ops = options || {};

	// extract pre-compile options
	preOps.cachePath = ops.cachePath || './.cache';
	preOps.interpreter = ops.interpreter || new Interpreter();

	self.preCompiler = new PreCompiler(preOps); // pre-compiler instance

	// extract compile options
	cops.contextFile = ops.contextFile; // global context file

	self.compiler = new Compiler(cops); // compiler instance

	return self;
};

/**
 * TemplateHost constructor
 */
TemplateHost.prototype.constructor = TemplateHost;

/**
 * Render the `template` and write the output into `writer`
 * 
 * @param {String} template
 * @param {Object} data
 * @param {Function} fn
 */
TemplateHost.prototype.render = function (template, data, fn) {
	var self = this
	  , res = new StringBuilder();

	var sandbox = {
	      response: res,
	      context: data,
	    };
    
    async.waterfall(
    	[
    		// pre compile the template
    		function(callback) {
				self.preCompiler.precompile(template, callback);
    		},
			// now compile
    		function(output, callback) {
				self.compiler.compile(output, { sandbox: sandbox }, callback);
    		},
    		// build the string
    		function(output, callback) {
    			res.build(callback);
    		}

    	],
    	function(err, result) {
    		//console.log(writer);
    		fn(err, result);
    	}
	);

};