@echo off
scp -P 22 -r dist/* bcsoetta@bcsoetta.org:~/www/patops
@echo on
