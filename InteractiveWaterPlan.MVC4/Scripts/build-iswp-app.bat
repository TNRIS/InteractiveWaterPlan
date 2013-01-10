echo %1
cd %1\Scripts\Compiled\backbone_app
r.js.cmd -o optimize=none baseUrl=. name=app.js out=iswp-app.js paths.scripts=../.. paths.templates=../../templates