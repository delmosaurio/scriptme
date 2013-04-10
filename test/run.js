// test for scriptme

var 
    // ext modules  
    fs = require('fs'),
    basename = require('path').basename,
    dirname = require('path').dirname,
    resolve = require('path').resolve,
    join = require('path').join,
    mkdirp = require('mkdirp')
    // scriptme modules
    scriptme = require('../lib/scriptme');

var context = { description: 'my jQuery plugin description' };

var template = fs.readFileSync('./test/cases/jquery.plugin.js', 'utf8');

mkdirp('./test/cases/output');

var writer = fs.createWriteStream('./test/cases/output/myplugin.js');

scriptme.render(template, writer, context, function(err, response) {
   if (err) console.error(err);
});
