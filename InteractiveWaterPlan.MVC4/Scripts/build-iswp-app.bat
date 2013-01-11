echo %1
cd %1\Scripts\Compiled\backbone_app
REM
REM Build the non-optimized app, output to Scripts folder
call r.js.cmd -o optimize=none baseUrl=. name=ISWPApp.js out=../../iswp-app.js paths.scripts=../.. paths.templates=../../templates
REM
REM Build the optimized version, output to Scrips folder
call r.js.cmd -o baseUrl=. name=ISWPApp.js out=../../iswp-app.min.js paths.scripts=../.. paths.templates=../../templates