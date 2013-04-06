/*!
 * Scriptme.Interpreter
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

var 
	fs = require('fs'),
	XRegExp = require('xregexp').XRegExp,
	Renderer = require('./renderer'),
	beautify = require('js-beautify').js_beautify;

/**
 * Initialize a new Interpreter.
 *
 */
var Interpreter = module.exports = function Interpreter() {
	var self = this;

	self.renderer = new Renderer();

	self.tmpl = "";

	self.output = "";

	self.nodes = [];

	self.regex = {
		
	};

	return self;
};

Interpreter.prototype = {

	constructor: Interpreter,

	template: function(value) {
		var self = this;
		if (value == undefined) {
			return self.tmpl;
		}
		
		self.tmpl = value;

		return self;
	},

	render: function(options) {
		var self = this;
	
		/* 
		 * possible BUG in XRegExp ?
		 * map the 'name' into 'value' and the 'value' into 'name'
		 */
		var fieldValue = 'name',
			fieldName = 'value';

		if (!self.tmpl || self.tmpl == '') return;
		
		var tmpl = self.tmpl;

		// clean de new lines in the block end
		var beRegex = new XRegExp('(?<be>\\!>)([\s\t]*(\r\n|\n))', 'gi');
		var biRegex = new XRegExp('((\r\n|\n)[\s\t]*)(?<bi><\\!js)', 'gi');

		tmpl = XRegExp.replace(tmpl, beRegex, function(match) {
		    return match.be;
		});

		tmpl = XRegExp.replace(tmpl, biRegex, function(match) {
		    return match.bi;
		});

 		console.log(tmpl);

		var result = XRegExp.matchRecursive(tmpl, '<\\!js', '\\!>', 'gi', {
		    valueNames: ['between', null, 'match', null]
		});
		

		/*str = XRegExp.replace(str, self.regex.dataValue, function (match) {
		  return match.replace(match.param, 'xregexp.com');
		});*/

		self.output = "";

		for (var i = 0; i < result.length; i++) {
			var a = result[i][fieldName];
			
			switch(a.toLowerCase()) {
				case 'between': 
					self.output += self.renderer.response(result[i][fieldValue]);
				break;
				default:
					self.output += result[i][fieldValue];	
			};

		};

		fs.writeFileSync('./cache/outtempl.log', self.output);

		var paramRegex = new XRegExp('\\!\\[(?<param>[a-zA-Z0-9]+)\\]', 'gi');
		
		self.output = XRegExp.replace(self.output, paramRegex, function(match) {
		    return '" + context.' + match.param + ' + "';
		});

		var varRegex = new XRegExp('\\!\\!(?<param>[a-zA-Z0-9\.\\[\\]]+)', 'gi');
		
		self.output = XRegExp.replace(self.output, varRegex, function(match) {
		    return '" + ' + match.param + '+ "';
		});

		fs.writeFileSync('./cache/templ.log', beautify(self.output));
		
		
		return self;
	}

};