@echo off

if [%1] equ [] goto help


if exist %1\mm7.standart.js (
    del %1\mm7.standart.js
)

if exist %1\mm7.standart.min.js (
    del %1\mm7.standart.min.js
)

if exist %1\mm7.extended.js (
    del %1\mm7.extended.js
)

if exist %1\mm7.extended.min.js (
    del %1\mm7.extended.min.js
)



wget -q --no-check-certificate -P %1 https://raw.githubusercontent.com/haan78/mm7.js/master/dist/mm7.standart.js
wget -q --no-check-certificate -P %1 https://raw.githubusercontent.com/haan78/mm7.js/master/dist/mm7.standart.min.js
wget -q --no-check-certificate -P %1 https://raw.githubusercontent.com/haan78/mm7.js/master/dist/mm7.extended.js
wget -q --no-check-certificate -P %1 https://raw.githubusercontent.com/haan78/mm7.js/master/dist/mm7.extended.min.js

goto :eof

:help
echo mm7.js get help
echo get [folder]