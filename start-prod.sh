#!/bin/bash

echo "Démarrage de tous les services en production..."
docker-compose up -d --build

echo ""
echo "Services démarrés :"
echo "- PostgreSQL : localhost:5432"
echo "- API NestJS : http://localhost:3000"
echo "- Application React : http://localhost"
echo ""
