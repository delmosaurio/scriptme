/*!
 * Scriptme.Cache
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/*
 * TODO: Make a pre-compiler cache
 */

 /**
  * Module dependencies.
  */
var fs = require('fs');

/**
 * Initialize a new Cache with the 'options'.
 *
 * @param {Object} options
 */
var Cache = module.exports = function Cache(options) {
	var self = this;

	self.cachePath = options.cachePath;
	
	return self;
};

Cache.prototype.constructor = Cache;