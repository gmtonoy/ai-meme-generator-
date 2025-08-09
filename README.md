# AI Meme Generator 😎

Next.js app that lets you:
1) Upload an image
2) Generate a short meme caption with AI
3) Render the meme locally on a `<canvas>` and download as PNG

## Tech
- Next.js (App Router) + TypeScript
- TailwindCSS
- Simple fetch call to OpenAI API in a server route (`app/api/caption/route.ts`)

## Setup

```bash
# 1) Install deps
npm i

# 2) Create your env file
cp .env.example .env.local
# and set OPENAI_API_KEY in .env.local

# 3) Run it
npm run dev
```

Open http://localhost:3000

## Environment
Create `.env.local` with:
```
OPENAI_API_KEY=sk-...
```

## Notes
- The AI route returns a single short caption. You can tweak the prompt or model in `app/api/caption/route.ts`.
- The canvas renderer uppercases text and uses an Impact-like style, wrapping lines to fit.
- All image processing is client-side; no files are stored on the server.

## License
MIT
