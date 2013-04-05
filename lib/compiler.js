/*!
 * Scriptme.Compiler
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

var vm = require('vm'),
	fs = require('fs'),
	beautify = require('js-beautify').js_beautify;

/**
 * Initialize a new Compiler with the 'options'.
 *
 * @param {Object} options
 */
var Compiler = module.exports = function Compiler() {
	var self = this;

	return self;
};

var runtime = [
   ''
  , '(function (response, console, context, require) {'
  , ''
  , '	//<runtime>'
  , ''
  , '})(response, console, context, require);'
].join('\n');

Compiler.prototype  = {

	constructor:  Compiler,

	compile: function(script, options, callback) {

		//try {
			
			var sandbox = options.sandbox || {};

			sandbox.console = console;
			sandbox.require = require;

			//console.log(sandbox);

			runtime = runtime.replace('//<runtime>', script);
			
			//fs.writeFile('./cache/runtime.log', beautify(runtime));

	    	var rs = vm.createScript(runtime);
			rs.runInNewContext(sandbox);
			
			if (callback && typeof callback === 'function')  {
		    	callback(null);
		    }
			/*
		} catch(err) {
			if (callback && typeof callback === 'function')  {
		    	callback(err);
		    }
		}*/
	
	},

	compileSync: function(options) {
		throw new Error("Not implemented yet!");	
	}

};