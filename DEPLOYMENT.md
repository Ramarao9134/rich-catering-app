# Deployment Guide for Rich & Catering App

This guide will help you deploy the Rich & Catering application to Render.

## Prerequisites

1. GitHub account (https://github.com/Ramarao9134)
2. Render account (https://dashboard.render.com/)
3. Git installed on your local machine

## Step 1: Push Code to GitHub

1. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Rich & Catering App"
   ```

2. **Add GitHub remote**:
   ```bash
   git remote add origin https://github.com/Ramarao9134/rich-catering-app.git
   ```

3. **Push to GitHub**:
   ```bash
   git branch -M main
   git push -u origin main
   ```

   If the repository doesn't exist on GitHub:
   - Go to https://github.com/new
   - Create a new repository named `rich-catering-app`
   - Then run the commands above

## Step 2: Deploy to Render

### Option A: Using Render Dashboard

1. **Login to Render**:
   - Go to https://dashboard.render.com/
   - Login with your account (kandaramarao9134@gmail.com)

2. **Create New Web Service**:
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub account if not already connected
   - Select the repository: `Ramarao9134/rich-catering-app`

3. **Configure Service**:
   - **Name**: `rich-catering-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose a paid plan)

4. **Environment Variables**:
   Add these environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000` (Render will override this, but good to have)

5. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Wait for the build to complete (usually 5-10 minutes)

### Option B: Using render.yaml (Recommended)

The repository includes a `render.yaml` file that automates the deployment configuration.

1. **Push code to GitHub** (as in Step 1)

2. **In Render Dashboard**:
   - Go to "New +" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml` and configure the service

## Step 3: Post-Deployment Setup

1. **Initialize Data**:
   After first deployment, you may need to initialize sample data. You can do this by:
   - Using Render's shell feature to run: `npm run init-data`
   - Or add it to the build command temporarily

2. **Access Your Application**:
   - Render will provide a URL like: `https://rich-catering-app.onrender.com`
   - Your app will be accessible at this URL

## Step 4: Update API Base URL (if needed)

If your frontend needs to call the API, make sure the API base URL is configured correctly. The app should work with relative paths, but if you need absolute URLs:

1. Create a `.env` file in the `client` directory:
   ```
   VITE_API_URL=https://your-render-url.onrender.com
   ```

2. Update `client/vite.config.js` or your API client to use this environment variable.

## Troubleshooting

### Build Fails
- Check Render build logs for errors
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Application Crashes
- Check Render service logs
- Verify environment variables are set correctly
- Ensure the start command is correct: `npm start`

### Data Not Persisting
- The current setup uses JSON files for data storage
- For production, consider migrating to a database (MongoDB, PostgreSQL)
- Render provides free PostgreSQL databases

## Next Steps

1. **Set up a Database** (Recommended for production):
   - In Render, create a PostgreSQL database
   - Update `server/index.js` to use the database instead of JSON files

2. **Add Custom Domain**:
   - In Render dashboard, go to your service settings
   - Add your custom domain

3. **Set up SSL**:
   - Render automatically provides SSL certificates
   - Your app will be accessible via HTTPS

4. **Monitor Performance**:
   - Use Render's metrics dashboard
   - Set up alerts for downtime

## Support

For issues:
- Check Render documentation: https://render.com/docs
- Check application logs in Render dashboard
- Review GitHub repository for latest updates

---

**Note**: The free tier on Render may spin down inactive services. For production use, consider upgrading to a paid plan.

