# NotaVault Website

Professional Remote Online Notarization landing page and digital business card.

## Files

- `index.html` - Main landing page with features, about section, and contact form
- `business-card.html` - Professional digital business card (printable/PDF-saveable)

## Features

- **Modern, Responsive Design** - Works on desktop, tablet, and mobile
- **Lead Generation Form** - Capture inquiries directly on the site
- **Professional Branding** - NotaVault trade name with Ironbridge Strategy Group attribution
- **BlueNotary Integration** - Clear branding of the RON platform
- **Business Card** - Print-ready or save as PDF

## Deployment to Netlify

### Option 1: Connect GitHub (Recommended)

1. Push this folder to a GitHub repository
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub account and select the repository
5. Keep default settings and deploy

### Option 2: Manual Drag & Drop

1. Go to [Netlify](https://app.netlify.com)
2. Drag and drop the `notavault-site` folder onto Netlify
3. Your site will be live instantly at a Netlify URL

### Option 3: Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=/Users/shamoncarter-williams/notavault-site
```

## Custom Domain Setup

Once deployed to Netlify:

1. In Netlify dashboard, go to "Domain settings"
2. Add custom domain: `notavault.net`
3. Follow DNS setup instructions (point your domain registrar to Netlify)
4. Enable auto HTTPS certificate

## Form Handling

Currently, the contact form shows a basic alert. To make it functional:

- **Option 1:** Use Netlify Forms (add `netlify` attribute to `<form>`)
- **Option 2:** Use third-party service like Formspree, Basin, or similar
- **Option 3:** Set up serverless function to handle submissions

## Local Development

View locally:

```bash
cd /Users/shamoncarter-williams/notavault-site
python3 -m http.server 3000
# Visit http://localhost:3000
```

## Content to Customize

- Email: `kw@notavaultllc.com` (update throughout if needed)
- Phone: Consider adding phone number to header/footer
- Service areas: Currently says "Ohio" with multi-state capability
- Additional pages: Consider adding FAQ, pricing, or detailed service pages

## Next Steps

1. Deploy to Netlify
2. Point `notavault.net` domain to Netlify
3. Set up form handling (recommended: Netlify Forms)
4. Add Google Analytics or similar tracking
5. Test contact form functionality
6. Prepare to share with title companies and prospects

---

**Site Owner:** Kenyatta S. Williams  
**Business:** NotaVault (trade name of Ironbridge Strategy Group, LLC)  
**Certification:** Form 534A filed with Ohio Secretary of State (Aug 17, 2026)
