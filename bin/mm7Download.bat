@echo off

setlocal enabledelayedexpansion

set settings=requirements.txt
set folder=%cd%\

IF [%1] == [] goto :next

if [%1] equ [-h] goto :help
if not exist %1 goto :err1
set "folder=%1"

:next

if not exist %settings% goto :err2

for /f "tokens=*" %%r in (%settings%) do (
	call :load %%r %folder%
)

goto :eof

:load
rem - remove the folder if it exists.

set target=%2\%1
if exist %target% (
	rmdir /s /q %target%
	if exist %target% (
		echo Folder %target% still exists. It couldn't be removed
		goto :end
	)
)

git clone https://github.com/haan78/%1.git %target% 


rem remove unnecessary parts of libary
if exist %target%/.git (
	rmdir /s /q "%target%/.git"
)

if exist "%target%/nbproject" (
	rmdir /s /q "%target%/nbproject"
)

if exist "%target%/.gitignore" (
	del /f /q "%target%\\.gitignore"
)
goto :eof

:err1
echo Folder %1 hasn't been found
goto :eof

:err2
echo %settings% file hasn't been found
goto :eof

:help
echo Usage is...
echo To put mm7 libary into current folder: mm7
echo To put mm7 libary into specific folder: mm7 [folder name]
echo To show this help : mm7 -h
