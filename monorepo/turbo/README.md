# Turbo Folder — Complete Guide

This document explains everything inside the `monorepo/turbo/` folder: what each file does, how the code generation system works, and how it connects to the rest of the monorepo.

---

## Table of Contents

1. [What is this folder?](#what-is-this-folder)
2. [Folder structure](#folder-structure)
3. [How Turbo fits in the monorepo](#how-turbo-fits-in-the-monorepo)
4. [The generator system (`generators/`)](#the-generator-system-generators)
5. [Generator config (`generators/config.ts`)](#generator-config-generatorsconfigts)
6. [MFE app templates (`generators/templates/mfe-app/`)](#mfe-app-templates-generatorstemplatesmfe-app)
7. [How to run the generator](#how-to-run-the-generator)
8. [What gets created after scaffolding](#what-gets-created-after-scaffolding)
9. [Manual steps after generating a new MFE](#manual-steps-after-generating-a-new-mfe)
10. [Relationship to `turbo.json](#relationship-to-turbojson)`
11. [Troubleshooting & known gaps](#troubleshooting--known-gaps)

---

## What is this folder?

The `turbo/` folder is **not** where Turborepo stores its cache or runs builds. It is the home of **Turbo Generators** — a scaffolding system powered by `[@turbo/gen](https://turborepo.dev/docs/guides/generating-code)` (built on [Plop.js](https://plopjs.com/)).


| Concern                              | Location                                        |
| ------------------------------------ | ----------------------------------------------- |
| Task pipeline (build, dev, lint)     | `monorepo/turbo.json` (repo root)               |
| Code scaffolding / new app templates | `monorepo/turbo/generators/` (this folder)      |
| Local build cache artifacts          | `monorepo/.turbo/` (auto-generated, gitignored) |


**Why this folder exists:** Micro-frontend repos need many similar apps (shell host + remote MFEs). Each app shares the same stack — Vite, React, TypeScript, Tailwind, Module Federation, shared `@repo/`* packages. Instead of copy-pasting `apps/task` every time, this generator creates a correctly wired app in one command.

---

## Folder structure

```
turbo/
├── README.md                          ← This documentation file
└── generators/
    ├── config.ts                      ← Generator definitions (prompts + file actions)
    └── templates/
        └── mfe-app/                   ← Handlebars (.hbs) templates for new apps
            ├── package.json.hbs
            ├── vite.config.ts.hbs
            ├── tailwind.config.js.hbs
            ├── postcss.config.js.hbs
            ├── tsconfig.json.hbs
            ├── tsconfig.app.json.hbs
            ├── tsconfig.node.json.hbs
            ├── index.html.hbs
            └── src/
                ├── main.tsx.hbs
                ├── App.tsx.hbs
                ├── index.css.hbs
                └── vite-env.d.ts.hbs
```

There is currently **one generator** registered: `mfe-app`.

---

## How Turbo fits in the monorepo

```
┌─────────────────────────────────────────────────────────────────┐
│  monorepo/ (root)                                               │
│                                                                 │
│  package.json ──────► "build": "turbo run build"                │
│  turbo.json   ──────► defines tasks: build, dev, lint, etc.     │
│  pnpm-workspace.yaml ► apps/* and packages/*                    │
│                                                                 │
│  turbo/generators/ ► scaffolding only (turbo gen mfe-app)       │
└─────────────────────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  apps/shell      │     │  apps/task       │     │  packages/ui     │
│  (host)          │────►│  (remote MFE)    │     │  (shared lib)    │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         Module Federation + shared workspace packages
```

When you run `pnpm build` from the monorepo root, **Turborepo** reads `turbo.json`, discovers which packages have a `build` script, respects dependency order (`dependsOn: ["^build"]`), and caches outputs. That is separate from the `turbo/` folder, but both are part of the Turborepo toolchain.

---

## The generator system (`generators/`)

Turbo Generators use **Plop** under the hood:

1. You run `turbo gen <generator-name>` from the monorepo root.
2. Turbo loads `turbo/generators/config.ts`.
3. Plop shows interactive prompts defined in that file.
4. Your answers are passed into **Handlebars** templates (`.hbs` files).
5. Plop writes rendered files to `apps/<name>/`.

### Handlebars syntax in templates

Templates use `{{variable}}` placeholders and conditionals:

```handlebars
{{#if (eq type "host")}}
  <!-- host-only config -->
{{else}}
  <!-- remote MFE config -->
{{/if}}
```

The custom `eq` helper (equality check) is registered in `config.ts`:

```ts
plop.setHelper("eq", (a, b) => a === b);
```

This allows templates to branch between **host (shell)** and **remote (MFE)** app types.

---

## Generator config (`generators/config.ts`)

This is the **brain** of the scaffolding system. It exports a default function that receives the Plop API and registers generators.

### Registered generator: `mfe-app`


| Property        | Value                                                              |
| --------------- | ------------------------------------------------------------------ |
| Name            | `mfe-app`                                                          |
| Description     | Create a new Micro Frontend app (Vite + React + Module Federation) |
| Output location | `apps/{{name}}/`                                                   |


### Interactive prompts


| Prompt            | Field     | Purpose                         | Validation                                                       |
| ----------------- | --------- | ------------------------------- | ---------------------------------------------------------------- |
| App name          | `name`    | Folder name and federation name | Required; lowercase, numbers, hyphens only (`^[a-z][a-z0-9-]*$`) |
| App type          | `type`    | `"host"` or `"remote"`          | List choice; drives template conditionals                        |
| Port              | `port`    | Dev/preview server port         | 1024–65535; defaults to `3000` (host) or `3001` (remote)         |
| Exposed component | `exposes` | Module Federation expose name   | Defaults to `App` for remotes; blank for hosts                   |


### Actions (files created)

For each successful run, Plop executes a list of `add` and `addMany` actions:


| Action    | Output path                        | Template source                                                                |
| --------- | ---------------------------------- | ------------------------------------------------------------------------------ |
| `add`     | `apps/{{name}}/package.json`       | `templates/mfe-app/package.json.hbs`                                           |
| `add`     | `apps/{{name}}/vite.config.ts`     | `templates/mfe-app/vite.config.ts.hbs`                                         |
| `add`     | `apps/{{name}}/tailwind.config.js` | `templates/mfe-app/tailwind.config.js.hbs`                                     |
| `add`     | `apps/{{name}}/postcss.config.js`  | `templates/mfe-app/postcss.config.js.hbs`                                      |
| `add`     | `apps/{{name}}/tsconfig.json`      | `templates/mfe-app/tsconfig.json.hbs`                                          |
| `add`     | `apps/{{name}}/tsconfig.app.json`  | `templates/mfe-app/tsconfig.app.json.hbs`                                      |
| `add`     | `apps/{{name}}/tsconfig.node.json` | `templates/mfe-app/tsconfig.node.json.hbs`                                     |
| `add`     | `apps/{{name}}/index.html`         | `templates/mfe-app/index.html.hbs`                                             |
| `add`     | `apps/{{name}}/src/main.tsx`       | `templates/mfe-app/src/main.tsx.hbs`                                           |
| `add`     | `apps/{{name}}/src/App.tsx`        | `templates/mfe-app/src/App.tsx.hbs`                                            |
| `add`     | `apps/{{name}}/src/index.css`      | `templates/mfe-app/src/index.css.hbs`                                          |
| `add`     | `apps/{{name}}/src/vite-env.d.ts`  | `templates/mfe-app/src/vite-env.d.ts.hbs`                                      |
| `addMany` | `apps/{{name}}/public/`**          | `templates/mfe-app/public/**` (see [Known gaps](#troubleshooting--known-gaps)) |


---

## MFE app templates (`generators/templates/mfe-app/`)

Each `.hbs` file is a blueprint. After generation, the `.hbs` extension is removed and variables are replaced.

### `package.json.hbs`

Defines the new workspace package:

- **Scripts:** `dev`, `build` (`tsc -b && vite build`), `preview`, `lint`
- **Dependencies:** `@repo/api`, `@repo/hooks`, `@repo/ui`, `@repo/store`, React 19
- **Dev dependencies:** shared TS/Tailwind configs, Vite, Module Federation plugin

**Why needed:** Registers the app in the pnpm workspace so `pnpm --filter <name>` and Turbo task orchestration work.

---

### `vite.config.ts.hbs`

The most important template — wires **Vite + Module Federation**.

#### Host (`type === "host"`)

```ts
federation({
  name: '{{name}}',
  remotes: {},  // you add remotes manually after scaffolding
  shared: { react, react-dom, zustand, @repo/store },
})
```

- No `exposes` — the shell consumes remotes, it does not expose UI.
- No `base` URL override — shell typically runs at port 3000.
- Standard build settings.

#### Remote (`type === "remote"`)

```ts
federation({
  name: '{{name}}',
  filename: 'remoteEntry.js',
  exposes: {
    './{{exposes}}': './src/{{exposes}}.tsx',
  },
  shared: { ... },
})
```

- `**filename: 'remoteEntry.js'**` — entry point the host loads at runtime.
- `**exposes**` — maps a public import path (e.g. `task/App`) to a source file.
- `**minify: false**` and `**cssCodeSplit: false**` — common Module Federation settings to avoid broken shared chunks.
- `**cors: true**` — allows the shell (different port) to fetch remote assets during dev/preview.

**Why needed:** Without this, the new app would be a standalone Vite app with no federation integration.

---

### `src/App.tsx.hbs`

Starter React component with two variants:


| Type       | Behavior                                                                              |
| ---------- | ------------------------------------------------------------------------------------- |
| **Host**   | Placeholder shell layout with comments showing where to `lazy()` import remotes       |
| **Remote** | Simple exposed component with `@repo/ui` Button; documents the federation expose path |


**Why needed:** Gives a working, buildable entry component that matches the federation `exposes` config.

---

### `src/main.tsx.hbs`

Standard React 19 bootstrap:

```tsx
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Why needed:** Required Vite entry point for standalone dev (`pnpm dev` inside the new app).

---

### `src/index.css.hbs`

```css
@import "@repo/ui/styles";
```

Pulls in shared design tokens (CSS variables for colors, radius, etc.) from `@repo/ui`.

**Why needed:** Ensures Tailwind + shadcn-style theming is consistent across all MFEs.

---

### `src/vite-env.d.ts.hbs`

```ts
/// <reference types="vite/client" />
```

**Why needed:** TypeScript support for Vite-specific imports (e.g. `import.meta.env`).

---

### `index.html.hbs`

Minimal HTML shell with `<div id="root">` and script tag to `/src/main.tsx`.

**Why needed:** Vite requires an HTML entry; title is set to `{{name}}`.

---

### `tailwind.config.js.hbs`

Extends the shared `@repo/tailwind-config` and scans:

- `./index.html`, `./src/**/`*
- `../../packages/ui/src/**/*` (so UI component classes are not purged)

**Why needed:** Tailwind must see classes used in shared UI package files.

---

### `postcss.config.js.hbs`

Standard PostCSS pipeline: `tailwindcss` + `autoprefixer`.

**Why needed:** Required for Tailwind v3 processing in Vite.

---

### `tsconfig.json.hbs`

Project references root:

```json
{
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**Why needed:** TypeScript 5+ solution-style config; splits app source vs. Vite config typing.

---

### `tsconfig.app.json.hbs`

Application TypeScript config:

- Extends `@repo/typescript-config/react-library.json`
- Strict mode, React JSX, `noEmit: true` (Vite handles bundling)
- Includes `src/`

**Why needed:** Consistent strict typing across all apps in the monorepo.

---

### `tsconfig.node.json.hbs`

TypeScript config for Node-side files (only `vite.config.ts`):

- ES2022 target, bundler module resolution
- Strict checks

**Why needed:** `vite.config.ts` runs in Node, not the browser — separate config avoids DOM lib conflicts.

---

## How to run the generator

From the **monorepo root** (`monorepo/`):

```bash
# Interactive mode (recommended)
pnpm exec turbo gen mfe-app

# Or with npx
npx turbo gen mfe-app
```

Example session:

```
? App name: billing
? Is this app a host or remote? Remote MFE
? Dev/preview port: 3007
? What component to expose? App
```

This creates `apps/billing/` with all templated files.

Then install dependencies (if new workspace package):

```bash
pnpm install
```

Build to verify:

```bash
pnpm --filter billing build
```

---

## What gets created after scaffolding

```
apps/<name>/
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── index.html
├── public/                    ← only if public templates exist
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── vite-env.d.ts
```

The new app is automatically part of the workspace because `pnpm-workspace.yaml` includes `apps/*`.

---

## Manual steps after generating a new MFE

The generator scaffolds the app; **integration is manual**:

### If you created a **remote** MFE

1. **Register in the shell** — add to `apps/shell/vite.config.ts`:
  ```ts
   remotes: {
     billing: 'http://localhost:3007/assets/remoteEntry.js',
   }
  ```
2. **Add TypeScript remote types** — in `apps/shell/src/vite-env.d.ts`:
  ```ts
   declare module 'billing/App' {
     const App: React.ComponentType;
     export default App;
   }
  ```
3. **Lazy-load in shell** — in `apps/shell/src/App.tsx`:
  ```tsx
   const BillingApp = lazy(() => import('billing/App'));
  ```
4. **Add a route** — e.g. `path="/billing/*"` with `<BillingApp />`.
5. **Add nav item** (optional) — sidebar link in the shell.
6. **Add a dev script** (optional) — in root `package.json`:
  ```json
   "dev:billing": "concurrently ... shell + billing build --watch + billing preview"
  ```

### If you created a **host** (shell)

You typically only need one shell. If generating a second host, wire all existing remotes into its `vite.config.ts` and routing.

### Port planning (current repo)


| App        | Port |
| ---------- | ---- |
| shell      | 3000 |
| auth       | 3001 |
| dashboard  | 3002 |
| task       | 3003 |
| setting    | 3004 |
| user       | 3005 |
| management | 3006 |


Pick the next free port for new remotes (e.g. `3007`).

---

## Relationship to `turbo.json`

`turbo.json` lives at the monorepo root (not inside `turbo/`). It defines **task pipelines** that apply to every package, including apps created by this generator:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": { "dependsOn": ["^lint"] },
    "check-types": { "dependsOn": ["^check-types"] },
    "preview": {
      "dependsOn": ["build"],
      "cache": false,
      "persistent": true
    }
  }
}
```


| Task                    | Meaning for generated apps                                   |
| ----------------------- | ------------------------------------------------------------ |
| `build`                 | Runs `tsc -b && vite build`; outputs cached in `dist/**`     |
| `dependsOn: ["^build"]` | Builds workspace dependencies (`@repo/ui`, etc.) first       |
| `dev`                   | Long-running Vite dev server; not cached                     |
| `preview`               | Serves production build; depends on `build` completing first |


**Flow example — `pnpm build`:**

```
turbo run build
    │
    ├─► @repo/store build (if defined)
    ├─► @repo/ui check-types / build
    ├─► apps/task build     ◄── uses same scripts from package.json.hbs
    ├─► apps/shell build
    └─► ... parallel where possible, cached if inputs unchanged
```

---

## Troubleshooting & known gaps

### `addMany` for `public/` folder

`config.ts` includes:

```ts
{
  type: "addMany",
  destination: `${base}/public`,
  templateFiles: "templates/mfe-app/public/**",
  base: "templates/mfe-app/public",
}
```

There is currently **no `templates/mfe-app/public/` directory**. This action is a no-op if the folder is empty/missing. If you need default favicons or assets in new apps, add files under `templates/mfe-app/public/`.

### `react-component` generator reference

`packages/ui/package.json` has:

```json
"generate:component": "turbo gen react-component"
```

There is **no `react-component` generator** defined in `turbo/generators/config.ts` yet — only `mfe-app` exists. Running that script will fail until a second generator is added.

### Template vs. existing apps drift

Apps like `task`, `user`, and `shell` have evolved beyond the base templates (e.g. `react-router-dom`, `lucide-react`, `base` URL in vite config, nested routes). Newly generated apps are **starting points** — compare with an existing app when adding routing, RBAC, or federation `base` paths.

### Generator does not update the shell automatically

Creating `apps/billing` does not modify `apps/shell`. Federation wiring is always manual (by design — avoids overwriting shell config).

---

## Quick reference


| I want to…                               | Command / file                                  |
| ---------------------------------------- | ----------------------------------------------- |
| Scaffold a new MFE                       | `pnpm exec turbo gen mfe-app`                   |
| Change generator prompts or output files | Edit `turbo/generators/config.ts`               |
| Change default Vite/Federation setup     | Edit `turbo/generators/templates/mfe-app/*.hbs` |
| Change build/dev task behavior           | Edit `monorepo/turbo.json`                      |
| Build all apps                           | `pnpm build` (runs `turbo run build`)           |
| Build one app                            | `pnpm --filter task build`                      |
| Run all dev servers                      | `pnpm dev`                                      |


---

## Further reading

- [Turborepo — Generating code](https://turborepo.dev/docs/guides/generating-code)
- [Turborepo — Task pipeline](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Module Federation with Vite (`@originjs/vite-plugin-federation`)](https://github.com/originjs/vite-plugin-federation)
- [Plop.js documentation](https://plopjs.com/documentation/)

