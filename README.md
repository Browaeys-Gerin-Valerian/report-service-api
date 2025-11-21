# 📘 Report Service API

API Node.js + Express + TypeScript + MongoDB avec Docker.

## 📁 Structure du projet

my-app/
├─ src/ # Code TypeScript
├─ docker/ # Fichiers Docker
│ ├─ Dockerfile.dev
│ ├─ Dockerfile.prod
│ ├─ docker-compose.dev.yml
│ └─ docker-compose.prod.yml
├─ package.json
├─ tsconfig.json
├─ .env
└─ README.md

## ⚙️ Prérequis

- Node.js 24+
- npm ou yarn
- Docker Desktop (Windows / Mac / Linux)
- Docker Compose V2
- MongoDB (sera lancé via Docker)

### 🚀 Lancer les containers

Depuis le dossier `docker/` :

- Pour le mode dev:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- Pour le mode prod:

```bash
docker-compose -f docker-compose.prod.yml up --build
```

Pour lancer les containers en mode detacher ajouter l'option -d a la fin des deux instructions précedentes.

- #### Verifier que les containers tournent bien:

```bash
docker ps
```

- #### Arrêter les containers:

Pour le mode dev:

```bash
docker-compose -f docker-compose.dev.yml down
```

Pour le mode prod:

```bash
docker-compose -f docker-compose.prod.yml down
```
