# Remote Micro-Frontend (MFE) — File & Folder Guide

This document describes the **standard layout and configuration** of every **remote** MFE in this monorepo (`apps/auth`, `apps/dashboard`, `apps/task`, `apps/setting`, `apps/user`, `apps/management`, etc.).

It covers **what each file/folder is for**, **how they work together**, and **why they are needed**.

**Out of scope (intentionally excluded):**

- `dist/` — production build output
- `node_modules/` — installed dependencies
- `src/`** — application source code (components, pages, routes, etc.)

---

## Table of Contents

1. [What is a remote MFE?](#what-is-a-remote-mfe)
2. [Standard folder structure](#standard-folder-structure)
3. [How remotes fit in the architecture](#how-remotes-fit-in-the-architecture)
4. [File reference](#file-reference)
5. [Generated & cache artifacts](#generated--cache-artifacts)
6. [The `src/` folder (overview only)](#the-src-folder-overview-only)
7. [Port allocation](#port-allocation)
8. [Build & dev lifecycle](#build--dev-lifecycle)
9. [Remote vs shell (host)](#remote-vs-shell-host)
10. [Checklist for a new remote MFE](#checklist-for-a-new-remote-mfe)

---

## What is a remote MFE?

A **remote** is a standalone Vite + React app that:

1. Runs on its **own port** during development/preview.
2. **Exposes** one or more modules via **Module Federation** (typically `./App`).
3. Is **lazy-loaded by the shell** (`apps/shell`) at runtime through `remoteEntry.js`.

The shell does not bundle remote UI into its own build — it fetches remotes from their URLs when needed.

```
┌─────────────────────────────────────────────────────────────┐
│  apps/shell (host, port 3000)                               │
│  vite.config.ts → remotes: {task: 'http://localhost:3003/…'}│
└───────────────────────────┬─────────────────────────────────┘
                            │ loads at runtime
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   apps/auth           apps/dashboard        apps/task
   :3001               :3002                 :3003
   remoteEntry.js      remoteEntry.js        remoteEntry.js
```

---

## Standard folder structure

Every remote MFE under `apps/<name>/` follows this layout:

```
apps/<name>/
├── package.json              # Workspace package definition & scripts
├── vite.config.ts            # Vite + Module Federation (remote) config
├── index.html                # HTML entry for Vite
├── tailwind.config.js        # Tailwind CSS (extends shared config)
├── postcss.config.js         # PostCSS (Tailwind + Autoprefixer)
├── tsconfig.json             # TypeScript project root (references)
├── tsconfig.app.json         # TS config for application source
├── tsconfig.node.json        # TS config for vite.config.ts
├── tsconfig.app.tsbuildinfo  # (generated) incremental compile cache
├── tsconfig.node.tsbuildinfo # (generated) incremental compile cache
├── public/                   # (optional) static assets served as-is
└── src/                      # Application source — see overview section
```

**Not documented here:** `dist/`, `node_modules/`, and files inside `src/`.

---

## How remotes fit in the architecture


| Layer         | Location                                          | Responsibility                                     |
| ------------- | ------------------------------------------------- | -------------------------------------------------- |
| Monorepo root | `monorepo/package.json`, `turbo.json`             | Orchestrate `build`, `dev`, `lint` across all apps |
| Workspace     | `pnpm-workspace.yaml`                             | Registers `apps/`* as pnpm packages                |
| Host          | `apps/shell`                                      | Router, layout, auth guards, loads remotes         |
| Remote        | `apps/<name>`                                     | Feature-specific UI exposed via federation         |
| Shared libs   | `packages/ui`, `packages/store`, `packages/hooks` | Reused across host and remotes                     |


Remotes import shared packages with `workspace:*` in `package.json`. Module Federation marks some of those (`react`, `@repo/store`, etc.) as **singletons** so only one copy runs in the browser.

---

## File reference

### `package.json`

**Purpose:** Defines the app as a pnpm workspace package and declares scripts and dependencies.

**Why needed:** Turbo and pnpm discover the app through this file. Without it, `pnpm --filter task build` and root-level `pnpm build` would not include the app.

**Typical structure:**


| Section          | Role                                                           |
| ---------------- | -------------------------------------------------------------- |
| `name`           | Package name; must match federation `name` in `vite.config.ts` |
| `private: true`  | Prevents accidental publish to npm                             |
| `type: "module"` | ESM — aligns with Vite and `"module"` TS settings              |
| `scripts`        | Commands Turbo runs (`dev`, `build`, `preview`, `lint`)        |


**Standard scripts:**

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```


| Script    | What it does                                                           |
| --------- | ---------------------------------------------------------------------- |
| `dev`     | Starts Vite dev server on the app port                                 |
| `build`   | Type-checks (`tsc -b`), then production-bundles to `dist/`             |
| `preview` | Serves the `dist/` build locally (used when shell loads built remotes) |
| `lint`    | ESLint over the app                                                    |


**Common dependencies (remotes):**


| Package              | Why                                                            |
| -------------------- | -------------------------------------------------------------- |
| `react`, `react-dom` | UI runtime; shared as federation singletons                    |
| `@repo/ui`           | Shared components, styles, design tokens                       |
| `@repo/store`        | Shared Zustand auth/RBAC store                                 |
| `@repo/hooks`        | Shared React hooks (`useAuth`, `usePermission`, etc.)          |
| `react-router-dom`   | Nested routing inside the remote (shell owns top-level router) |
| `zustand`            | State management; shared singleton with store                  |
| `lucide-react`       | Icons (optional but used in most remotes)                      |


**Common devDependencies:**


| Package                                  | Why                        |
| ---------------------------------------- | -------------------------- |
| `vite`, `@vitejs/plugin-react`           | Build tool and React HMR   |
| `@originjs/vite-plugin-federation`       | Module Federation for Vite |
| `typescript`                             | Type checking              |
| `@repo/typescript-config`                | Shared TS base configs     |
| `@repo/tailwind-config`                  | Shared Tailwind theme      |
| `tailwindcss`, `postcss`, `autoprefixer` | CSS pipeline               |


---

### `vite.config.ts`

**Purpose:** Central build and dev configuration. For remotes, this is where **Module Federation** is configured.

**Why needed:** Without federation settings, the app would be a normal SPA — the shell could not `import('task/App')` at runtime.

**Key sections for remotes:**

#### `base`

```ts
base: 'http://localhost:3003/',
```


| Aspect         | Explanation                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **What**       | Absolute public URL prefix for assets in production/preview                                                                            |
| **Why**        | When the shell (port 3000) loads chunks from the task remote (port 3003), asset paths must resolve to the remote origin, not the shell |
| **Must match** | The app's dev/preview port and host URL registered in `apps/shell/vite.config.ts`                                                      |


#### `federation` plugin — remote block

```ts
federation({
  name: 'task',
  filename: 'remoteEntry.js',
  exposes: {
    './App': './src/App.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^19.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^19.2.0' },
    'react-router-dom': { singleton: true },
    zustand: { singleton: true },
    '@repo/store': { singleton: true },
  },
})
```


| Option     | Purpose                                                |
| ---------- | ------------------------------------------------------ |
| `name`     | Federation scope; shell imports as `task/App`          |
| `filename` | Entry file the host fetches (`/assets/remoteEntry.js`) |
| `exposes`  | Maps public paths to source files the host can import  |
| `shared`   | Libraries loaded once across host + all remotes        |


**Singleton shared deps:** Prevents duplicate React or store instances, which would break hooks and global auth state.

#### `resolve.alias`

```ts
alias: {
  '@': path.resolve(__dirname, '../../packages/ui/src'),
}
```

Maps `@/` imports to the shared UI package — consistent with shadcn-style paths.

#### `build` (remote-specific)

```ts
build: {
  target: 'esnext',
  minify: false,
  cssCodeSplit: false,
}
```


| Option                | Why for remotes                                         |
| --------------------- | ------------------------------------------------------- |
| `target: 'esnext'`    | Modern output for federation chunk loading              |
| `minify: false`       | Avoids federation chunk issues during dev/debug         |
| `cssCodeSplit: false` | Single CSS bundle — simpler for federated style loading |


#### `server` / `preview`

```ts
server: {
  port: 3003,
  strictPort: true,
  cors: true,
},
preview: {
  port: 3003,
  strictPort: true,
  cors: true,
},
```


| Option             | Why                                                                            |
| ------------------ | ------------------------------------------------------------------------------ |
| `port`             | Unique per remote — see [port table](#port-allocation)                         |
| `strictPort: true` | Fail if port is taken (avoids silent port drift breaking shell remotes config) |
| `cors: true`       | Shell on `:3000` must fetch assets from `:3003` cross-origin                   |


---

### `index.html`

**Purpose:** Vite's HTML entry point.

**Why needed:** Vite injects the JS bundle and mounts React into `#root`.

**Typical content:**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>task</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```


| Element         | Role                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| `#root`         | DOM mount point for React                                                  |
| `/src/main.tsx` | Application bootstrap (standalone dev only; federation uses exposed `App`) |
| `<title>`       | Browser tab title when running the remote standalone                       |


**Standalone vs federated:** When loaded through the shell, the shell renders the exposed `App` component directly. `index.html` is still required for `pnpm dev` and `vite preview` when testing the remote alone.

---

### `tailwind.config.js`

**Purpose:** Tailwind CSS configuration for this app.

**Why needed:** Processes utility classes in the remote's templates and ensures classes from shared UI components are not purged.

```js
const sharedConfig = require("@repo/tailwind-config");

module.exports = {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
```


| Part                    | Role                                                                           |
| ----------------------- | ------------------------------------------------------------------------------ |
| `...sharedConfig`       | Inherits theme tokens (colors, radius) from `@repo/tailwind-config`            |
| `content`               | Files Tailwind scans for class names                                           |
| `../../packages/ui/...` | **Critical** — includes shared component classes so production CSS is complete |


---

### `postcss.config.js`

**Purpose:** CSS post-processing pipeline for Vite.

**Why needed:** Tailwind must run through PostCSS to generate utility CSS.

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```


| Plugin         | Role                                                    |
| -------------- | ------------------------------------------------------- |
| `tailwindcss`  | Generates utility classes from `@apply` and class names |
| `autoprefixer` | Adds vendor prefixes for browser compatibility          |


---

### `tsconfig.json`

**Purpose:** TypeScript **solution-style** root config. Does not compile files directly.

**Why needed:** Splits app source typing from Node tooling (Vite config) using project references — faster, cleaner `tsc -b` builds.

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Running `tsc -b` from the app root type-checks **both** referenced projects in dependency order.

---

### `tsconfig.app.json`

**Purpose:** TypeScript settings for **browser application code** (`src/`).

**Why needed:** Enforces strict typing for React components, hooks, and federation-exposed modules before Vite bundles them.


| Key option         | Value                                        | Meaning                                     |
| ------------------ | -------------------------------------------- | ------------------------------------------- |
| `extends`          | `@repo/typescript-config/react-library.json` | Shared base + JSX settings                  |
| `jsx`              | `react-jsx`                                  | React 17+ JSX transform (no `import React`) |
| `moduleResolution` | `bundler`                                    | Matches Vite's resolver                     |
| `noEmit`           | `true`                                       | Type-check only; Vite emits JS              |
| `strict`           | `true`                                       | Full strict mode                            |
| `include`          | `["src"]`                                    | Only application source                     |


---

### `tsconfig.node.json`

**Purpose:** TypeScript settings for **Node-side** files — currently `vite.config.ts`.

**Why needed:** Vite config uses Node APIs (`path`, `__dirname`) and different libs than browser code. A separate config avoids pulling DOM types into config files or `node:` types into React components.


| Key option                    | Meaning                       |
| ----------------------------- | ----------------------------- |
| `lib: ["ES2023"]`             | No DOM — Node/tooling context |
| `include: ["vite.config.ts"]` | Only the Vite config file     |


---

## Generated & cache artifacts

These files appear after builds or type-checks. They are **not hand-edited**.


| File / folder               | Created by     | Purpose                                       |
| --------------------------- | -------------- | --------------------------------------------- |
| `tsconfig.app.tsbuildinfo`  | `tsc -b`       | Incremental compile cache for app project     |
| `tsconfig.node.tsbuildinfo` | `tsc -b`       | Incremental compile cache for node project    |
| `dist/`                     | `vite build`   | Production bundles, `remoteEntry.js`, assets  |
| `node_modules/`             | `pnpm install` | Resolved dependencies (symlinks in workspace) |
| `.turbo/` (repo root)       | `turbo run`    | Turborepo task cache metadata                 |


The monorepo `.gitignore` excludes `dist`, `node_modules`, and `.turbo`. `*.tsbuildinfo` may appear in git status depending on local setup — they are safe to ignore or gitignore if they clutter commits.

---

## The `src/` folder (overview only)

Each remote has a `src/` directory. This guide does **not** document individual files inside it, but the folder has a **fixed role** in the architecture:


| Responsibility    | Typical entry                                             |
| ----------------- | --------------------------------------------------------- |
| Bootstrap         | `main.tsx` — mounts React for standalone `pnpm dev`       |
| Federation expose | `App.tsx` — the module listed in `exposes['./App']`       |
| Feature code      | `pages/`, `components/`, `data/`, etc.                    |
| Global styles     | `index.css` — imports `@repo/ui/styles`                   |
| Vite types        | `vite-env.d.ts` — `/// <reference types="vite/client" />` |


**Federation rule:** Whatever path you list under `exposes` in `vite.config.ts` must exist under `src/` (e.g. `./App` → `src/App.tsx`).

**Routing rule:** Remotes use `<Routes>` with **relative** paths; the shell mounts them at `/tasks/`*, `/users/*`, etc.

---

## Port allocation

Each remote must use a **unique port**. The shell references these URLs in `remotes`.


| App          | Package name | Port | `base` URL               |
| ------------ | ------------ | ---- | ------------------------ |
| shell (host) | `shell`      | 3000 | *(none — default)*       |
| auth         | `auth`       | 3001 | `http://localhost:3001/` |
| dashboard    | `dashboard`  | 3002 | `http://localhost:3002/` |
| task         | `task`       | 3003 | `http://localhost:3003/` |
| setting      | `setting`    | 3004 | `http://localhost:3004/` |
| user         | `user`       | 3005 | `http://localhost:3005/` |
| management   | `management` | 3006 | `http://localhost:3006/` |


When adding a new remote, pick the next free port (e.g. `3007`) and update **both** the remote's `vite.config.ts` and `apps/shell/vite.config.ts` `remotes` block.

---

## Build & dev lifecycle

### How config files interact during `pnpm build`

```
package.json  ("build": "tsc -b && vite build")
       │
       ├─► tsconfig.json
       │        ├─► tsconfig.app.json  → type-check src/
       │        └─► tsconfig.node.json → type-check vite.config.ts
       │
       └─► vite.config.ts
                ├─► @vitejs/plugin-react
                ├─► @originjs/vite-plugin-federation → remoteEntry.js
                ├─► tailwind.config.js + postcss.config.js → CSS
                └─► index.html → entry graph
                         │
                         ▼
                    dist/  (remoteEntry.js + chunks + CSS)
```

### Turbo orchestration (monorepo root)

From `monorepo/turbo.json`:


| Task      | Remote behavior                                          |
| --------- | -------------------------------------------------------- |
| `build`   | Runs `tsc -b && vite build`; outputs cached as `dist/**` |
| `dev`     | Long-running Vite server; not cached                     |
| `preview` | Serves `dist/`; depends on `build`                       |
| `lint`    | ESLint                                                   |


`dependsOn: ["^build"]` ensures shared `packages/*` build before apps when those packages define a `build` script.

### Typical workflows


| Goal                      | Command                       |
| ------------------------- | ----------------------------- |
| Dev one remote standalone | `pnpm --filter task dev`      |
| Dev shell + one remote    | `pnpm dev:task` (root script) |
| Dev entire monorepo       | `pnpm dev`                    |
| Build one remote          | `pnpm --filter task build`    |
| Build everything          | `pnpm build`                  |


---

## Remote vs shell (host)

Use this table when reading or editing `vite.config.ts`:


| Setting                   | Remote (`apps/task`, etc.)          | Host (`apps/shell`)             |
| ------------------------- | ----------------------------------- | ------------------------------- |
| Federation role           | `exposes` + `filename`              | `remotes` map                   |
| `base` URL                | Required (`http://localhost:PORT/`) | Usually omitted                 |
| `cors`                    | `true` on server/preview            | Not required                    |
| `minify` / `cssCodeSplit` | `false` for federation stability    | Default Vite behavior           |
| Port                      | 3001–3006 (unique)                  | 3000                            |
| Consumes other MFEs       | No                                  | Yes — lazy `import('task/App')` |


---

## Checklist for a new remote MFE

Use when scaffolding manually or after `turbo gen mfe-app`:

- Create `apps/<name>/` with all config files from this guide
- Set unique `port` and `base` in `vite.config.ts`
- Set `federation.name` to match `package.json` `name`
- Configure `exposes` (at minimum `./App` → `./src/App.tsx`)
- Add shared deps (`react`, `@repo/store`, etc.) as federation singletons
- Register remote in `apps/shell/vite.config.ts` → `remotes`
- Add `declare module '<name>/App'` in shell `vite-env.d.ts`
- Add route + lazy import in shell `App.tsx`
- Run `pnpm install` from monorepo root
- Verify `pnpm --filter <name> build` succeeds

**Scaffold shortcut:** `pnpm exec turbo gen mfe-app` — see `[turbo/README.md](../turbo/README.md)`.

---

## Related documentation


| Document                                        | Topic                                      |
| ----------------------------------------------- | ------------------------------------------ |
| `[turbo/README.md](../turbo/README.md)`         | Turbo generators and scaffolding templates |
| `[turbo.json](../turbo.json)`                   | Monorepo task pipeline (build, dev, lint)  |
| `[pnpm-workspace.yaml](../pnpm-workspace.yaml)` | Workspace package globs                    |


---

## Quick reference — files at a glance


| File                 | One-line summary                                 |
| -------------------- | ------------------------------------------------ |
| `package.json`       | Package identity, scripts, dependencies          |
| `vite.config.ts`     | Vite, Module Federation remote, port, `base` URL |
| `index.html`         | HTML shell for Vite entry                        |
| `tailwind.config.js` | Tailwind content paths + shared theme            |
| `postcss.config.js`  | Tailwind + Autoprefixer pipeline                 |
| `tsconfig.json`      | TS project references root                       |
| `tsconfig.app.json`  | Strict typing for `src/`                         |
| `tsconfig.node.json` | Typing for `vite.config.ts`                      |
| `src/`               | Application code (not detailed in this doc)      |
| `public/`            | Static assets (optional)                         |


