# Quick Deploy to Render - 5 Minutes

## Step 1: MongoDB Atlas (2 minutes)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster
4. Click "Connect" → "Connect your application"
5. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/saas_pm`
6. In "Network Access", add IP: `0.0.0.0/0`

## Step 2: Push to GitHub (1 minute)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 3: Deploy on Render (2 minutes)

1. Go to https://dashboard.render.com/register
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Fill in:
   - **Name**: `saas-project-manager`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Advanced" and add environment variables:
   - `MONGO_URI`: (paste your MongoDB Atlas connection string)
   - `JWT_SECRET`: `your-secret-key-change-this-in-production`
   - `PORT`: `5000`
7. Click "Create Web Service"

## Done! 🎉

Your app will be live at: `https://saas-project-manager.onrender.com`

Test it:
```bash
curl https://your-app-name.onrender.com/
```

## Important Notes

- Free tier apps sleep after 15 min of inactivity
- First request after sleep takes ~30 seconds
- Auto-deploys on every git push to main branch
