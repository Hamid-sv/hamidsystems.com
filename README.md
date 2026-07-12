# Hamid Samadi Portfolio

Personal technical portfolio for Hamid Samadi.

Live site: [hamidsystems.com](https://hamidsystems.com)

## Overview

This repository contains a static technical portfolio built with plain HTML, CSS, JavaScript, and a lightweight Three.js hero scene, then published with GitHub Pages on a custom domain.

The site includes:

- A homepage introducing Hamid's technical focus and selected work
- A projects page covering cloud, systems, security, automation, and web builds
- A skills section for technologies and platforms
- About and contact pages for professional networking

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
- `services/`, `case-studies/`, `free-audit/` - compatibility redirects for older links
- `portfolio/` - technical projects and selected work
- `about/` - background and approach
- `contact/` - contact links and business CTA
- `projects.html`, `about.html`, `contact.html` - redirects for old URLs
- `styles.css` - shared site styles
- `script.js` - theme, navigation, scroll-driven hero motion, and copy actions
- `assets/` - visual assets
- `CNAME` - custom domain configuration
