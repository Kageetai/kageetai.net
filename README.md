# kageetai.net-astro

Personal blog and digital garden built with Astro. Features technical articles, project showcases, and game documentation.

## Features

- **Interactive particle background** - Canvas-based animation that persists across page navigations
- **Content collections** - Organized content for Blog posts, Projects, and Games
- **View transitions** - Smooth page transitions using Astro's built-in support
- **Glass-morphic design** - Modern frosted glass aesthetic
- **YouTube embeds** - Lightweight YouTube video embedding in markdown

## Tech Stack

- [Astro](https://astro.build) - Static site generator
- TypeScript

## Project Structure

```text
/
├── public/
├── src/
│   ├── content/      # Blog posts, projects, games (markdown)
│   ├── layouts/      # BaseLayout, Article, ParticleBackground
│   ├── pages/        # Route pages
│   └── styles/       # Global styles
└── package.json
```

## Commands

| Command          | Action                                           |
| :--------------- | :----------------------------------------------- |
| `pnpm install`   | Installs dependencies                            |
| `pnpm dev`       | Starts local dev server at `localhost:4321`      |
| `pnpm build`     | Build your production site to `./dist/`          |
| `pnpm preview`   | Preview your build locally, before deploying     |
| `pnpm astro ...` | Run CLI commands like `astro add`, `astro check` |
