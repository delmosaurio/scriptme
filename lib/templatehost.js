/*!
 * Scriptme.TemplateHost
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

var Interpreter = require('./interpreter'),
    PreCompiler = require('./precompiler')
    Compiler = require('./compiler'),
    Response = require('./response');

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

TemplateHost.prototype = {

	constructor: TemplateHost,

	render: function (template, writer, data, callback) {
		var self = this;

		var res = new Response(writer);

		var 
			sandbox = {
		      response: res,
		      context: data,
		    };
	    
	    // pre-compile
	    self.preCompiler.precompile(template, {}, function(error, output){

	    	if (error && callback && typeof callback === 'function') {
	    		callback(error, writer);
				return;
	    	}

	    	self.compiler.compile(output, { sandbox: sandbox }, function(error, result){

	    		if (error && callback && typeof callback === 'function') {
	    			callback(error, writer);
    			}

    			if (callback && typeof callback === 'function')  {
			    	callback(null, writer);
			    }

    		});

	    });

	}

};
