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
  , Node = require('./node')
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
 * TODO: Please optimize this 
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

	var tmpl = self.tmpl;

	var regexLib = {
		doubleQuotedString			: /"([^\\"\n]|\\.)*"/g,
		singleQuotedString			: /'([^\\'\n]|\\.)*'/g,
		string                      : /(["'])(?:\\\1|.)*?\1/,
		block: { 
			  init: '((\r\n|\n)[\s\t]*)?<\\!js'
			, end: '\\!>([\s\t]*(\r\n|\n))?'
		}
	};

	var fieldValue = 'value'
	  , fieldName = 'name'
	  , renderer = new Renderer();;

	if (XRegExp.version[0] === '2') {
		fieldValue = 'name';
		fieldName = 'value';	
	}

	var nodes = [];

	var blocks = XRegExp.matchRecursive(
		tmpl, 
		regexLib.block.init, 
		regexLib.block.end, 'gi', {
	    valueNames: ['between', null, 'match', null]
	});


	var pos = 0, qnodes = [];

	while (match = XRegExp.exec(tmpl, regexLib.string, pos)) {
		//console.log(match);
	    qnodes.push( { start:match.index, end: match.index + match[0].length, match: match[0] } );
	    pos = match.index + match[0].length;
	} 


	for (var i = 0; i < blocks.length; i++) {
		var b = blocks[i];
		var type = b[fieldName];
		var value = b[fieldValue]
			
		switch(type.toLowerCase()) {
			case 'match': 

				var inQuotes = qnodes.some(function(item){
					return item.start < b.start && item.end > b.end;
				});
				
				if (inQuotes) {
					throw new Error('Block in quotes at index: ' + b.start)
				}
				
				nodes.push(new Node({
					type: 'jsblock',
					start: b.start,
					end: b.end,
					content: b[fieldValue]
				}));

			break;
			case 'between': 
				var paramRegex = new XRegExp('\\!\\[(?<param>[a-zA-Z0-9\.]+)\\]', 'gi');
				var varRegex = new XRegExp('\\!\\!(?<param>[a-zA-Z0-9\.\\[\\]]+)', 'gi');
				
				var out = '';

				// make multiplatform
				out = value.replace(/\r\n/ig, '\n');
				out = out.replace(/\r/ig, '\n');

				var lines = out.split('\n');

				var _out = '';

				for (var e = 0; e < lines.length; e++) {
					var line = lines[e].replace(/\n/ig, '');
					//line = line.replace(/"/ig, '\\"');
					//res += ri + '.appendLine(' + self.quote + line + self.quote + ');' + self.newLine;

					var c = 0
					  , r = 'response.appendLine("'
					  , p = [];

					line = XRegExp.replace(line, paramRegex, function(match) {
						p.push(match.param.toString()); // TODO: define context
					    return '{' + (c++).toString() + '}';
					});

					line = XRegExp.replace(line, varRegex, function(match) {
					    p.push(match.param.toString()); // TODO: define context
					    return '{' + (c++).toString() + '}';
					});

					r += line + '"';
					
					if (c) {
						r += ', ' + p.join(', ');
					}

					r += ');';
					_out += r;
				};

				//console.log(lines);

				//var out = renderer.response(value);
				/*				
				out = XRegExp.replace(out, paramRegex, function(match) {
				    return '" + (context.' + match.param + ' || "") + "';
				});

				
				out = XRegExp.replace(out, varRegex, function(match) {
				    return '" + (' + match.param + ' || "") + "';
				});*/

				//console.log(out);
				//console.log(output);
				nodes.push(new Node({
					type: 'renderer',
					start: b.start,
					end: b.end,
					content: _out
				}));

			break;
			default:
				nodes.push(new Node({
					type: 'undefined',
					start: b.start,
					end: b.end,
					content: b[fieldValue]
				}));

				
		};
	}

	var renderer = '';

	nodes.forEach(function(n){
		renderer += n.content;
	});

	console.log(beautify(renderer));

	fn(null, renderer);

	/*
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

	);*/

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
	  , renderer = new Renderer();

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