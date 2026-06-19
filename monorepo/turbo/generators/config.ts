import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // Register the 'eq' helper for {{#if (eq a b)}} comparisons in templates
  plop.setHelper("eq", (a: unknown, b: unknown) => a === b);

  plop.setGenerator("mfe-app", {
    description: "Create a new Micro Frontend app (Vite + React + Module Federation)",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "App name (e.g. auth, dashboard, settings):",
        validate: (input: string) => {
          if (!input.trim()) return "App name is required";
          if (!/^[a-z][a-z0-9-]*$/.test(input))
            return "Use lowercase letters, numbers, and hyphens only";
          return true;
        },
      },
      {
        type: "list",
        name: "type",
        message: "Is this app a host (shell) or a remote (MFE)?",
        choices: [
          { name: "Remote MFE  — exposes components, runs on its own port", value: "remote" },
          { name: "Host (Shell) — loads remote MFEs, the main container", value: "host" },
        ],
        default: "remote",
      },
      {
        type: "input",
        name: "port",
        message: "Dev/preview port:",
        default: (answers: { type: string }) => (answers.type === "host" ? "3000" : "3001"),
        validate: (input: string) => {
          const port = parseInt(input, 10);
          if (isNaN(port) || port < 1024 || port > 65535)
            return "Enter a valid port between 1024 and 65535";
          return true;
        },
      },
      {
        type: "input",
        name: "exposes",
        message: "What component to expose? (leave blank for host apps):",
        default: (answers: { type: string }) =>
          answers.type === "remote" ? "App" : "",
      },
    ],
    actions: (data) => {
      const base = `apps/{{name}}`;
      return [
        // --- Root files ---
        {
          type: "add",
          path: `${base}/package.json`,
          templateFile: "templates/mfe-app/package.json.hbs",
        },
        {
          type: "add",
          path: `${base}/vite.config.ts`,
          templateFile: "templates/mfe-app/vite.config.ts.hbs",
        },
        {
          type: "add",
          path: `${base}/tailwind.config.js`,
          templateFile: "templates/mfe-app/tailwind.config.js.hbs",
        },
        {
          type: "add",
          path: `${base}/postcss.config.js`,
          templateFile: "templates/mfe-app/postcss.config.js.hbs",
        },
        {
          type: "add",
          path: `${base}/tsconfig.json`,
          templateFile: "templates/mfe-app/tsconfig.json.hbs",
        },
        {
          type: "add",
          path: `${base}/tsconfig.app.json`,
          templateFile: "templates/mfe-app/tsconfig.app.json.hbs",
        },
        {
          type: "add",
          path: `${base}/tsconfig.node.json`,
          templateFile: "templates/mfe-app/tsconfig.node.json.hbs",
        },
        {
          type: "add",
          path: `${base}/index.html`,
          templateFile: "templates/mfe-app/index.html.hbs",
        },
        // --- src files ---
        {
          type: "add",
          path: `${base}/src/main.tsx`,
          templateFile: "templates/mfe-app/src/main.tsx.hbs",
        },
        {
          type: "add",
          path: `${base}/src/App.tsx`,
          templateFile: "templates/mfe-app/src/App.tsx.hbs",
        },
        {
          type: "add",
          path: `${base}/src/index.css`,
          templateFile: "templates/mfe-app/src/index.css.hbs",
        },
        {
          type: "add",
          path: `${base}/src/vite-env.d.ts`,
          templateFile: "templates/mfe-app/src/vite-env.d.ts.hbs",
        },
        {
          type: "addMany",
          destination: `${base}/public`,
          templateFiles: "templates/mfe-app/public/**",
          base: "templates/mfe-app/public",
        },
      ];
    },
  });
}
