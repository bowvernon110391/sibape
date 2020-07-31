@echo off
cd %SYSTEMROOT%
cd System32
cd drivers
cd etc
echo setting up our special path directive...
type hosts | findstr -v "#bowie" > newhosts

rem add our path
echo 192.168.146.10 ssoserv.bcsoetta.org  #bowie >> newhosts
echo 192.168.146.10 api-patops.bcsoetta.org  #bowie >> newhosts
echo 192.168.146.10 patops.bcsoetta.org  #bowie >> newhosts

del hosts
ren newhosts hosts
pause

