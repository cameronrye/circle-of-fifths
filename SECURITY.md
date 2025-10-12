# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of the Circle of Fifths project seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until it has been addressed

### How to Report

Please report security vulnerabilities by emailing:

**Email:** [Create a private security advisory on GitHub](https://github.com/cameronrye/circle-of-fifths/security/advisories/new)

Or contact the maintainer directly through GitHub.

### What to Include

Please include the following information in your report:

- **Type of vulnerability** (e.g., XSS, CSRF, injection, etc.)
- **Full paths of source file(s)** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** and how an attacker might exploit it
- **Any potential mitigations** you've identified

### What to Expect

- **Acknowledgment:** We will acknowledge receipt of your vulnerability report within 48 hours
- **Updates:** We will send you regular updates about our progress
- **Timeline:** We aim to address critical vulnerabilities within 7 days
- **Credit:** We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices for Users

### Content Security Policy

This application implements a Content Security Policy (CSP) to prevent XSS attacks. The CSP is defined in `index.html`:

```html
<meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; img-src 'self' data:; 
               font-src 'self' data:; connect-src 'self'; 
               media-src 'self'; object-src 'none'; 
               frame-src 'none'; base-uri 'self'; 
               form-action 'self';"
/>
```

### Running Locally

When running the application locally:

1. **Use a local web server** - Don't open `index.html` directly in the browser
2. **Keep dependencies updated** - Run `npm audit` regularly
3. **Review permissions** - The app only requires audio permissions

### Deployment

When deploying:

1. **Use HTTPS** - Always serve over HTTPS in production
2. **Enable HSTS** - Configure HTTP Strict Transport Security
3. **Review CSP** - Ensure Content Security Policy is not weakened
4. **Audit dependencies** - Run `npm audit` before deployment

## Known Security Considerations

### Web Audio API

This application uses the Web Audio API which:

- Requires user interaction before audio can play (browser security feature)
- Does not access microphone or external audio sources
- Only synthesizes audio locally in the browser

### Service Worker

The service worker (`sw.js`):

- Only caches static assets from the same origin
- Does not intercept or modify external requests
- Implements cache versioning to prevent stale content

### No External Dependencies at Runtime

The application:

- Has zero runtime dependencies on external CDNs
- All assets are served from the same origin
- No tracking or analytics scripts
- No third-party API calls

## Security Updates

Security updates will be:

- Released as patch versions (e.g., 1.1.1)
- Documented in CHANGELOG.md with a **SECURITY** tag
- Announced in GitHub Security Advisories
- Applied to all supported versions when possible

## Vulnerability Disclosure Policy

We follow a **coordinated disclosure** policy:

1. **Report received** - Vulnerability reported privately
2. **Validation** - We validate and assess the vulnerability (1-3 days)
3. **Fix development** - We develop and test a fix (3-7 days)
4. **Release** - We release a patched version
5. **Public disclosure** - We publish a security advisory 7 days after the fix is released

## Security Checklist for Contributors

If you're contributing code, please ensure:

- [ ] No hardcoded secrets, API keys, or credentials
- [ ] Input validation for all user inputs
- [ ] Output encoding to prevent XSS
- [ ] No use of `eval()` or `Function()` constructor
- [ ] No `innerHTML` without sanitization (use `textContent` or DOM methods)
- [ ] Dependencies are up-to-date and audited
- [ ] No introduction of new external dependencies without discussion
- [ ] CSP compatibility maintained

## Automated Security Scanning

This project uses:

- **npm audit** - Dependency vulnerability scanning (runs in CI/CD)
- **ESLint** - Static code analysis with security rules
- **GitHub Dependabot** - Automated dependency updates
- **GitHub Security Advisories** - Vulnerability tracking

## Contact

For security concerns that don't require immediate attention, you can also:

- Open a discussion in [GitHub Discussions](https://github.com/cameronrye/circle-of-fifths/discussions)
- Contact the maintainer through GitHub

## Attribution

We appreciate the security research community and will acknowledge researchers who report valid vulnerabilities (with their permission).

---

**Last Updated:** October 12, 2025
