/*!
 * Scriptme.Renderer
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */
 
var env =  require('./environment');

/**
 * Initialize a new Renderer with the 'options'.
 *
 * @param {Object} options
 */
 var Renderer = module.exports = function Renderer(options) {
	var self = this,
		ops = options || {};

	self.newLine = ops.newLine || env.newLine;
	self.quote = ops.quote || '"';

	return self;
};

Renderer.prototype = {


	/**
	 * Split the lines of the string block and convert each line
	 * to render at runtime
	 *
	 * @param {String} block
	 * @param {Object} options
	 * @return {String} to render at runtime
	 */
	response: function(block, options) {
		var self = this,
			output = block,
			lines = [],
			res = "",
			ops = options || {};

		// response instance name
		var ri = ops.responseInstance || 'response';
		
		if (block === null) return block;

		// make sure that the new line is \n
		output = output.replace(/\r\n/ig, '\n');
		output = output.replace(/\r/ig, '\n');

		// split lines
		lines = output.split('\n');

		for (var i = 0; i < lines.length; i++) {
			var line = lines[i].replace(/\n/ig, '');;
			res += ri + '.writeLine(' + self.quote + lines[i] + self.quote + ');' + self.newLine;
		};

		return res;
	}

};