# Hamid Samadi Portfolio

Personal technical portfolio for Hamid Samadi, focused on technical customer success and support: SaaS and application support, customer issue ownership, Freshworks, Shopify, CRM, and the systems and networking troubleshooting behind it.

Live site: [hamidsystems.com](https://hamidsystems.com)

## Technology

- Semantic HTML
- Shared CSS with light and dark themes
- Plain JavaScript
- Lucide icons
- Lightweight image depth effect with reduced-motion support
- GitHub Pages with a custom domain

## Primary Pages

- `/` - homepage, featured work, skills, process, and contact invitation
- `/projects/` - project overview and category filters
- `/projects/linux-vps-support/` - detailed Linux administration and recovery case study
- `/projects/document-email-automation/` - detailed private-project case study
- `/about/` - professional focus, education, background, and working approach
- `/contact/` - email, LinkedIn, GitHub, and location

Older addresses under `/portfolio/`, `/services/`, `/case-studies/`, `/free-audit/`, and root-level `.html` files remain as compatibility redirects.

## Local Preview

From this repository directory:

```powershell
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Content Updates

See `CONTENT_NEEDED.md` for assets or facts that still require Hamid's confirmation. The approved resume is available at `/assets/Hamid-Samadi-Resume.pdf`, and the homepage download links point to that file.

## Deployment

The repository is designed to publish from its root through GitHub Pages. `CNAME` must remain in the root and contain `hamidsystems.com`.
