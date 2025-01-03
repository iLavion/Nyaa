// note: all tasks below are ran serially instead of concurrently (controlled by the pre-commit git hook)
// this avoids the issue of linting and formatting the same file at the same time
const config = {
  "*.{js,ts,tsx}": ["pnpm lint", "prettier --write"],
  "*.{css,md}": "prettier --write",
  "package.json": "sort-package-json",
};

export default config;
