# Todo Full-Stack Example

A minimal full-stack Todo app example for Automaton Monster.

This example shows the canonical Automaton local layout:

- `frontend/` Vite TypeScript UI
- `backend/` Python controller runtime
- file-backed persistence in `backend/todos.data.json`
- frontend calls through `window.automatonApi.callController(...)`
- `automaton create`, `automaton deploy`, and `automaton publish`

## Structure

```text
todo-fullstack/
  automaton.json
  .gitignore
  frontend/
    package.json
    src/
  backend/
    todos.py
    requirements.txt
```

## Use this repo

Clone the repo, then create and link the remote Automaton app for this local scaffold:

```bash
automaton login
automaton create
```

`automaton.json` intentionally ships without `appId`. `automaton create` adds the remote app link to the current folder.

If you prefer to start from a brand-new folder instead, you can also run:

```bash
automaton login
automaton new "Todo Full-Stack"
```

Then copy the example `frontend/` and `backend/` files into that generated scaffold.

## Local development

```bash
cd frontend
npm install
npm run dev
```

## Deploy

```bash
cd frontend
npm install
npm run build

cd ..
automaton deploy
```

## Publish

Only after explicit approval:

```bash
automaton publish --yes
```
