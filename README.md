# Fullstack Java Project

## Jitske Lenaerts 3AONA

## Folder structure

- Readme.md
- _architecture_: this folder contains documentation regarding the architecture of your system.
- `docker-compose.yml` : to start the backend (starts all microservices)
- _backend-java_: contains microservices written in java
- _demo-artifacts_: contains images, files, etc that are useful for demo purposes.
- _frontend-web_: contains the Angular webclient

Each folder contains its own specific `.gitignore` file.
**⚠️ complete these files asap, so you don't litter your repository with binary build artifacts!**

## How to setup and run this application

#### **Docker:**

```
docker compose up
```

#### **Backend:**

Elke microservice starten in deze volgorde:

1. ConfigServiceApplication
2. DiscoveryServiceApplication
3. GatewayServiceApplication
4. NotificationServiceApplication
5. PostServiceApplication
6. ReviewServiceApplication
7. CommentServiceApplication

#### **Frontend:**

* Runnen:

```powershell
npm install
ng serve -o
```

* Testen:

```powershell
ng build
ng test --code-coverage
```
