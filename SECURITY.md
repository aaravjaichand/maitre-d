# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in maitre-d, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email: **security@maitre-d.dev** (or open a private security advisory via GitHub's "Report a vulnerability" feature on the Security tab).

Include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 1 week
- **Fix and disclosure:** Coordinated with reporter

## Scope

Security issues we care about:
- Credential leakage or exposure
- Authentication bypass
- Injection vulnerabilities (command injection, etc.)
- Data exfiltration
- Dependency vulnerabilities with exploitable impact

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Credential Handling

maitre-d handles sensitive credentials (reservation platform logins, API keys, calendar tokens). All credential-related code should:

- Store credentials encrypted at rest
- Never log credentials or tokens
- Never send credentials to LLM providers
- Never include credentials in error reports or telemetry
