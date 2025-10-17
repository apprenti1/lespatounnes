#!/bin/bash

echo "Démarrage de la base de données PostgreSQL..."
docker-compose up -d postgres

echo ""
echo "PostgreSQL est maintenant accessible sur localhost:5432"
echo ""
