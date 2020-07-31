@echo off
cd %SYSTEMROOT%
cd System32
cd drivers
cd etc
echo removing our special path directive...
type hosts | findstr -v "#bowie" > newhosts
del hosts
ren newhosts hosts
pause

