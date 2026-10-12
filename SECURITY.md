# Security policy

## Reporting a vulnerability

If you find a security issue on [christendijoux.com](https://christendijoux.com) or in this repository, please report it privately:

- **Email:** christen.dijoux@gmail.com
- **Machine-readable contact:** [`/.well-known/security.txt`](https://christendijoux.com/.well-known/security.txt)

Please include the affected URL or file, steps to reproduce, and the impact you observed.
Do not open a public issue and do not disclose the problem publicly before it is fixed.
I aim to reply within 48 hours. This is a personal site: there is no bug bounty.

## Scope

- The static site (React SPA served by Apache behind Cloudflare).
- The leaderboard API (`public/api/leaderboard.php`).

Out of scope: denial of service, automated scanner reports without a demonstrated impact, and third-party services (Cloudflare, Google Analytics, Sentry, EmailJS).

## What is already in place

- HTTPS only, HSTS (1 year, preload), Content-Security-Policy, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy` headers (`public/.htaccess`).
- Analytics and error tracking load only after explicit consent.
- No secrets in the repository: environment files are git-ignored; the leaderboard's signing key and data live outside the web root.
- Leaderboard hardening: HMAC-signed single-use game tokens, minimum real play time, score cap, per-IP rate limiting (real client IP resolved only from verified Cloudflare ranges), input validation and file locking — no database.
- Production dependencies are audited with `npm audit`.
