<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application running on PHP 8.5. You are an expert with the Laravel ecosystem. Always use the APIs that match the installed major version of each package — do not assume a version.

Before relying on a package's API, confirm its installed version:

- PHP packages: run `composer show --direct` to list direct dependencies with versions, or `composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Use `search-docs` before changes that depend on Laravel ecosystem APIs, behavior, configuration, or version-specific syntax. Skip it for copy-only edits and other changes where package documentation is irrelevant. Reuse sufficient results already in context instead of searching again.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Project Rules

- This project contains committed, area-grouped rules in `.ai/rules` when that directory exists (settled decisions, non-obvious traps, standing constraints). Framework and package guidelines that only apply to specific paths (testing, frontend, components) also live there, under `.ai/rules/boost` — this is not just recorded decisions, it is load-bearing guidance you have not seen inline. Before you enter plan mode or create/edit any file, you MUST first: open @.ai/rules/index.md (it maps file globs to rule files), read every rule file whose globs cover the path(s) in scope, and run `grep -rin 'keyword' .ai/rules` to catch what a path match alone misses. Do not write code until you have read and are following every matching rule. If `.ai/rules` does not exist, continue without it.
- Record durable rules with `record-rule` so the next agent or teammate inherits them instead of working them out again. Pass a `glob` (e.g. `app/Http/Controllers/**`), a short `title`, and a few-line `note`. Always use `record-rule`, never your native memory or notes tool — native memory is personal and session-scoped; only `.ai/rules` is shared with the team and persists in the repo.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
    - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>

<!--
Bagian di bawah ini DI LUAR tag <laravel-boost-guidelines> di atas, sehingga TIDAK ditimpa
saat `composer post-update-cmd` menjalankan `artisan boost:update`. Ini adalah dokumentasi
proyek (dulu ada di CLAUDE.md, sekarang CLAUDE.md adalah symlink ke file ini).
-->

## Tentang Proyek

Starter kit Laravel 13 + Inertia.js v3 + React 19 (PHP 8.5, TypeScript). Fortify menangani autentikasi (termasuk 2FA). Frontend memakai komponen shadcn/ui di atas Tailwind v4, dengan Laravel Wayfinder men-generate fungsi route/controller yang typed untuk client.

## Perintah

### Dev server

- `composer run dev` — menjalankan `php artisan dev` (app, queue listener, dan Vite dev server sekaligus)
- `npm run dev` — Vite dev server saja

### Build

- `npm run build` — build frontend production
- `npm run build:ssr` — build termasuk bundle SSR

### Lint / format / types

- `composer run lint` — Pint (PHP), semua file
- `vendor/bin/pint --dirty --format agent` — Pint hanya file yang berubah; jalankan ini setiap selesai mengubah file PHP, sebelum selesai
- `npm run lint` — ESLint, auto-fix
- `npm run format` — Prettier, auto-fix (`resources/`)
- `npm run types:check` — `tsc --noEmit`
- `composer run types:check` — PHPStan/Larastan (level 7)
- `composer run ci:check` — gate CI lengkap: lint/format/type-check JS + `composer run test`

### Tes

- `php artisan test --compact` — jalankan semua tes Pest
- `php artisan test --compact --filter=testName` — jalankan satu tes/pattern
- `php artisan test --compact tests/Feature/UserCrudTest.php` — jalankan satu file
- `php artisan make:test --pest {Name}Test` — tes feature baru (nama tanpa prefix `Feature/`/`Unit/`)
- `composer run test` — config:clear + lint:check + types:check + full test suite (yang efektif dijalankan CI)
- Tes memakai Pest, `RefreshDatabase` bila perlu, DB SQLite in-memory, dan `assertInertia`/`AssertableInertia` dari Inertia.

### Wayfinder

- Setelah menambah/mengubah route: `php artisan wayfinder:generate --with-form --no-interaction` untuk regenerate `resources/js/actions/` dan `resources/js/routes/`.

## Arsitektur

### Struktur backend

- `app/Http/Controllers` — controller resource yang tipis (tidak ada layer service class untuk listing CRUD; controller langsung memegang logic `index`/`store`/`update`/`destroy`).
- `app/Http/Requests/{Resource}s/` — satu Form Request per aksi (`Index`, `Store`, `Update`), masing-masing punya `authorize()` yang memanggil policy dan helper accessor bertipe (mis. `search()`, `sort()`, `direction()`) alih-alih membaca `$request->query()` mentah di controller.
- `app/Policies` — satu policy per model; `viewAny` saat ini mengizinkan semua user yang sudah login (pembatasan berbasis role adalah langkah masa depan, belum diimplementasikan).
- `app/Concerns/*ValidationRules.php` — trait validation rule yang dipakai bersama lintas Form Request untuk satu entity.
- `app/Actions/Fortify/` — action pembuatan user / reset password Fortify.
- `app/Providers/FortifyServiceProvider.php` — wiring/kustomisasi Fortify.
- Model memakai query scope beratribut `#[Scope]` (mis. `search`) yang dibangun dengan `whereAny` dan `addcslashes($term, '%_\\')` untuk meng-escape wildcard LIKE.
- Routes: `routes/web.php` (resource aplikasi, di dalam middleware group `auth`+`verified`) dan `routes/settings.php` (profile/security/appearance, kebutuhan middleware berbeda per aksi). Belum ada route API.

### Struktur frontend (`resources/js/`)

- `pages/` — komponen halaman Inertia, satu direktori per resource (`users`, `example1`, `example2`, `example3`, `example4`, `settings`, `auth`). Halaman selain `auth`/`settings` otomatis dapat app layout; set `Component.layout = { breadcrumbs: [...] }` di tiap halaman.
- `actions/` dan `routes/` — hasil generate Wayfinder; import fungsi route/controller dari sini alih-alih hardcode URL (`@/routes/{resource}`, `@/actions/...`). Jangan pernah menulis path string manual seperti `'/users'`.
- `components/ui/` — primitive shadcn; perlakukan sebagai shared, jangan ubah `sheet.tsx` dll. tanpa permintaan eksplisit.
- `components/content-side-panel.tsx` — primitive panel inline non-modal custom yang dipakai pola CRUD "panel inline" (berbeda dari Radix `Sheet`).
- `components/layouts/app`, `components/layouts/auth`, `components/layouts/settings` — shell layout.
- `components/data-grid/`, `components/data-table/`, `components/filters/` — dua paket tabel reusable (`DataGridClient`/`DataGridServer` berbasis TanStack Table v9, `DataTableClient`/`DataTableServer` berbasis primitive shadcn `Table` murni) plus komponen filter lepas dari tabel (`FacetedFilter`, `SelectBox`). Baca `.agents/rules/table-pattern.md` dan `.agents/rules/filter-pattern.md` sebelum menyentuh salah satunya — **jangan** bikin ulang popover filter atau komponen pagination/sort-header baru.
- `types/pagination.ts` — tipe `Paginated<T>` yang dipakai bersama; pakai ulang untuk resource paginated apa pun, jangan duplikasi bentuknya.

### `.agents/rules/` (penting — baca sebelum menyentuh CRUD, tabel, atau filter mana pun)

Beda dengan `.ai/rules` yang disebut di blok Boost guidelines di atas (direktori itu **tidak ada** di proyek ini — jangan cari `index.md` di sana), rules proyek ini ada di `.agents/rules/`. Tidak ada file index; tiap rule file menyatakan sendiri path-nya lewat frontmatter `globs:`. **Sebelum membuat/mengedit file yang cocok dengan salah satu glob di bawah, baca rule file itu dulu sampai selesai** — isinya keputusan yang sudah diambil dan trap yang sudah ditemukan, bukan sekadar saran.

| File                     | Kapan dibaca                                                                         | Poin penting                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `crud-pattern.md`        | Menambah/mengubah halaman list + CRUD Inertia mana pun                               | Spesifikasi mandiri lengkap: migration → model → policy → request → controller → route → halaman React → test. Ada **empat** varian UI create/edit/view (Halaman baru, Dialog, Sheet, Panel inline) — **tanya user dulu** mana yang dipakai, jangan asumsikan kecuali sudah dinyatakan di permintaan yang sama. Delete selalu `AlertDialog` apa pun variannya. Mode view (read-only) tidak pernah punya tombol Edit/Close di footer. |
| `table-pattern.md`       | Membangun/mengubah tampilan tabel/list apa pun                                       | Ada **dua** paket tabel yang sengaja hidup berdampingan — `data-grid` (TanStack Table v9) dan `data-table` (shadcn `Table` murni, tanpa TanStack). **Tanya user dulu** empat hal sekaligus: paket mana, header seperti apa (label/sort/dropdown), pagination seperti apa (advance/simple/tanpa — bisa show/hidden independen dari toolbar), dan filter apa. Jangan pasang TanStack langsung di halaman di luar `data-grid`.          |
| `filter-pattern.md`      | Butuh kontrol pilihan (filter toolbar tabel, select di form, filter di card/halaman) | Ada **dua** komponen filter — `FacetedFilter` (ada tombol Apply/Reset, cocok untuk filter server-side) dan `SelectBox` (langsung berlaku saat diklik, bisa jadi form control lewat prop `name`). **Tanya user dulu** yang mana. Jangan bikin popover multi-select atau combobox baru — pakai salah satu dari dua ini.                                                                                                                |
| `new-page-guidelines.md` | Scaffold resource baru dari nol                                                      | Checklist urutan kerja + trap yang sudah ditemukan (FK ke `users` itu bigint bukan UUID, audit columns via `Model::booted()`, `fresh()` pada model `SoftDeletes`, search scope vs SQLite `LIKE` + underscore, boolean field di form native Inertia). Tidak menduplikasi isi `crud-pattern.md`, hanya melengkapi.                                                                                                                     |

Konvensi sort/search/pagination yang berlaku lintas keempat rule di atas: whitelist `sort` via `in:`, debounce search 300ms di client, pakai `router.get(...)` dengan `preserveState`/`preserveScroll`/`replace: true`, hilangkan query param default dari URL, pakai Inertia `Link` (bukan `<a>` mentah atau `PaginationLink` shadcn) untuk pagination manual.

### Skill (`.agents/skills/`)

- `.agents/skills/` berisi 11 skill. **7 di antaranya** terdaftar di `boost.json` (`skills:` array) sebagai skill kurasi Laravel Boost yang disinkron otomatis (`infer-conventions`, `fortify-development`, `laravel-best-practices`, `wayfinder-development`, `pest-testing`, `inertia-react-development`, `tailwindcss-development`) — jangan edit isinya secara manual, akan tertimpa saat `artisan boost:update` jalan. **4 sisanya** (`frontend-design`, `grill-me`, `shadcn`, `ui-ux-pro-max`) ditambahkan terpisah, bukan dikelola Boost.
- Aktifkan skill yang relevan begitu domain pekerjaannya cocok — jangan tunggu sampai stuck (lihat "Skills Activation" di blok Boost guidelines di atas).
- `.claude/skills/*` adalah symlink ke `.agents/skills/*` — sama seperti `CLAUDE.md` yang merupakan symlink ke file `AGENTS.md` ini. Edit lewat `.agents/skills/`, bukan lewat symlink-nya.
