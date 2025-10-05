# Portfolio – Next.js (Frontend) + Drupal 11 (Backend) with Lando

### version 1.0.0

A small **portfolio** project using **Drupal 11** as a headless CMS (via **JSON:API**) and a **Next.js** frontend.

Content types:

- **Page** – Home / About
- **Project** – Portfolio items
- **Article** – Blog posts

Includes a working **Contact** form (Next.js API route → Drupal Contact).

---

## 🧩 Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Lando](https://lando.dev/) (latest)
- [Node.js](https://nodejs.org/) 18+ (recommended 20.x)
- npm
- macOS / Windows / Linux

---

## 🚀 1. Start the Backend (Drupal via Lando)

From the **project root**:

```bash
lando start
lando info
Drupal:      http://portfolio.lndo.site
phpMyAdmin:  http://127.0.0.1:54xxx
lando poweroff && lando start
```

## 2. Start the Frontend (Next.js 14, React, Tailwind CSS)

Install dependencies and start the dev server:

```bash
npm install
npm run dev
http://localhost:3000
```

## 📝 Notes

Drupal content is served through jsonapi/node/{content-type} endpoints.

The Contact form uses a Next.js API route to POST to Drupal’s Contact endpoint.

phpMyAdmin port varies — check via lando info.

![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php&logoColor=white)
![Lando](https://img.shields.io/badge/Lando-Dev%20Tool-blue?logo=lando&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-Framework-000000?logo=next.js&logoColor=white)
