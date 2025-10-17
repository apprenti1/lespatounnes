@echo off
echo Demarrage de tous les services en production...
docker-compose up -d --build
echo.
echo Services demarres :
echo - PostgreSQL : localhost:5432
echo - API NestJS : http://localhost:3000
echo - Application React : http://localhost
echo.
pause
