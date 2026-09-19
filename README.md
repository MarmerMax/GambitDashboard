# Security App — Cloud Resource Explorer

A dashboard for browsing cloud resources, grouping them into Applications, and inspecting each
Application as an interactive resource graph.

There is no backend. A **mocked API layer** simulates paginated, searchable, filterable and sortable
endpoints over an in-memory dataset — with network latency, cursor pagination and request
cancellation — so both grids behave like real server-driven tables without a server running.

## Getting started

**Requirements:** Node **22.22 or newer** (React Router 8 sets that floor; Vite 8 needs
`^20.19 || >=22.12`) and npm 10+. Check with `node -v`.

```bash
npm install
npm run dev
```

The dev server prints its URL — `http://localhost:5173` unless the port is taken. That's all: no
`.env` file, no database, no API to start. The mock API is plain TypeScript running in the browser,
so a fresh clone is running in two commands.

```bash
npm run build     # type-check, then produce dist/
npm run preview   # serve dist/ to check the production build
```

| Script              | What it does                                                           |
| ------------------- | ---------------------------------------------------------------------- |
| `npm run dev`       | Dev server, with TypeScript errors in the browser overlay and terminal |
| `npm run build`     | `tsc --noEmit` then a production build                                 |
| `npm run typecheck` | Type-check only                                                        |
| `npm run lint`      | oxlint                                                                 |
| `npm run format`    | Prettier over the repo                                                 |
| `npm run preview`   | Serve the production build                                             |

Vite does **not** type-check — it strips types and moves on. `vite-plugin-checker` runs `tsc` in a
worker during `npm run dev`, so type errors appear as a red overlay in the browser and in the
terminal instead of only in your editor.

## Libraries

**Runtime**

| Library                               | Why it's here                                                                                                         |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `react`, `react-dom` 19               | UI                                                                                                                    |
| `@mui/material` 9                     | Component library — every style goes through `sx` and one theme, so the app has no CSS files                          |
| `@emotion/react`, `@emotion/styled`   | MUI's styling engine; peer dependencies rather than a direct choice                                                   |
| `@mui/icons-material`                 | Icons for the toolbars, dialog and graph controls                                                                     |
| `@mui/x-data-grid` 9 (Community, MIT) | Row virtualization, server pagination/sorting/filtering, checkbox selection and keyboard support out of the box       |
| `@reduxjs/toolkit` 2 — **RTK Query**  | The server-cache layer: caching, deduplication, cancellation and invalidation. No slices; Redux only hosts this cache |
| `react-redux` 9                       | Binds the RTK Query cache to React                                                                                    |
| `react-router` 8                      | Two pages plus a nested route, so the details dialog has its own shareable URL                                        |

**Development**

| Library                          | Why it's here                                                         |
| -------------------------------- | --------------------------------------------------------------------- |
| `vite` 8, `@vitejs/plugin-react` | Dev server and build                                                  |
| `typescript` 6                   | `strict` mode; a single `tsconfig.json` covering `src` and the config |
| `vite-plugin-checker`            | Surfaces type errors in the browser while developing                  |
| `oxlint`                         | Fast linting                                                          |
| `prettier`                       | 4-space indent, no semicolons, 100 columns (`.prettierrc`)            |

**Deliberately not used**

- **No graph library.** The graph is a star layout — node positions are trigonometry, and zoom/pan
  is the SVG `viewBox`. React Flow would add a large dependency and an editor model the brief
  doesn't ask for.
- **No second data-fetching library.** RTK Query covers it, and `@reduxjs/toolkit` was already
  present. TanStack Query would do the same job; it would mean dropping Redux entirely.
- **No form library.** Two fields with one validation rule don't justify one.
- **No test runner** — see "What could be improved".

## Routes

| Route                          | What it shows                                                  |
| ------------------------------ | -------------------------------------------------------------- |
| `/resources`                   | Resources grid — browse, filter, select, create an Application |
| `/applications`                | Applications grid — browse and search                          |
| `/applications/:applicationId` | The same grid with the details dialog open                     |

The details dialog is a **nested route**, so the grid stays mounted behind it and the URL is
shareable — opening that link cold is what proves the data layer doesn't depend on what a list
happened to load.

## What was implemented

**Resources (server-driven grid)**

- Every interaction issues a request: `search`, `provider`, `environment`, `criticality`,
  `sort_by`, `sort_dir`, `page_size`, `next_token`
