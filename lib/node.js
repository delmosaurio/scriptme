/*!
 * Scriptme.Node
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

 /**
  * Module dependencies.
  */
var XRegExp = require('xregexp').XRegExp;

/**
 * Initialize a new Node.
 *
 */
var Node = module.exports = function Node(options) {
	var self = this;

	var ops = options || {};

	self.type = 	options.type || 'outside';
	self.start = 	options.start;
	self.end = 	options.end;
	self.content = 	options.content;

	return self;
};

Node.prototype.constructor = Node;