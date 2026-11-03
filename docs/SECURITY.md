# SECURITY.md — Security & Hardening Rules

## 1. Core Security Directives

This project serves publicly accessible engineering articles. All developers and AI coding agents must follow these security rules:

---

## 2. Content & Markdown Sanitization

* **XSS Prevention:** Markdown and MDX content must be processed through sanitized AST parsers (`rehype-sanitize` or strict MDX remote compilation) to prevent arbitrary `<script>` injection or malicious `onerror` event attributes.
* **External Links:** All user-supplied or external hyperlinks inside markdown articles must automatically compile with:
  ```html
  target="_blank" rel="noopener noreferrer"
  ```
  to prevent tab-nabbing and origin leakage.

---

## 3. Content Security Policy & Headers

* The blog should emit standard security headers via `next.config.ts`:
  * `X-Frame-Options: DENY` (Prevent clickjacking)
  * `X-Content-Type-Options: nosniff` (Prevent MIME sniffing)
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 4. Secrets & Environment Variables

* No secret tokens, private API keys, or database credentials in source code.
* Environment variables must use the `NEXT_PUBLIC_` prefix ONLY if they are intended to be exposed to the client (e.g. `NEXT_PUBLIC_SITE_URL=https://blog.bretmuchoni.dev`).
* Always maintain a `.env.example` file. Never commit `.env` or `.env.local`.

---

## 5. AI Agent Security Guardrails

The coding agent must:
- Never hardcode mock credentials or personal keys.
- Never add unnecessary third-party npm packages without validating bundle impact and vulnerability status.
- Never weaken CSP headers or bypass input validation.
