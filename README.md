# ITEM Presentation (v2)

Published at <https://tommyyula.github.io/item-ai-plateform-v2/>. Source mirrored from `Taylor180520/Taylor180520.github.io`.

Componentized presentation site for ITEM's enterprise AI solutions. The visual
markup remains plain HTML, assembled by Vite from one file per presentation
section.

## Structure

| Path | Responsibility |
| --- | --- |
| `src/App.js` | Page composition and section order |
| `src/components/SiteHeader.html` | Global presentation header |
| `src/components/sections/` | One HTML component per slide/section |
| `src/styles/index.css` | Presentation styles and responsive rules |
| `src/i18n/dictionaries.js` | Chinese and Japanese translation dictionaries |
| `src/presentation.js` | Theme, language, training tabs and slide navigation |
| `src/main.js` | Application bootstrap |

## Local preview

```bash
npm install
npm run dev
```

Open <http://localhost:3000/>. The presentation is served exclusively through
`index.html`.

For compatibility with the former project-site URL, the same application is
also built at `/ITEM_Presentation/index.html`; both entries share all source
components, styles and behavior.

## Deployment

Every push to `main` builds the Vite application and deploys `dist/` to GitHub
Pages.
