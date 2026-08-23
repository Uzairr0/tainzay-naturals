# Deploying Tainzay Naturals

## Why you may see Vercel 404 NOT_FOUND

This repo is a **monorepo**. The Next.js website lives in **`tainzay-frontend/`**, not the repo root.

If Vercel Root Directory is left blank, it deploys the root folder (which has no app) → **404 on every URL**.

---

## Vercel (frontend) — fix the 404

1. Open [vercel.com](https://vercel.com) → your **tainzay-naturals** project
2. **Settings** → **General**
3. **Root Directory** → click **Edit** → set to:

   ```
   tainzay-frontend
   ```

4. **Settings** → **Environment Variables** → add:

   | Name | Value | Example |
   |------|--------|---------|
   | `NEXT_PUBLIC_API_URL` | Your Render backend API URL | `https://your-app.onrender.com/api` |
   | `NEXT_PUBLIC_SITE_URL` | Your Vercel site URL | `https://tainzay-naturals.vercel.app` |
   | `ADMIN_PASSWORD` | Admin login password | (your choice) |
   | `ADMIN_SESSION_SECRET` | Long random string | (your choice) |

   Apply to **Production**, **Preview**, and **Development**.

5. **Deployments** → open latest deployment → **Redeploy** (use “Redeploy with existing Build Cache” or full redeploy)

6. After build finishes, open the **Visit** link — you should see the homepage, not 404.

### Vercel build settings (should auto-detect)

| Setting | Value |
|---------|--------|
| Framework | Next.js |
| Root Directory | `tainzay-frontend` |
| Build Command | `npm run build` |
| Install Command | `npm install` |
| Output Directory | *(leave default — Next.js)* |

---

## Render (backend)

1. **Root Directory**: `tainzay-backend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Environment variables** (from `.env.example`):

   - `MONGODB_URI`
   - `PORT` (Render sets this automatically — use `10000` or leave Render default)
   - `NODE_ENV=production`
   - SMTP / notification vars as needed
   - `ADMIN_SESSION_SECRET` — **same value as Vercel** (for admin WebSocket auth)

5. Copy the Render service URL, e.g. `https://tainzay-api.onrender.com`
6. Set Vercel `NEXT_PUBLIC_API_URL` to `https://tainzay-api.onrender.com/api` (include `/api`)

---

## Quick checklist

- [ ] Vercel Root Directory = `tainzay-frontend`
- [ ] Vercel `NEXT_PUBLIC_API_URL` = Render URL + `/api`
- [ ] Render Root Directory = `tainzay-backend`
- [ ] Redeploy Vercel after changing settings
- [ ] MongoDB Atlas Network Access allows connections (0.0.0.0/0 for Render, or Render IPs)

---

## Test after deploy

- Homepage loads (no 404)
- `/products` shows catalogue
- Browser Network tab: API calls go to Render, not `localhost:5000`
