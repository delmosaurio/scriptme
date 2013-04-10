# Scriptme
 
 Scriptme is a smart-template engine written in [Node.js](http://nodejs.org/) inspired by script-host platform like php+html but using javascript code, you cant make text/plain, source code or anything you want

 *This project still remains as an idea. I'm working on it.*

### npm install

```
npm install scriptme
```

### usage

```
Usage: scriptme -i "path/from/template" -o "path/to/template" [options]

-i, --input   <filename>  Input template file
-o, --output  <filename>  Output rendered file

Options:

    -v, --version             Display a version of Scriptme
    -h, --help                Display this text
    -d, --data    <filename>  Json data file
    --force                   Force override output file
```

### example

create the template file `/path/from/template.js`

basic

```javascript
;
// ![description]
(function( $ ) {
  $.fn.![pluginname] = function() {
    
    $.fn.foo = function() {
    	return $('.bar');
	};

	$.fn.bar = function() {
		return $('.foo');
	};

  };
})( jQuery );
```

advanced

```javascript
;
// ![description]

<!js 
	// multiple javascript code here
	var funcs = ['foo', 'bar'];
!>

(function( $ ) {
  $.fn.![pluginname] = function() {

    <!js for(var i=0; i < funcs.length; i++) {!>
	$.fn.!!funcs[i] = function() {
    	return $('.!!funcs[i]');
	};
	<!js } !>

  };
})( jQuery );
```

json `data.json`

```javascript
{
    "pluginname": "myPlugin",
    "description": "my jQuery plugin description"
}
```

##### output

`./myplugin.js`

```javascript
;
// my jQuery plugin description
(function( $ ) {
  $.fn.myPlugin = function() {
    
    $.fn.foo = function() {
    	return $('.bar');
	};

	$.fn.bar = function() {
		return $('.foo');
	};

  };
})( jQuery );
```

##### node.js code

```javascript
var 
    fs = require('fs'),
    scriptme = require('scriptme');

var data = {
	pluginname: 'myPlugin',
	description: 'my jQuery plugin description'
};

var template = fs.readFileSync('/path/from/template.js');
var writer = fs.createWriteStream('./myplugin.js');

scriptme.render(script, writer, data, function(error, response) {
	
	if (error !== null) {
		console.error(error);	
		return;
	}
	
	console.log('ready!');	
	
});

```

##### command

```
scriptme -i "path/from/template.js" -o myplugin.js -d data.json
```

## more information

When I started thinking on this tool, I did it because I worked on projects with different langs
and I saw that  the source code are different to another in little changes and if you think one solution
for a program or a module or a function, why you need write every time its precondition changes 
or when the technology change?, so i started thinking in intelligent templates with inputs params
to get an usefull output, imagine if you can make an index.html template for your web projects and 
when you start a new web project copy its template and change only the title, this tool help to make this
task easily and you can also use this tool for change the title at runtime too.
I worked on developing an Personal ORM and use this formula for it but this project is writen in C#.Net and
is not multiplataform and i wanted share this tool on this lang but would be leaving out to many people and 
then i discovered Node.js and i loved.
So i'm here writing js code i not so good (a little newbie) but i will try to give the best.

NOTE: Sorry for my bad english i working on it but, i'm write source code nothing else matters.

## feedback 

If you like, send me a feedback to <dcardev@gmail.com> i'm an open mind for new ideas or critics

## license 

(The MIT License)

Copyright (c) 2012-2013 Delmo Carrozzo &lt;dcardev@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