- `paginationMode` / `sortingMode` / `filterMode` are all `"server"` — the grid never filters or
  sorts locally and only ever holds one page
- **Cursor pagination**: the API returns `{ items, next_token, total }` and the client keeps a token
  per visited page. The Community footer is prev/next only, which suits a cursor flow exactly
- Row virtualization from the Data Grid; page sizes up to 100
- Search debounced 350 ms; in-flight requests cancelled when a newer one starts
- Skeleton rows on first load, progress bar on refetch, error state with Retry, empty state that
  offers "Clear filters"
- Checkbox selection that survives paging and filtering, with an always-present action bar
  (disabled until something is selected, so the table never jumps)

**Creating an Application**

- Dialog with a required name, optional description and the selected resources
- Success snackbar at the top with a link straight to the new Application's graph
- The selection clears and the Applications grid refreshes itself through cache invalidation

**Applications**

- Grid with search and server pagination; clicking a row opens the details route

**Application graph**

- Inline SVG star graph — the Application in the centre, member resources around it, criticality
  coloured accents
- **Click a node to expand it in place**, showing type, region, environment, criticality, owner,
  open issues and tags inside the node itself. The expanded node is painted last so it sits above
  its neighbours; click again to collapse
- **Zoom and pan**: +/−/reset controls and drag-to-pan on empty canvas, implemented with the
  `viewBox` so everything stays vector-crisp
- The graph fills the dialog, and the dialog expands to full screen

## Main technical decisions

- **RTK Query over hand-written thunks.** The first version had slices with async thunks, an
  `entities` cache merged on every fulfilled action, manual `AbortController`s and missing-id
  diffing. It also had a design smell: one dispatch fed two channels — rows to the store,
  `next_token` back to the caller. RTK Query replaced all of it, and `@reduxjs/toolkit` was already
  a dependency, so it cost nothing new. Redux is now purely the host for that cache; there are no
  slices and no `useAppSelector` anywhere.
- **`fakeBaseQuery()` + `queryFn`** keeps the mock API as plain functions with no HTTP layer, while
  `api.signal` still gives real cancellation. Swapping in a real backend is a per-endpoint change
  (`queryFn` → `query: (params) => ({ url, params })`) with no component edits.
- **Query state stays local.** Search, filters, sort, page and the cursor-token map live in each
  table hook's reducer — one component reads them, so they don't belong in a global store. The
  store holds server data only.
- **Atomic table state.** Filters, sort, page size and tokens update in a single reducer action, so
  changing a filter resets the page _and_ clears the cursor cache in one transition. With separate
  `useState` calls one render could fire a request with a new filter and a stale cursor. The reducer
  also refuses to move to a page it has no cursor for, rather than correcting it afterwards in an
  effect.
- **Fetch by id, never "hope it's cached."** An Application's resources are almost never the ones
  the resources grid loaded, and a deep-linked Application may not be on page 1 of the list. Both
  have their own endpoint, and RTK Query caches them — so opening the same Application twice costs
  no requests.
- **Custom filter controls instead of the Data Grid filter panel.** Provider / Environment /
  Criticality dropdowns and a search field drive the server query directly; the generic panel would
  mean building rules ("provider equals AWS") for a UX that should be three dropdowns.
- **MUI over hand-written CSS.** An earlier iteration used a stylesheet of custom classes and was
  hard to keep consistent. The app now has no CSS files: `sx` plus one theme, with the Data Grid
  supplying virtualization, sorting, pagination, selection and keyboard accessibility.
- **Dataset size.** The brief asks for ~10 resources, but 10 rows demonstrate neither pagination nor
  virtualization, so 10 curated resources are followed by 230 deterministically generated ones
  (fixed seed). Change `GENERATED_COUNT` in `src/mock/resources.ts`. Seeded Applications
  deliberately reference resources on deep pages so the fetch-by-id path is actually exercised.
- **Errors are visible while developing.** Vite only strips types, so `vite-plugin-checker` puts
  TypeScript errors in a browser overlay and the terminal, and an `ErrorBoundary` turns a render
  crash into a message with a Reload button instead of a blank page.

## Structure

Folders are **feature-first**: `Resources` and `Applications` are the two features, and each layer
is split by them, with a `common` folder wherever something is genuinely shared. The alternative —
grouping by kind alone — spreads one feature across the whole tree.

