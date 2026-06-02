# Hamid Systems Portfolio Site

This is a static portfolio site for `hamidsystems.com`. It has no build step.

## Files

- `index.html` - main page content
- `styles.css` - layout, colors, responsive behavior
- `script.js` - theme toggle, copy-email behavior, icons
- `assets/hero-workspace.png` - generated hero image
- `CNAME` - GitHub Pages custom-domain file
- `DOMAIN_FIX.md` - DNS recovery and deployment checklist

## Quick Local Preview

Open `index.html` in a browser, or run a tiny local server from this folder:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Edit Checklist

- Replace `hello@hamidsystems.com` in `index.html` and `script.js` if your domain email is not active.
- Replace the three project cards with your real projects and links.
- Add a `resume.pdf` link if you want a resume button.
- Upload the whole folder to your static host.
