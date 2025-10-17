# Les Patounes

Communauté Puppy LGBT+ à Paris

## Architecture

- **Frontend**: React + Vite + Tailwind CSS + Ion-Icons
- **Backend**: NestJS + Prisma
- **Database**: PostgreSQL
- **Deployment**: Docker + Docker Compose

## Structure du projet

```
lespatounnes/
├── app/              # Application React (Frontend)
├── api/              # API NestJS (Backend)
├── docker-compose.yml # Configuration Docker pour production
└── index.html        # Site vitrine statique
```

## Développement local

### Frontend (React)

```bash
cd app
npm install
npm run dev
```

L'application sera accessible sur http://localhost:5173

### Backend (API NestJS)

```bash
cd api
npm install
npm run start:dev
```

L'API sera accessible sur http://localhost:3000

### Base de données

Pour démarrer uniquement PostgreSQL en local :

```bash
docker-compose up postgres -d
```

Ensuite, exécutez les migrations Prisma :

```bash
cd api
npx prisma migrate dev
```

## Déploiement en production

### Avec Docker Compose

Construire et démarrer tous les services :

```bash
docker-compose up -d --build
```

Services disponibles :
- **Frontend**: http://localhost (port 80)
- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### Arrêter les services

```bash
docker-compose down
```

### Arrêter et supprimer les volumes

```bash
docker-compose down -v
```

## Variables d'environnement

Copiez `.env.example` vers `api/.env` et ajustez les valeurs si nécessaire :

```bash
cp .env.example api/.env
```

## Prisma

### Créer une migration

```bash
cd api
npx prisma migrate dev --name nom_de_la_migration
```

### Générer le client Prisma

```bash
cd api
npx prisma generate
```

### Ouvrir Prisma Studio

```bash
cd api
npx prisma studio
```

## Technologies utilisées

### Frontend
- React 18
- Vite
- Tailwind CSS
- Ion-Icons

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- TypeScript

### DevOps
- Docker
- Docker Compose
- Nginx
