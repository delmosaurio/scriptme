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
  , Response = require('./response');

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
 * @param {Stream} writer
 * @param {Object} data
 * @param {Function} fn
 */
TemplateHost.prototype.render = function (template, writer, data, fn) {
	var self = this
	  , res = new Response(writer);

	var sandbox = {
	      response: res,
	      context: data,
	    };
    
    try
    {
		// pre-compile
	    self.preCompiler.precompile(template, function(err, output){

    		if (err && fn && typeof fn === 'function') {
	    		fn(err, writer);
				return;
	    	}

	    	self.compiler.compile(output, { sandbox: sandbox }, function(err, result){

	    		if (err && fn && typeof fn === 'function') {
	    			fn(err, writer);
	    			return;
    			}

    			if (fn && typeof fn === 'function')  {
			    	fn(null, writer);
			    }

    		});

	    });
    }
    catch(err){
		fn(err, writer);
    }

};