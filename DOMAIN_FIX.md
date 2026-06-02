# Domain Fix Notes for hamidsystems.com

Checked on 2026-06-02.

## What Is Broken

Public DNS still points `www.hamidsystems.com` at old Google Sites:

```text
www.hamidsystems.com CNAME ghs.googlehosted.com
```

That host currently redirects to a Google login page. The root domain also has no normal public `A` or `AAAA` website record, so `https://hamidsystems.com` does not resolve cleanly.

The public registrar record shows:

```text
Registrar: Squarespace Domains II LLC
Nameservers:
  ns-cloud-c1.googledomains.com
  ns-cloud-c2.googledomains.com
  ns-cloud-c3.googledomains.com
  ns-cloud-c4.googledomains.com
Expiration: 2026-12-29
```

## Fastest Low-Cost Hosting Plan

Use GitHub Pages for the static portfolio.

1. Create a GitHub repo, for example `hamidsystems.com`.
2. Upload every file in this folder to the repo root.
3. In GitHub, open the repo, then go to `Settings` > `Pages`.
4. Set the publishing source to the main branch root.
5. Set the custom domain to:

```text
hamidsystems.com
```

6. Wait for GitHub to validate the domain, then enable `Enforce HTTPS`.

## DNS Records to Change

In Squarespace Domains, open the DNS settings for `hamidsystems.com`.

Remove this old record:

```text
www  CNAME  ghs.googlehosted.com
```

Add these records for GitHub Pages:

```text
@    A      185.199.108.153
@    A      185.199.109.153
@    A      185.199.110.153
@    A      185.199.111.153
www  CNAME  YOUR-GITHUB-USERNAME.github.io
```

Optional IPv6 records:

```text
@    AAAA   2606:50c0:8000::153
@    AAAA   2606:50c0:8001::153
@    AAAA   2606:50c0:8002::153
@    AAAA   2606:50c0:8003::153
```

Replace `YOUR-GITHUB-USERNAME.github.io` with your actual GitHub Pages default domain. Do not include the repository name in the CNAME value.

Keep the existing MX/SPF records only if you still use Google Workspace email. If the Workspace subscription is cancelled, domain email may need separate setup.

## Verification Commands

After DNS propagation, these should return the GitHub Pages values:

```powershell
Resolve-DnsName hamidsystems.com -Type A
Resolve-DnsName www.hamidsystems.com -Type CNAME
curl.exe -I https://hamidsystems.com
curl.exe -I https://www.hamidsystems.com
```

DNS updates can take minutes, but sometimes take up to 24 hours.
