# 🛒 Shop List

A modern shopping list application built with **React**, **Vite**, **TailwindCSS**, and **Material-UI**, with PWA support for offline usage.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker&logoColor=white)](https://www.docker.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5a0fc8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

https://allanjuliani.github.io/shop-list/

---

## ✨ Features

- ✅ Add and remove items from the list
- 📝 Mark items as purchased
- 📊 Shopping history
- 💾 Local storage (localStorage)
- 📱 PWA - Works offline
- 🎨 Modern and responsive interface
- 🌙 Clean design with Material-UI

---

## 🚀 Technologies

- **React 19** - JavaScript library for UI
- **TypeScript** - Static typing
- **Vite** - Ultra-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Material-UI** - React components
- **Radix UI** - Accessible components
- **PWA** - Progressive Web App
- **Docker** - Containerization
- **Nginx** - Production web server

---

## 🛠️ How to Run

### Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```

Access: http://localhost:3000

### 🐳 With Docker

#### Production Mode
```bash
# Build and start container
docker-compose up -d

# Rebuild after changes
docker-compose up -d --build

# Stop containers
docker-compose down
```

Access: http://localhost:8080

### 📦 Production Build

```bash
# Local build
npm run build

# Build for GitHub Pages
npm run build:gh-pages

# Preview build
npm run preview
```

---

## 🚢 Deploy

### GitHub Pages

```bash
npm run deploy
```

The command above builds with the correct base path and publishes to GitHub Pages.

### Docker Production

The application uses multi-stage build:
- **Stage 1**: Build the application with Node.js
- **Stage 2**: Serve static files with Nginx

---

## 📁 Project Structure

```
shop-list/
├── src/
│   ├── app/
│   │   ├── components/     # Application components
│   │   ├── data/          # Static data
│   │   └── hooks/         # Custom hooks
│   ├── styles/            # Global styles
│   └── main.tsx           # Entry point
├── public/                # Public files
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker orchestration
├── nginx.conf            # Nginx configuration
└── vite.config.ts        # Vite configuration
```

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build (Docker)
- `npm run build:gh-pages` - Build for GitHub Pages
- `npm run preview` - Preview local build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Check code with ESLint
- `npm run lint:fix` - Automatically fix issues
- `npm run format` - Format code with Prettier

---

## 📝 License

This project is under the MIT license.

---

## 👨‍💻 Developed by

Allan - [GitHub](https://github.com/seu-usuario)
