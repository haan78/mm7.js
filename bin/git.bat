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

rem if exist %target%/.git (
rem	rmdir /s /q "%target%/.git"
rem )

rem if exist "%target%/nbproject" (
rem 	rmdir /s /q "%target%/nbproject"
rem )

rem if exist "%target%/.gitignore" (
rem	del /f /q "%target%\\.gitignore"
rem )
goto :eof

:err1
echo Folder %1 hasn't been found
goto :eof

:err2
echo %settings% file hasn't been found
goto :eof

:help
echo Usage of mm7 git is...
echo To put mm7 libary into current folder: git
echo To put mm7 libary into specific folder: git [folder name]
echo To show this help : git -h
