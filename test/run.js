  process.env.NODE_ENV = 'test';

  var fs = require('fs')
    , basename = require('path').basename
    , dirname = require('path').dirname
    , resolve = require('path').resolve
    , join = require('path').join
    , mkdirp = require('mkdirp')
    , scriptme = require('../lib/scriptme')
    , assert = require('assert');

describe('Rendering the template `jquery.plugin.js`', function() {

    before(function(done){
        mkdirp('./test/cases/output', function(err){
            
            if (err) { throw err; }

            var context = JSON.parse(fs.readFileSync('./test/cases/data.json', 'utf8'));
            var template = fs.readFileSync('./test/cases/jquery.plugin.js', 'utf8');
            var writer = fs.createWriteStream('./test/cases/output/myplugin.js');

            scriptme.render(template, writer, context, function(err, response) {
               if (err) { throw err; }

               done();
            });


        }); 
    });

    it('the myplugin.js created', function(){
        assert.ok(fs.existsSync('./test/cases/output/myplugin.js'));
    });

});