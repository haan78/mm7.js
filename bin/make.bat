del ..\dist\mm7.all.in.one.js
del ..\dist\mm7.all.in.one.min.js
set timestamp=%DATE:/=-%@%TIME::=-%

echo /* BUILD %timestamp%  > ..\dist\mm7.all.in.one.js
echo MM7 Java Script Part */ >> ..\dist\mm7.all.in.one.js

type ..\src\mm7.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.loader.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.document.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.url.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.json.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.jsonp.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.http.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.form.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.element.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.object.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.date.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.timer.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.base64.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.paging.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.string.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.navigator.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.array.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.browser.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.tab.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.roller.js >> ..\dist\mm7.all.in.one.js
type ..\src\mm7.math.js >> ..\dist\mm7.all.in.one.js


java -jar yuicompressor-2.4.8.jar ..\dist\mm7.all.in.one.js -o ..\dist\mm7.all.in.one.min.js