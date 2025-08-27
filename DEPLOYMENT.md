# GitHub Pages Deployment Guide

## Automatic Deployment (Recommended)

Your portfolio is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Steps:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Optimize for GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select "GitHub Actions" as the source
   - The workflow will automatically deploy your site

3. **Access Your Site**:
   - Your portfolio will be available at: `https://yourusername.github.io/Portfolio`
   - Update the repository name to `yourusername.github.io` to use: `https://yourusername.github.io`

## Manual Setup (Alternative)

If you prefer manual deployment:

1. Go to repository Settings → Pages
2. Set source to "Deploy from a branch"
3. Select "main" branch and "/ (root)" folder
4. Click Save

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file with your domain name
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

## Local Development

To test locally:

```bash
# Start local server
npm run dev
# or
python3 -m http.server 3000

# Open http://localhost:3000
```

## Troubleshooting

- Check the Actions tab for deployment status
- Ensure all file paths use relative URLs
- Verify Jekyll configuration in `_config.yml`
- Check for any JavaScript/CSS errors in browser console

## Features Included

✅ GitHub Actions workflow for automatic deployment  
✅ Jekyll configuration for GitHub Pages  
✅ SEO optimization with meta tags and sitemap  
✅ Mobile-responsive design  
✅ Performance optimized assets  
✅ Professional DevOps theme  

Your portfolio is now ready for GitHub Pages! 🚀
