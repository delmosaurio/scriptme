/*!
 * Scriptme.Compiler
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var vm = require('vm')
	, fs = require('fs')
	, beautify = require('js-beautify').js_beautify;

/**
 * Initialize a new Compiler with the 'options'.
 *
 * @param {Object} options
 */
var Compiler = module.exports = function Compiler() {
	var self = this;

	return self;
};

/**
 * The base template to make an compilable script
 */
var runtime = [
   ''
  , '(function (response, console, context, require) {'
  , '	try {'
  , ''	
  , '	//<runtime>'
  , '	'
  , '	'
  , '	} catch(err) {'
  , '		response.appendLine(err);'
  , '		console.error(err);'
  , '	}'
  , ''
  , '})(response, console, context, require);'
].join('\n');

/**
 * Compile a precompiled `script`
 *
 * @param {String} script
 * @param {Object} options
 * @param {Function} fn
 */
Compiler.prototype.compile = function(script, options, fn) {

	if (options && typeof options === 'function')  {
    	fn = options;
    	options = {};
    }
	
	var sandbox = options.sandbox || {};

	sandbox.console = console;
	sandbox.require = require;

	var torun = runtime.replace('//<runtime>', script);
	
  var rs = vm.createScript(torun);
	rs.runInNewContext(sandbox);
	
	fn && fn(null);
	
};

/**
 * TODO: Compile a precompidel `script` synchronously
 *
 * @param {String} script
 * @param {Object} options
 */
Compiler.prototype.compileSync  = function(script, options) {
	throw new Error("Not implemented yet!");
};
