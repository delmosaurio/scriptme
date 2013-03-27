/*!
 * Scriptme.Environment
 * Copyright(c) 2012-2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */
 
/**
 * Singleton
 *
 * Environment helps to resolve the differences between platforms.
 *
 */
var Environment = module.exports = (function(undefined) {

	var isWindows = process.platform == 'win32';
	
    var 
        newLine = isWindows ? '\r\n' : '\n',

        test = 'Hi !';

    return {
        newLine: newLine,
        test: test
    };
})();