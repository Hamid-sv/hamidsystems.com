# Hamid Systems

Business website for Hamid Systems / Samadi Systems.

Live site: [hamidsystems.com](https://hamidsystems.com)

## Overview

This repository contains the static front end for a local business automation site. It is built with plain HTML, CSS, JavaScript, and a lightweight Three.js hero scene, then published with GitHub Pages on a custom domain.

The site includes:

- A homepage for lead recovery automation
- A services page for lead capture, intake, booking, follow up, reviews, and dashboards
- A case studies page for pilot/demo systems
- A free audit page with an email-backed request form
- A portfolio page for technical proof
- About and contact pages

## Tech Stack

- HTML
- CSS
- JavaScript
- Three.js
- GitHub Pages

## Local Preview

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Structure

- `index.html` - homepage
- `services/` - services page
- `case-studies/` - case studies page
- `free-audit/` - free audit page and form UI
- `portfolio/` - technical proof and selected work
- `about/` - background and approach
- `contact/` - contact links and business CTA
- `projects.html`, `about.html`, `contact.html` - redirects for old URLs
- `styles.css` - shared site styles
- `script.js` - theme, navigation, scroll-driven hero motion, copy actions, and audit form mailto fallback
- `assets/` - visual assets
- `CNAME` - custom domain configuration
