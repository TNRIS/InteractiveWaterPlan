echo off
REM %1 should be the directory above /Scripts
cd %1\Scripts\Compiled\backbone_app

REM Build the non-optimized app, output to Scripts folder
call r.js.cmd -o optimize=none baseUrl=. name=main.js out=../../iswp-app.js paths.scripts=../.. paths.templates=../../templates

REM Build the optimized version, output to Scrips folder
call r.js.cmd -o baseUrl=. name=main.js out=../../iswp-app.min.js paths.scripts=../.. paths.templates=../../templates