```text
src/
  api/          # mock transport: what a real HTTP client would replace
  state/        # RTK Query cache: endpoints + store
  hooks/        # table state (search, filters, sort, cursor), plus small utilities
  containers/   # stateful: call hooks, dispatch, decide what to render
  components/   # presentational: props in, JSX out
  pages/        # route targets, composing containers
  types/        # domain types and API contracts
  theme/        # MUI theme + status colour maps
  mock/         # the in-memory dataset
```

**How a request flows**

```text
ResourcesPage → ResourcesGridContainer → useResourcesTable      (query state, local reducer)
                                       → useGetResourcesQuery   (RTK Query cache)
                                       → api/Resources          (mock transport)
                                       → mock/resources         (dataset)
```

Each layer only knows the one below it. Swapping the mock for a real backend touches `api/` and the
`queryFn`s in `state/` — nothing above them changes.

**Conventions**

- **One component per folder, with an `index.ts`.** `ResourcesGrid/ResourcesGrid.tsx` +
  `ResourcesGrid/index.ts`.
- **A component used by exactly one parent lives inside it.** `ApplicationGraphNode` sits in
  `ApplicationGraph`, which sits in `ApplicationDetailsDialog`. Shared pieces move up: the
  criticality/provider chips are used by three different places, so they sit at `Resources` level.
- **Import through barrels.** Cross-folder imports use the domain index —
  `import { ResourcesGridContainer } from "@src/containers/Resources"` — never a deep file path.
- **Never import a barrel of a folder you live in.** That's a cycle (barrel → component → barrel);
  siblings use relative paths instead (`import { ProviderChip } from "../ProviderChip"`).
- **No barrels at layer roots** (`components/`, `state/`, …). One import would drag in every module
  beneath it, which is how import-cycle clusters start.
- **`@src` alias** for everything else, configured in both `tsconfig.json` (`paths`) and
  `vite.config.ts` (`resolve.alias`) — TypeScript resolves types, Vite resolves the bundle.
- **Containers hold state, components hold markup.** Containers set no styles; components take no
  hooks beyond their own UI state.

## What could be improved with more time

- **Persistence and a real API.** Applications live in the mock module, so a reload resets them.
  Editing and deleting Applications are missing.
- **Reflect table state in the URL** so a filtered view can be shared or survive a refresh — the
  details dialog already works this way.
- **`keepPreviousData` while paging.** RTK Query needs `serializeQueryArgs`/`merge` for this, so the
  skeleton still flashes on page change.
- **Tests.** The project ships without a test setup; Vitest + React Testing Library around the table
  reducers (cursor cache, filter resets), the create flow and the graph interactions would be first.
  Current verification is `tsc --strict`, oxlint and manual testing.
- **Graph at scale.** The star layout is readable to roughly a dozen nodes; beyond that it needs
  grouping or a force layout, and an expanded node overlaps its neighbours by design.
- **Shared table hook.** `useResourcesTable` and `useApplicationsTable` now have nearly identical
  cursor-pagination reducers — worth extracting once a third table appears.
- **Dark mode.** The theme is already the single source of colour, so this is a palette addition.

## Where AI was used

Built with Claude (Claude Code), reviewed and directed by me:

- AI wrote the scaffolding, the component/hook/API split, all components, the mock API, the dataset
  generator and this README.
- I drove the architecture across several iterations: MUI + Community Data Grid over hand-written
  CSS; server-side search/filter/sort/pagination against a mocked endpoint with `next_token`;
  splitting Resources and Applications into separate pages behind a router; and replacing the
  hand-rolled Redux slices with RTK Query once it was clear the thunk results were being consumed
  through `unwrap()` rather than the reducers.
- MUI 9 and Data Grid 9 APIs were taken from the official docs rather than memory, which caught two
  breaking changes: system props (`justifyContent`, `mb`, `bgcolor`, …) no longer exist on
  components and must go through `sx`, and `rowSelectionModel` is now `{ type, ids: Set }`.
- Several bugs were found by reading source rather than guessing — the grid growing past `100vh`
  traced to MUI Grid's `flex-wrap: wrap` in `gridGenerator.js`, and graph nodes becoming unclickable
  traced to pointer capture retargeting the `click` event.
- Verification throughout: `tsc --noEmit` under `strict`, `oxlint`, production builds, and probing
  the mock API directly in Node to confirm filter/pagination counts and the cold-cache fetch-by-id
  path.
