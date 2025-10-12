
<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# Raven Nest 🦅

**Raven Nest** is a modern backend service built with **NestJS**, **TypeORM**, and **PostgreSQL**, designed to provide a scalable, modular, and secure foundation for Raven’s ecosystem.  
It implements clean architecture principles and includes built-in authentication, validation, and monitoring.

---

## 🧩 Core Features

- **NestJS + TypeORM**: Modular and dependency-injected structure for maintainable services.
- **Authentication & Authorization**: JWT-based login with Passport integration.
- **Validation**: Global `ValidationPipe` for DTOs with strict input sanitization.
- **Security**: Helmet middleware and rate limiting (Throttler) enabled by default.
- **Health Monitoring**: `/health` and `HEAD /health` endpoints for uptime checks.
- **API Documentation**: Integrated Swagger UI with JWT auto-authorization.
- **CORS & Environment Config**: Dynamic configuration for multiple origins and deployment stages.

---

## 🧠 Project Structure

```
src/
│
├── auth/                 # Authentication and JWT strategy
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── jwt-auth.guard.ts
│
├── users/                # Users module (CRUD endpoints)
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── dto/
│   └── user.entity.ts
│
├── health/               # Health check endpoints
│   ├── health.controller.ts
│   └── health.module.ts
│
├── main.ts               # Application bootstrap and Swagger setup
└── app.module.ts         # Global module configuration
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following configuration:

```bash
# Server
PORT=4000
CORS_ORIGINS=http://localhost:3000

# PostgreSQL
PGHOST=localhost
PGPORT=5432
PGDATABASE=raven_nest
PGUSER=postgres
PGPASSWORD=postgres

# JWT
JWT_SECRET=change-me
JWT_EXPIRES=1h
```

---

## 🚀 Running the Project

### Install Dependencies
```bash
npm install
```

### Run in Development
```bash
npm run start:dev
```

### Build for Production
```bash
npm run build
npm run start:prod
```

---

## 📘 API Documentation (Swagger)

Once the server is running, Swagger UI is available at:

```
http://localhost:4000/docs
```

- **Persistent JWT authorization** (keeps token after page refresh)
- **Auto-login script** integrated to read token from `localStorage` after `/auth/login`
- **Bearer scheme** automatically configured for all secured routes

---

## 🛡️ Security

The application includes essential security middleware by default:

- `helmet()` → sets HTTP headers to secure Express apps
- `ValidationPipe` → cleans and validates all incoming payloads
- `ThrottlerModule` → rate-limits requests per IP
- `CORS` → controlled through environment variables

---

## 🧩 Health Checks

Endpoints available for monitoring and uptime verification:

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/health` | Returns system uptime, timestamp, and environment |
| HEAD | `/health` | Lightweight probe for liveness checks |

---

## 🧰 Development Standards

- Follow **NestJS module-first structure**
- Maintain **DTOs for every endpoint**
- Ensure **Swagger decorators** for public APIs
- Run ESLint and Prettier before pushing any changes
- Prefer **TypeScript strict mode** and explicit typing

---

## 🤝 Contribution Guide

1. Fork the repository  
2. Create a new branch (`feature/<feature-name>` or `fix/<issue-name>`)  
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/)  
4. Submit a Pull Request for review

Example commit:
```bash
feat(auth): add JWT refresh token endpoint
```

---

## 🧑‍💻 Maintainers

**Raven Core Team**  
Lead Technical Engineer: *Oscar Bonelli*  
Assistant Engineer: *Sofia*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with ❤️ using [NestJS](https://nestjs.com/)
