# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## Deploying to GitHub Pages (automated)

This repository uses a GitHub Actions workflow to build the site and publish it to GitHub Pages when changes are pushed/merged to the `main` branch.

What I added:

- `.github/workflows/pages.yml` — builds the project (`npm ci` → `npm run build`) and deploys the `dist/` output to GitHub Pages.

How to publish your site from local to GitHub:

1. Create a new GitHub repository named `PactPia_Web` (via GitHub UI or `gh repo create`).
2. In your project root (this repo), initialize and push your code if you haven't already:

```powershell
git init
git add .
git commit -m "Initial commit"
# replace <OWNER> with your GitHub user or org
git remote add origin https://github.com/<OWNER>/PactPia_Web.git
git branch -M main
git push -u origin main
```

3. After you push, GitHub Actions will run on pushes to `main`. The workflow will build and deploy the `dist/` folder to GitHub Pages.

Notes:
- This project uses Vite; the build output goes to `dist/` by default.
- Make sure GitHub Pages is enabled for the repository; when using the Pages action the action will create/update the Pages site automatically. If you prefer to publish to the `gh-pages` branch instead, I can switch the workflow to `peaceiris/actions-gh-pages` flow.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
