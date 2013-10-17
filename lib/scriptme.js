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
  , Response = require('./response')
  , StringBuilder = require('stringbuilder')
  ;

/**
 * Expose current version.
 */
module.exports.version = require("../package.json").version;

/**
 * Expose constructors.
 */
module.exports.TemplateHost = TemplateHost;
module.exports.PreCompiler = PreCompiler;
module.exports.Compiler = Compiler;
module.exports.Interpreter = Interpreter;
module.exports.Response = Response;

/*
 * Expose functionality
 */

module.exports.render = render;
module.exports.precompile = precompile;
module.exports.compile = compile;

/**
 * Expose helpers.
 */
module.exports.env = require('./environment');



/**
 * Render a `template`.
 *
 * @param {String} template
 * @param {Object} data
 * @return {Function} fn
 */
 function render(template, stream, data, options, fn) {
    
    if (options && typeof options === 'function') {
      fn = options;
      options = {};
    }

    precompile(template, options, function(err, precompiled){
      if (err) throw err;

      compile(precompiled, stream, data, options, fn);

    });

    //new TemplateHost().render(template, data, fn);
 };

/**
 * Precompile a `temaplate` with `options`
 *
 * @param {String} template
 * @return {Function} fn
 */
 function precompile(template, options, fn) {
    	
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
 function compile(precopiled, stream, data, options, fn) {
    	
    	if (!data || typeof options === 'function') {
    		fn(new Error('The `data` is null or an callback function'));
    	}

    	if (options && typeof options === 'function') {
    		fn = options;
    		options = {};
    	}

      var sb = new StringBuilder();
      sb.pipe(stream);

    	var sandbox = {
	      response: sb,
	      context: data,
	    };

    	// precompile
    	new Compiler(options)
    		.compile(precopiled, { sandbox: sandbox }, function(err){
            sb.flush();
            fn && fn(null);
        });

 };

