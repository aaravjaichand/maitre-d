# maitre-d

**The open-source, AI-powered restaurant reservation agent.**

maitre-d is a command-line tool that helps you get reservations at the hardest-to-book restaurants. It monitors reservation platforms for open slots, snipes new reservation drops the moment they go live, and watches for last-minute cancellations — all on your behalf, using your own accounts.

> **Status:** This project is under active development. Star and watch the repo to follow along.

## How It Works

Instead of editing config files and looking up venue IDs, you just tell maitre-d what you want in plain English:

```
maitre-d find "trendy Italian spot in the West Village, Saturday night for 2, around 8pm"
```

It figures out the rest — searching across platforms, ranking results by how well they match your taste, and booking the best option the instant it becomes available.

## Features

- **Reservation Drop Sniping** — Books the instant reservations go live with millisecond precision
- **Cancellation Monitoring** — Continuously watches for cancelled slots and grabs them automatically
- **AI-Powered Search** — Describe what you want in natural language instead of configuring manually
- **Multi-Platform** — Works across Resy and OpenTable from a single tool
- **Preference Learning** — Learns your taste over time and makes smarter recommendations
- **Smart Scheduling** — Tracks restaurant drop schedules and manages snipes automatically
- **Calendar Integration** — Checks your availability and creates booking events automatically
- **Flexible Notifications** — Get notified via Discord, Telegram, SMS, email, or webhooks

## Supported Platforms

| Platform | Search | Monitor | Book |
|----------|--------|---------|------|
| Resy     | Planned | Planned | Planned |
| OpenTable| Planned | Planned | Planned |

## Installation

> Coming soon. maitre-d will be distributed as an npm package.

```bash
npm install -g maitre-d
```

## Usage

```bash
# Search for restaurants
maitre-d find "romantic dinner in SoHo, Friday night for 2"

# Watch for cancellations
maitre-d watch "Carbone, any Saturday in March, party of 4"

# Snipe a reservation drop
maitre-d snipe --restaurant "Restaurant Name" --date 2025-03-15 --time 19:30 --party 2

# View active watches and upcoming reservations
maitre-d list

# Interactive AI chat
maitre-d chat
```

## AI & LLM Support

maitre-d works with multiple LLM providers — choose based on your preferences, budget, and privacy needs:

- **OpenAI** — GPT-4o and other models
- **Anthropic** — Claude Sonnet, Haiku
- **Google** — Gemini models
- **Ollama** — Run open-source models locally for complete privacy
- **Any OpenAI-compatible API** — Groq, Together AI, OpenRouter, LM Studio, etc.

AI features are optional. maitre-d works without them for manual configuration.

## Privacy & Security

- Runs entirely on your machine — no cloud accounts or servers required
- No telemetry, analytics, or data collection
- Credentials stored locally and encrypted
- Open source so you can verify every line of code
- Ollama option keeps all AI processing local

## Legal

maitre-d is a **personal-use automation tool**. It books reservations using your own account, for your own use — functionally equivalent to manually clicking "book" on the app.

- It is **not** a marketplace, scalping service, or resale platform
- It does **not** create fake accounts or use fraudulent information
- It implements sensible rate limiting and respectful API usage
- Users should review the terms of service of any platform they connect

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Areas where help is especially appreciated:
- New platform integrations
- Calendar provider support
- Notification channels
- LLM provider integrations
- Bug fixes and improvements

## License

[MIT](LICENSE)

---

*maitre-d is not affiliated with Resy, OpenTable, American Express, or any restaurant or reservation platform.*
