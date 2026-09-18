# Gambit Security — Cloud Resource Explorer

A small dashboard for browsing cloud resources, grouping them into Applications, and viewing each
Application as a resource graph. No backend — all state lives in the client.

## Getting started

```bash
npm install
npm run dev
```

The app starts on the port Vite prints (default `http://localhost:5173`).

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check (`tsc -b`, strict) and build for production |
| `npm run preview` | Serve the production build |
| `npm run lint` | Run oxlint |

## What was implemented

**Resources**
- Table with name (plus region, owner, tags), type, provider, environment, criticality and open issues
- Search by name, and provider / environment / criticality filters, all combinable
- "Clear filters" (disabled when no filter is active) and an empty state when filters match nothing
- Row checkboxes, a header checkbox that selects/deselects everything currently visible (with an
  indeterminate state for partial selection), and selected rows highlighted
- A selection bar appears once something is selected: count, "Clear selection", and
  **Create Application (N)**
- Skeleton loading state while the (simulated) inventory loads

**Create Application**
- Modal dialog with a required name, an optional description and the list of selected resources
- Name validation on submit, with an inline error linked to the input via `aria-describedby`
- Cancel, Escape and backdrop click all close it
- On create: the Application is added, the new Application becomes the selected one, and the
  resource selection is cleared — resources themselves stay available for other Applications

**Applications**
- Panel listing every Application with name, description, resource count and a summary of member
  resources (first three + "+N more")
- Clicking an Application selects it; the selected card is visually marked (`aria-pressed`)
- Empty state when no Applications exist yet

**Application graph**
- Inline SVG star graph: the Application in the centre, each member resource on an ellipse around
  it, connected by dashed edges
- Node accent colour encodes criticality (with a legend), hover highlights the node, and the native
  SVG `<title>` gives full resource details on hover
- Below the graph, a list of member resources with provider / environment / criticality badges and
  open-issue counts

## Main technical decisions

- **No UI library.** The surface is small (table, selects, modal, badges, graph) and the brief asks
  for good visual detail, so a single stylesheet with CSS custom properties gives full control with
  zero dependency weight. Class names follow a light BEM convention.
- **Plain SVG instead of React Flow.** The required graph is a static star layout; node positions
  are pure trigonometry (~15 lines). A graph library would add a large dependency and a canvas/pan
  interaction model the brief explicitly does not want.
- **State split into small hooks** — `useResources` (data + loading), `useResourceFilters`,
  `useSelection`, `useApplications`. Each owns one concern, is independently testable, and `App`
  stays a thin composition layer. No Redux/Zustand: nothing here is shared deeply enough to need it.
- **Selection is stored as resource ids**, not resource objects, so it stays correct if the
  inventory is ever refetched. Applications likewise reference `resourceIds` (per the given model);
  the UI resolves them through a `Record<string, Resource>` lookup built once with `useMemo`.
- **Types are the source of truth.** The `Provider`/`Environment`/`Criticality` unions are mirrored
  by `PROVIDERS`/`ENVIRONMENTS`/`CRITICALITIES` constants that drive both the filter dropdowns and
  the legend, so adding a value is a one-line change. `strict` is on and there is no `any`.
- **A simulated 450ms load** exists only so the loading state in the brief is real rather than
  decorative.
- **Accessibility**: every control has a label, the dialog is `role="dialog"` + `aria-modal` +
  `aria-labelledby` with focus placed in the name field, the validation error is announced via
  `role="alert"`, the graph carries an `aria-label` describing the connection, and focus-visible
  outlines are preserved throughout.

### Structure

```text
src/
  components/   # presentational + small stateful UI pieces
  data/         # sample resources
  hooks/        # resources, filters, selection, applications
  types/        # domain types and the option constants
  App.tsx       # composition + cross-cutting state
  index.css     # tokens, base styles, component styles
```

## What could be improved with more time

- **Persistence** — Applications vanish on reload; `localStorage` (or a real API) would be the first
  addition, along with edit/delete for Applications.
- **Richer graph** — group nodes by environment or provider, draw resource↔resource dependencies,
  and add zoom/pan once the node count outgrows a single ellipse (labels start colliding past ~12
  nodes; today the data set is 10).
- **Table ergonomics** — sorting per column, pagination/virtualisation for realistic inventories,
  and filtering by owner/tag (the data already carries both).
- **Tests** — the project ships without a test setup; Vitest + React Testing Library covering the
  filter/selection/create flows and a focus-trap pass on the modal would be the first addition.
- **Dark theme** — the palette is already tokenised, so this is mostly a second `:root` block.
- **Design polish** — a proper icon set for providers, and toast feedback after creating an
  Application.

## Where AI was used

The project was built in a single session with Claude (Claude Code):

- Scaffolding (`npm create vite`), the component/hook breakdown, all component and styling code, the
  sample data set and this README were AI-generated from the assignment brief.
- I reviewed and directed the output: no component library, plain SVG for the graph, hooks instead
  of a state library, and the accessibility requirements above.
- Verification was done by running the real toolchain rather than trusting the output: `tsc -b`
  under `strict`, `oxlint`, and the dev server. The flows (filtering, selection, validation,
  create-Application, graph render) were additionally exercised headlessly during development
  before the test tooling was removed to keep the project dependency-light — no defects surfaced.
