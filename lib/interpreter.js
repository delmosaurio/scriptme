/*!
 * Scriptme.Interpreter
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var fs = require('fs')
  , XRegExp = require('xregexp').XRegExp
  , Renderer = require('./renderer')
  , beautify = require('js-beautify').js_beautify
  , async = require('async');

/**
 * Initialize a new Interpreter.
 *
 */
var Interpreter = module.exports = function Interpreter() {
	var self = this;

	self.tmpl = "";
	self.output = "";
	self.nodes = [];
	self.regex = {
		
	};

	return self;
};


Interpreter.prototype.constructor = Interpreter;

/**
 * getter/setter template
 *
 * @param {String} value
 */
Interpreter.prototype.template = function(value) {
	var self = this;
	if (value == undefined) {
		return self.tmpl;
	}
	
	self.tmpl = value;

	return self;
};


/**
 * Render the current template with `options`
 *
 * @param {Object} options
 * @param {Function} fn
 *
 * @see Interpreter.template
 */
Interpreter.prototype.render = function(options, fn) {
	var self = this;

	if (options && typeof options === 'function') {
		fn = options;
		options = {};
	}

	if (!self.tmpl || self.tmpl == '') {
		fn && fn(null, '');
		return;
	}
	
	async.waterfall(
		[
			// clean the new lines
			function(callback) {
				cleanNewlines(self.tmpl, callback);
			},

			// render the blocks
			reanderBlocks,

			// replace the params context
			reanderParamContext,

			// replace the vars
			reanderVars,
		],
		// render complete
	    function(err, output) {
	        fn(err, output);
	    }

	);

	return self;
};


/**
 * Clean de new lines outside blocks of `input`
 *
 * @param {String} input
 */
function cleanNewlines(input, fn) {
	var target = input;
	
	// clean de new lines in the block end
	var beRegex = new XRegExp('(?<be>\\!>)([\s\t]*(\r\n|\n))', 'gi');
	var biRegex = new XRegExp('((\r\n|\n)[\s\t]*)(?<bi><\\!js)', 'gi');

	target = XRegExp.replace(target, beRegex, function(match) {
	    return match.be;
	});

	target = XRegExp.replace(target, biRegex, function(match) {
	    return match.bi;
	});

	fn && fn(null, target)
}

/**
 * Make the blocks of `input`
 *
 *@param {String} input
 */
function reanderBlocks(input, fn) {
	var output = ''
	  , renderer = new Renderer();;

	/* 
	 * possible BUG in XRegExp ?
	 * map the 'name' into 'value' and the 'value' into 'name'
	 */
	var fieldValue = 'name',
		fieldName = 'value';

	var results = XRegExp.matchRecursive(input, '<\\!js', '\\!>', 'gi', {
	    valueNames: ['between', null, 'match', null]
	});
	
	for (var i = 0; i < results.length; i++) {
		var a = results[i][fieldName];
		
		switch(a.toLowerCase()) {
			case 'between': 
				output += renderer.response(results[i][fieldValue]);
			break;
			default:
				output += results[i][fieldValue];	
		};

	};

	fn && fn(null, output);
}

/**
 * Replace the params context into `input`
 *
 * @params {String} input
 */
function reanderParamContext(input, fn) {
	var output = '';
	
	var paramRegex = new XRegExp('\\!\\[(?<param>[a-zA-Z0-9]+)\\]', 'gi');
	
	output = XRegExp.replace(input, paramRegex, function(match) {
	    return '" + (context.' + match.param + ' || "") + "';
	});

	fn && fn(null, output);
}

/**
 * Replace the vars into `input`
 *
 * @params {String} input
 */
function reanderVars(input, fn) {
	var output = '';
	
	var varRegex = new XRegExp('\\!\\!(?<param>[a-zA-Z0-9\.\\[\\]]+)', 'gi');
	
	output = XRegExp.replace(input, varRegex, function(match) {
	    return '" + (' + match.param + ' || "") + "';
	});

	fn && fn(null, output);
}