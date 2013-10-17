@echo off

set REPORTER=dot

if "%1"=="" goto run
if "%1"=="run" goto run
if "%1"=="test-bin" goto test-bin
if "%1"=="test" goto test
if "%1"=="test-w" goto test-w

echo make: *** No rule to make target `%1'.  Stop.
goto exit

:run
    node bin/scriptme %2 %3 %4 %5 %6
    goto exit
:test-bin
  node bin/scriptme -i "./test/cases/jquery.plugin.js" -o "./test/cases/output/myplugin.js" -d "./test/cases/data.json"
  goto exit
:test
    ./node_modules/.bin/mocha --reporter %REPORTER%
    goto exit

:test-w
  ./node_modules/.bin/mocha --reporter %REPORTER% --growl --watch
  goto exit
:exit
