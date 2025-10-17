@echo off
echo Demarrage de la base de donnees PostgreSQL...
docker-compose up -d postgres
echo.
echo PostgreSQL est maintenant accessible sur localhost:5432
echo.
pause
