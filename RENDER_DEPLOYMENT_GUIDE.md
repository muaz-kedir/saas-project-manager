# Deploy to Render - Step by Step Guide

## Prerequisites

1. A GitHub account
2. Your code pushed to a GitHub repository
3. A Render account (sign up at https://render.com - it's free!)

## Step 1: Prepare Your Application

### 1.1 Update package.json

Make sure your `package.json` has the correct start script (already done):
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

### 1.2 Check .gitignore

Make sure `.env` is in your `.gitignore` file so you don't commit secrets.

### 1.3 Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

## Step 2: Set Up MongoDB Atlas (Free Cloud Database)

Since Render needs a cloud database, we'll use MongoDB Atlas:

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new cluster (choose the FREE tier)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
7. Replace `<password>` with your actual password
8. Add your database name at the end: `mongodb+srv://username:password@cluster.mongodb.net/saas_pm`

**Important**: Whitelist all IP addresses (0.0.0.0/0) in Network Access for Render to connect.

## Step 3: Deploy on Render

### 3.1 Create New Web Service

1. Go to https://dashboard.render.com
2. Click "New +" button
3. Select "Web Service"
4. Connect your GitHub account if not already connected
5. Select your repository (`saas-project-manager`)

### 3.2 Configure Your Service

Fill in the following details:

**Name**: `saas-project-manager` (or any name you prefer)

**Region**: Choose closest to you

**Branch**: `main` (or your default branch)

**Root Directory**: Leave empty

**Runtime**: `Node`

**Build Command**: 
```
npm install
```

**Start Command**: 
```
npm start
```

**Instance Type**: `Free`

### 3.3 Add Environment Variables

Click "Advanced" and add these environment variables:

| Key | Value |
|-----|-------|
| `PORT` | `5000` |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A random secure string (e.g., `your-super-secret-jwt-key-change-this`) |
| `NODE_ENV` | `production` |

**To generate a secure JWT_SECRET**, you can use:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your app
3. Wait for the deployment to complete (usually 2-5 minutes)
4. You'll get a URL like: `https://saas-project-manager.onrender.com`

## Step 4: Test Your Deployment

Once deployed, test your API:

```bash
# Test root endpoint
curl https://your-app-name.onrender.com/

# Should return: 🚀 API is running
```

Test with Postman:
```
POST https://your-app-name.onrender.com/api/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

## Step 5: Auto-Deploy on Git Push

Render automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will detect the push and redeploy automatically!

## Common Issues & Solutions

### Issue 1: "Application failed to respond"
- Check your logs in Render dashboard
- Make sure PORT environment variable is set
- Verify your start command is correct

### Issue 2: "Cannot connect to MongoDB"
- Verify MongoDB Atlas connection string is correct
- Check that you whitelisted 0.0.0.0/0 in Network Access
- Make sure password doesn't contain special characters (or URL encode them)

### Issue 3: "Module not found"
- Make sure all dependencies are in `package.json` (not devDependencies)
- Check that build command is `npm install`

### Issue 4: App sleeps after inactivity (Free tier)
- Free tier apps sleep after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Upgrade to paid tier for always-on service

## Monitoring Your App

### View Logs
1. Go to your service in Render dashboard
2. Click "Logs" tab
3. See real-time logs of your application

### View Metrics
1. Click "Metrics" tab
2. See CPU, Memory, and Request metrics

## Updating Your App

1. Make changes locally
2. Test locally with `npm run dev`
3. Commit and push:
```bash
git add .
git commit -m "Your changes"
git push origin main
```
4. Render automatically redeploys!

## Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domain"
3. Add your domain
4. Update your DNS records as instructed

## Environment Variables Management

To update environment variables:
1. Go to service settings
2. Click "Environment"
3. Add/Edit variables
4. Click "Save Changes"
5. Service will automatically redeploy

## Cost

- **Free Tier**: 
  - 750 hours/month free
  - App sleeps after 15 min inactivity
  - Perfect for development/testing

- **Paid Tier** ($7/month):
  - Always on
  - No sleep
  - Better performance

## Security Best Practices

1. Never commit `.env` file
2. Use strong JWT_SECRET
3. Enable CORS properly in production
4. Use HTTPS (Render provides this automatically)
5. Regularly update dependencies

## Backup Strategy

1. MongoDB Atlas has automatic backups
2. Keep your code in GitHub
3. Export important data regularly

## Next Steps

1. Set up a staging environment (deploy from `develop` branch)
2. Add health check endpoint
3. Set up monitoring/alerts
4. Configure custom domain
5. Add CI/CD tests before deployment

## Support

- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Your app logs: Check Render dashboard

## Quick Reference

**Your App URL**: `https://your-app-name.onrender.com`

**API Endpoints**:
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/workspaces` - Create workspace
- `GET /api/workspaces` - Get workspaces
- And all your other endpoints...

**MongoDB Connection**: MongoDB Atlas
**Deployment**: Automatic on git push
**Logs**: Render Dashboard > Logs
