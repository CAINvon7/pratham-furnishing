# Deployment

This project has two deployable apps:

- `backend`: Express + MongoDB API
- `frontend`: Vite React website

## 1. Deploy Backend on Render

Create a Render Web Service connected to this repository.

Settings:

- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `npm install`
- Start Command: `npm start`

Environment variables:

- `MONGO_URI`: MongoDB Atlas connection string
- `ADMIN_SETUP_KEY`: private key used for admin setup
- `FRONTEND_URL`: final Vercel production URL, for example `https://your-site.vercel.app`
- `FRONTEND_URLS`: optional comma-separated list for production/custom/preview URLs
- `VERCEL_APP_SLUG`: optional Vercel project slug, used to allow Vercel preview URLs

After deploy, copy the Render URL, for example:

```text
https://pratham-furnishing-api.onrender.com
```

## 2. Deploy Frontend on Vercel

Create a Vercel project connected to this repository.

Settings:

- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Environment variables:

- `VITE_API_URL`: Render backend URL, for example `https://pratham-furnishing-api.onrender.com`

## 3. Final CORS Update

After Vercel gives you the live frontend URL, add it to the backend Render service:

```text
FRONTEND_URL=https://your-site.vercel.app
```

Redeploy the backend after changing this value.

## 4. Quick Checks

- Visit the backend URL and confirm it returns JSON.
- Visit `https://your-backend-url/api/products` and confirm it returns JSON.
- Visit the Vercel URL and confirm products load.
- Test the contact inquiry form.
- Test admin login/setup.

