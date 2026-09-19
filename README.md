# Gambit Security — Cloud Resource Explorer

A dashboard for browsing cloud resources, grouping them into Applications, and viewing each
Application as a resource graph.

There is no backend: a **mocked API layer** simulates a paginated, searchable, filterable and
sortable endpoint over an in-memory dataset, so the table behaves like a real server-driven grid
(network latency, cursor pagination, request cancellation) without running a server.

## Getting started

```bash
npm install
npm run dev
```

| Script            | What it does                                           |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Start the dev server                                   |
| `npm run build`   | Type-check (`tsc -b`, strict) and build for production |
| `npm run preview` | Serve the production build                             |
| `npm run lint`    | Run oxlint                                             |

## Stack

React 19 · TypeScript (strict) · Vite · MUI 9 · MUI X Data Grid 9 (Community)

## What was implemented

**Server-driven resources table (MUI X Data Grid, Community)**

- Every user interaction issues a request: `search`, `provider`, `environment`, `criticality`,
  `sort_by`, `sort_dir`, `page_size`, `next_token`
- `paginationMode` / `sortingMode` / `filterMode` are all `"server"` — the grid never filters or
  sorts data on the client, so it only ever holds one page in memory
- **Cursor pagination**: the API returns `{ items, next_token, total }`; the client keeps a token
  per visited page index. The Community footer is prev/next only, so a cursor flow fits it exactly
- **Row virtualization** comes from the Data Grid itself; page sizes go up to 100 rows
- Search is debounced (350 ms), and every in-flight request is cancelled via `AbortController` when
  a newer one starts, so fast typing can't produce out-of-order results
- Loading states: skeleton rows on first load, a progress bar on subsequent fetches
- Error state with a Retry action
- Empty state that offers "Clear filters" when filters are active

**Selection and Applications**

- Checkbox selection that survives paging and filtering (`keepNonExistentRowsSelected`), with a
  selection bar showing **Create Application (N)**
- Create dialog: required name (validated), optional description, list of selected resources
- On create: the Application is added, auto-selected, and the resource selection is cleared
- Applications panel with name, description, resource count and member chips; empty state included

**Application graph**

- Clicking an Application in the panel opens it in a dialog — an inline SVG star graph with the
  Application in the centre, member resources around it, criticality-coloured accents, hover
  highlight and a detail tooltip per node, plus a member list below
- The dialog has an expand button that grows it to full screen (and back); the graph scales with it

## Main technical decisions

- **MUI + Data Grid instead of hand-written CSS.** The first iteration used a stylesheet of custom
  classes; it was hard to keep consistent and gave nothing for free. MUI's `sx` plus a single theme
  removed all app CSS, and the Community Data Grid supplies virtualization, sorting, pagination,
  selection and accessible keyboard navigation out of the box.
- **Custom filter controls instead of the Data Grid filter panel.** Provider / Environment /
  Criticality dropdowns and a search box live in a custom `slots.toolbar`, driving the server query
  directly. The generic filter panel would mean building rules ("provider equals AWS") for a UX that
  should be three dropdowns.
- **All table state in one reducer** (`useResourcesTable`). Filters, sort, page, page size and the
  token cache update atomically — for example, changing a filter resets the page _and_ clears the
  cursor cache in the same dispatch. With separate `useState` calls, one render could fire a request
  with the new filter and a stale cursor.
- **A resource cache keyed by id.** Selection is stored as ids, but the dialog and the Applications
  panel need whole resources, and those rows may live on a page the grid no longer holds. Every
  fetched page is merged into a small id→resource map that the rest of the UI reads from.
- **Feature-based folders.** `components/` (presentational), `containers/` (stateful),
  `pages/`, `hooks/`, `api/`, `types/`, `theme/`, `mock/` — each split by feature (`Resources`,
  `Applications`) with a `common/` folder where something is genuinely shared.
- **Dataset size.** The brief asks for ~10 resources, but 10 rows demonstrate neither pagination nor
  virtualization, so the 10 curated resources are followed by ~230 deterministically generated ones
  (fixed seed, so runs are reproducible). Change `GENERATED_COUNT` in `src/mock/resources.ts`.
- **Applications stay in client state.** The brief scopes the mock API to fetching resources, so
  application creation is a plain `useState` — no fake POST endpoint that nothing would read back.

### Structure

```text
src/
  api/
    common/mockNetwork.ts       # latency, abort, cursor encode/decode
    Resources/resourcesApi.ts   # fetchResources(params, signal)
  components/
    common/                     # AppHeader, Dialog, EmptyState, StatusChip
    Resources/                  # grid, toolbar, columns, chips, overlays
    Applications/               # panel, list item, graph, create + details dialogs
  containers/
    Resources/                  # grid container (owns the table hook)
    Applications/               # panel, create dialog and details dialog containers
  hooks/
    common/useDebouncedValue.ts
    Resources/                  # useResourcesTable, useResourceCache, useResourceSelection
    Applications/useApplications.ts
  pages/DashboardPage/
  types/                        # domain types, query/response contracts
  theme/                        # MUI theme + status colour maps
  mock/                         # in-memory dataset
```

## What could be improved with more time

- **Persistence and a real API.** Applications vanish on reload, and `resourcesApi` would be swapped
  for `fetch`; the query/response contract is already shaped for that. Editing and deleting
  Applications are missing too.
- **Reflect query state in the URL** so a filtered view can be shared or restored on reload.
- **A data-fetching library** (TanStack Query / RTK Query) would replace the hand-rolled request
  effect and add caching, retries and stale-while-revalidate for free.
- **Tests.** Vitest + React Testing Library around `useResourcesTable` (token cache, filter resets,
  cancellation) and the create flow; the current verification is `tsc --strict`, oxlint and manual
  testing.
- **Richer graph** — dependencies between resources, grouping by environment, and zoom/pan once a
  star layout stops scaling (labels start colliding past ~12 nodes).
- **Dark mode** — the theme is already the single source of colour, so this is a palette addition
  rather than a refactor.
- One oxlint warning remains by design: `setIsLoading(true)` inside the fetch effect is flagged by
  `react(set-state-in-effect)`, which is the correct shape for a request-on-mount/param-change.

## Where AI was used

Built with Claude (Claude Code):

- AI wrote the scaffolding, the component/hook/API split, all components, the mock API, the dataset
  generator and this README.
- I directed the architecture: MUI + Community Data Grid over hand-written CSS, server-side
  search/filter/sort/pagination against a mocked endpoint with `next_token`, feature-based folders,
  and containers separated from presentational components.
- MUI v9 and Data Grid v9 APIs were taken from the official docs rather than memory, which caught
  two breaking changes: system props (`justifyContent`, `mb`, `bgcolor`, …) no longer exist on
  components and must go through `sx`, and `rowSelectionModel` is now `{ type, ids: Set }`.
- Verification: `tsc -b` under `strict` and `oxlint` are clean; three lint findings led to real
  fixes (the resource cache became state instead of a ref read during render, `rowCount` became
  plain state, and the dialog resets on events instead of in an effect).
