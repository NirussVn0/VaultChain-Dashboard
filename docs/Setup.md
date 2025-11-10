# 🚀 VaultChain Dashboard – Setup Guide

> Complete setup instructions for developers joining the VaultChain project.

***

## 📋 Prerequisites

Before starting, ensure you have installed:

- **Node.js** 20+ ([nodejs.org](https://nodejs.org))
- **pnpm** 9+ (`npm install -g pnpm`)
- **Docker** (optional, for PostgreSQL) ([docker.com](https://docker.com))
- **Git** ([git-scm.com](https://git-scm.com))

***

## 🛠️ Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/vaultchain-dashboard.git
cd vaultchain-dashboard
```

### 2. Install Dependencies

```bash
# Install all workspace dependencies
pnpm install
```

***

## ⚙️ Environment Configuration

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit `frontend/.env` with your settings:
   ```env
   # Backend API endpoint
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
   
   # Optional: Custom WebSocket for market data
   NEXT_PUBLIC_MARKETDATA_WS_URL=
   
   # Dev mode: use mock data (true/false)
   NEXT_PUBLIC_MARKETDATA_FORCE_MOCK=false
   ```

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Copy environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit `backend/.env`:
   ```env
   # PostgreSQL connection string
   DATABASE_URL=postgresql://vaultchain:password@localhost:5432/vaultchain
   
   # JWT authentication
   JWT_SECRET=your-super-secret-key-change-me
   JWT_EXPIRES_IN=3600
   
   # Optional: password encryption pepper
   PASSWORD_PEPPER=optional-extra-secret
   ```

   **Important:** Generate a secure JWT_SECRET:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

***

## 🗄️ Database Setup

### Option A: Docker (Recommended)

```bash
docker run --name vaultchain-postgres \
  -e POSTGRES_USER=vaultchain \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=vaultchain \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### Option B: Local PostgreSQL Installation

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:**  
Download installer from [postgresql.org](https://www.postgresql.org/download/windows/)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database & User

```bash
# Connect to PostgreSQL
psql -U postgres

# Run these commands
CREATE USER vaultchain WITH ENCRYPTED PASSWORD 'password';
CREATE DATABASE vaultchain OWNER vaultchain;
GRANT ALL PRIVILEGES ON DATABASE vaultchain TO vaultchain;
\q
```

***

## 🔄 Prisma Migrations

```bash
cd backend

# Generate Prisma Client
pnpm prisma generate --schema=prisma/schema.prisma

# Run migrations
pnpm prisma migrate deploy --schema=prisma/schema.prisma

# (Optional) Open Prisma Studio to view data
pnpm prisma studio
```

***

## 🚀 Running the Project

### Development Mode

**Terminal 1 (Backend):**
```bash
pnpm dev:backend
```
Backend runs at: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)

**Terminal 2 (Frontend):**
```bash
pnpm dev
```
Frontend runs at: [http://localhost:3000](http://localhost:3000)

### Using Docker Compose

```bash
docker compose up --build
```

***

## 🧪 Verification

1. **Backend Health Check:**
   ```bash
   curl http://localhost:4000/api/v1/health
   ```

2. **Frontend Access:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Navigate to [http://localhost:3000/auth/login](http://localhost:3000/auth/login)

3. **Database Connection:**
   ```bash
   cd backend
   pnpm prisma studio
   ```

***

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start frontend dev server |
| `pnpm dev:backend` | Start backend dev server |
| `pnpm build` | Build all packages |
| `pnpm lint` | Lint all code |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm test` | Run tests |

***

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9
```

### Prisma Client Not Found

```bash
cd backend
pnpm prisma generate --schema=prisma/schema.prisma
```

### Database Connection Failed

- Verify PostgreSQL is running: `docker ps` or `brew services list`
- Check `DATABASE_URL` in `backend/.env`
- Ensure database and user exist

***

## 🔐 Git Workflow

### Before Committing

```bash
# Run quality checks
pnpm lint
pnpm typecheck
pnpm build
```
### Pre-commit Hooks (Husky)

Install git hooks:
```bash
pnpm add -D husky -w
npx husky init
```

***

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_MARKETDATA_WS_URL` (if needed)

### Backend (Railway/Render)

1. Connect GitHub repository
2. Set environment variables:
   - `DATABASE_URL` (use Railway's PostgreSQL plugin)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
3. Add build command: `pnpm build`
4. Add start command: `pnpm start`
5. Run migrations: `pnpm prisma migrate deploy`

***

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Follow setup steps above
4. Make your changes
5. Run quality checks: `pnpm lint && pnpm typecheck`
6. Commit with conventional format
7. Push and create Pull Request

***

## 📞 Need Help?

- Check `docs/architecture.md` for system design
- Open an issue on GitHub
- Contact maintainers (see main README)

***

**Ready to contribute? Let's build something amazing! 🚀**