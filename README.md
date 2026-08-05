# 🚀 Task Hunters - Premium Reddit Micro-Task Marketplace

Task Hunters is an automated Reddit micro-task marketplace with real-time claim locks, Google Sheets API integration, 6-hour verification timers, and an autonomous AI Agent backend suite.

---

## 🔒 SECURITY WARNING & SECRET ROTATION NOTICE

> [!WARNING]
> **CRITICAL SECURITY REQUIREMENT BEFORE CLOUD DEPLOYMENT**:
> Any secrets, keys, or passwords used during local development must be rotated immediately before deploying to production cloud hosts (Railway, Render, AWS, Vercel).
> 
> 1. **Rotate `JWT_SECRET`**: Generate a new 64-character random string via `openssl rand -hex 32` and set it in your cloud provider's environment variables.
> 2. **Rotate Admin Password**: Update `ADMIN_INITIAL_PASSWORD` in your production environment variables to a unique password.
> 3. **Rotate Google API Keys**: Replace `VITE_SHEETS_API_KEY` with restricted Google Cloud console keys.
> 4. **Database Connection String**: Set `DATABASE_URL` to your production database URL (e.g. PostgreSQL or managed SQLite).
> 5. **Git History Hygiene**: Do NOT commit `.env` to public repositories. Ensure `.env` remains in `.gitignore`.

---

## 🛠️ Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```

---

## 🛡️ Data Protection Architecture

- **Password Security**: Hashed via `bcryptjs` (10 salt rounds). Never returned in API responses or stored in frontend state.
- **Role Verification**: Admin API endpoints verify signed JWT tokens on the server gate.
- **Console Scrubber**: `securityGuard.js` redacts sensitive credentials from browser console logs.
