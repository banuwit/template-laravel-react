# Laravel + React Starter Kit

Starter kit full-stack yang menggabungkan **Laravel 13**, **Inertia.js v3**, dan **React 19** — SPA modern tanpa perlu membangun REST/GraphQL API terpisah. Autentikasi ditangani oleh [Laravel Fortify](https://laravel.com/docs/fortify) (termasuk 2FA), dan UI dibangun dengan [shadcn/ui](https://ui.shadcn.com/) di atas Tailwind CSS v4.

## Fitur

- **Autentikasi lengkap** — login, register, verifikasi email, reset password, konfirmasi password, dan two-factor authentication (2FA) dengan recovery codes.
- **Manajemen profil & keamanan** — update profil, ganti password, kelola 2FA di halaman Settings.
- **CRUD dengan 4 pola UI** (halaman baru, dialog, sheet, panel inline) — spesifikasi ada di `.agents/rules/crud-pattern.md`. Resource `users` adalah contoh hidup untuk pola halaman terpisah.
- **List page baku**: pencarian (debounced), sorting dengan whitelist kolom, dan pagination — semua sinkron dengan query string URL.
- **Typed routing end-to-end** lewat [Laravel Wayfinder](https://github.com/laravel/wayfinder) — tidak ada URL yang di-hardcode di frontend.
- Test suite [Pest](https://pestphp.com/) yang mencakup seluruh alur auth dan CRUD.

## Tech Stack

| Layer      | Teknologi                                               |
| ---------- | ------------------------------------------------------- |
| Backend    | PHP 8.5, Laravel 13, Laravel Fortify, Laravel Wayfinder |
| Frontend   | React 19, TypeScript, Inertia.js v3                     |
| Styling    | Tailwind CSS v4, shadcn/ui, Radix UI                    |
| Build tool | Vite                                                    |
| Database   | SQLite (default, mudah diganti ke MySQL/PostgreSQL)     |
| Testing    | Pest, PHPUnit                                           |
| Linting    | Laravel Pint, PHPStan (Larastan), ESLint, Prettier      |

## Persyaratan

- PHP ^8.3 (proyek berjalan di PHP 8.5)
- Composer 2
- Node.js 22+ dan npm
- Ekstensi PHP `sqlite3` (atau database lain sesuai konfigurasi)

## Instalasi

Clone repository, lalu jalankan:

```bash
composer setup
```

Perintah ini otomatis menjalankan:

1. `composer install` — install dependency PHP
2. Menyalin `.env.example` ke `.env`
3. `php artisan key:generate` — generate `APP_KEY`
4. `php artisan migrate --force` — membuat struktur database
5. `npm install` — install dependency JS
6. `npm run build` — build asset frontend

Atau jika ingin langkah manual:

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite   # jika pakai SQLite (default)
php artisan migrate
npm install
```

### Menjalankan development server

```bash
composer run dev
```

Perintah ini menjalankan server Laravel, queue listener, dan Vite dev server sekaligus (lewat `php artisan dev`). Aplikasi bisa diakses di `http://localhost:8000`.

Alternatif menjalankan Vite saja:

```bash
npm run dev
```

### Membuat user pertama

Registrasi lewat halaman `/register`, atau seed data awal:

```bash
php artisan db:seed
```

## Struktur Proyek

```
app/
├── Actions/Fortify/       # Aksi custom Fortify (create user, reset password)
├── Concerns/              # Trait validasi yang dipakai bersama antar Form Request
├── Http/
│   ├── Controllers/       # Controller resource (Users, Parameters, Settings)
│   ├── Requests/          # Satu Form Request per aksi (Index/Store/Update)
│   └── Middleware/
├── Models/                # Eloquent models
├── Policies/               # Otorisasi per model
└── Providers/FortifyServiceProvider.php

resources/js/
├── actions/ & routes/     # Hasil generate Wayfinder — jangan diedit manual
├── components/
│   ├── ui/                # Primitive shadcn/ui
│   ├── layouts/           # Shell layout (app, auth, settings)
│   └── content-side-panel.tsx  # Panel inline custom (non-modal)
├── pages/                 # Halaman Inertia, satu folder per resource
└── types/                 # Tipe TypeScript bersama (mis. Paginated<T>)

routes/
├── web.php                # Route resource utama
└── settings.php           # Route profil, keamanan, appearance

tests/
├── Feature/                # Test end-to-end per fitur (Pest)
└── Unit/
```

## Perintah yang Sering Dipakai

### Build & Development

| Perintah            | Keterangan                             |
| ------------------- | -------------------------------------- |
| `composer run dev`  | Jalankan app + queue + Vite dev server |
| `npm run dev`       | Vite dev server saja                   |
| `npm run build`     | Build asset frontend untuk production  |
| `npm run build:ssr` | Build termasuk bundle SSR              |

### Lint, Format, dan Type Checking

| Perintah                   | Keterangan                                           |
| -------------------------- | ---------------------------------------------------- |
| `composer run lint`        | Format kode PHP dengan Pint                          |
| `vendor/bin/pint --dirty`  | Pint hanya untuk file yang berubah                   |
| `npm run lint`             | ESLint (auto-fix)                                    |
| `npm run format`           | Prettier (auto-fix) untuk `resources/`               |
| `npm run types:check`      | Type checking TypeScript (`tsc --noEmit`)            |
| `composer run types:check` | Static analysis PHP dengan PHPStan/Larastan          |
| `composer run ci:check`    | Jalankan seluruh gate CI (lint, format, types, test) |

### Testing

| Perintah                                                    | Keterangan                                                  |
| ----------------------------------------------------------- | ----------------------------------------------------------- |
| `php artisan test --compact`                                | Jalankan seluruh test suite (Pest)                          |
| `php artisan test --compact --filter=nama_test`             | Jalankan test tertentu                                      |
| `php artisan test --compact tests/Feature/UserCrudTest.php` | Jalankan satu file test                                     |
| `composer run test`                                         | `config:clear` + lint check + types check + full test suite |

### Wayfinder (Route Generation)

Setiap kali menambah atau mengubah route di `routes/*.php`, regenerate fungsi TypeScript-nya:

```bash
php artisan wayfinder:generate --with-form --no-interaction
```

## Menambah Resource CRUD Baru

Proyek ini punya konvensi baku untuk halaman list + CRUD Inertia (lihat `.agents/rules/crud-pattern.md` untuk detail lengkap). Ringkasnya:

1. Scaffold controller, Form Request (`Index{Model}Request`), Policy, dan test lewat Artisan.
2. Daftarkan route di `routes/web.php` di dalam group `auth`+`verified`.
3. Pilih salah satu dari 4 pola UI create/edit/view (halaman baru, dialog, sheet, atau panel inline) — lihat `.agents/rules/crud-pattern.md`. Resource `users` adalah contoh hidup untuk pola halaman baru.
4. Generate ulang Wayfinder setelah menambah route.
5. Daftarkan menu navigasi di `app-sidebar.tsx` dan `app-header.tsx`.
6. Tulis test Pest dengan `assertInertia`.

## Environment Variables

Salin `.env.example` ke `.env` dan sesuaikan sesuai kebutuhan. Variabel penting:

| Variabel                                            | Keterangan                                                                                    |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `APP_URL`                                           | URL aplikasi (dipakai untuk generate link absolut)                                            |
| `DB_CONNECTION`                                     | Default `sqlite`; ubah ke `mysql`/`pgsql` bila perlu, lalu isi `DB_HOST`, `DB_DATABASE`, dll. |
| `SESSION_DRIVER`, `QUEUE_CONNECTION`, `CACHE_STORE` | Default `database` — bisa diganti ke `redis` untuk production                                 |
| `MAIL_MAILER`                                       | Default `log` untuk development; ganti ke SMTP/Postmark/Resend untuk production               |

## Kontribusi

1. Fork repository ini
2. Buat branch baru (`git checkout -b fitur/nama-fitur`)
3. Pastikan `composer run ci:check` lulus sebelum membuat pull request
4. Ajukan pull request dengan deskripsi perubahan yang jelas

## Lisensi

Proyek ini bersifat open-source dan dilisensikan di bawah MIT license.
