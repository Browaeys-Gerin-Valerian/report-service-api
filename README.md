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

## 📄 Templates File Storage

### Location

All uploaded template files are stored in the `templates` folder at the root of the project

### File Naming Convention

Uploaded files are renamed according to the following pattern:

`<template_name>-<timestamp>.<extension>`

- `<template_name>`: The `name` field of the template.
- `<timestamp>`: Current timestamp in milliseconds (to avoid collisions).
- `<extension>`: Extension type (.pdf, .docx, ...).

### Notes

- This ensures that files are unique even if multiple files with the same name are uploaded.
- Original file extensions are preserved to maintain compatibility with software (e.g., `.docx`, `.pdf`).
- Temporary files are written directly to the `templates` folder after upload.

## 🚀 Running the Containers

Go to the `docker/` folder.

### Development Mode

start containers:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

stop containers:

```bash
docker-compose -f docker-compose.dev.yml down
```

### Production Mode

```bash
docker-compose -f docker-compose.prod.yml up --build
```

stop containers:

```bash
docker-compose -f docker-compose.prod.yml down
```

To run containers in detached mode, simply add the -d flag at the end of the commands above.

### Check if Containers are Running

```bash
docker ps
```
