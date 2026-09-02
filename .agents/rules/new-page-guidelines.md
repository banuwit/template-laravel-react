---
title: Checklist membuat halaman data-grid + CRUD baru
description: Urutan kerja reusable untuk resource baru (migration → ... → test), plus trap yang sudah ditemukan (audit columns, FK ke users, dsb).
globs:
    - app/Http/Controllers/**
    - app/Http/Requests/**
    - app/Policies/**
    - app/Models/**
    - app/Concerns/**
    - database/migrations/**
    - routes/web.php
    - resources/js/pages/**
    - resources/js/components/app-sidebar.tsx
    - resources/js/components/app-header.tsx
---

# Checklist halaman data-grid + CRUD baru

Dokumen ini adalah **checklist umum & reusable** untuk membuat resource baru (tabel database + halaman list + CRUD Inertia). Untuk detail pola list/CRUD (empat varian UI create/edit/view, kontrak grid frontend, konvensi sort/search/pagination), lihat `.agents/rules/crud-pattern.md` — dokumen ini **tidak menduplikasi** isi itu, hanya urutan kerja + trap.

## Urutan kerja

1. **Migration** — `php artisan make:migration create_{table}_table --no-interaction`, isi kolom, `php artisan migrate`.
2. **Model** — `php artisan make:model {Model} --factory`. Ikuti template Model di `crud-pattern.md` (A.5): atribut `#[Fillable]`/`#[Hidden]`, `casts()`, `#[Scope] search()`. Isi factory `definition()` dengan data realistis untuk kolom yang ada.
3. **Policy** — `php artisan make:policy {Model}Policy --model={Model} --no-interaction`. Default semua `return true;` (belum ada role) kecuali resource punya aturan khusus (lihat trap "flag sistem" di bawah).
4. **Form Requests** — `php artisan make:request {Models}/Index{Model}Request`, `Store{Model}Request`, `Update{Model}Request`. Kalau rules Store/Update identik, buat trait `app/Concerns/{Model}ValidationRules.php` (metode per field, mis. `nameRules()`, `emailRules()`, dipanggil dari method rules Store dan Update) alih-alih duplikasi.
5. **Controller** — `php artisan make:controller {Model}Controller --no-interaction`. Replikasi template Controller di `crud-pattern.md` (A.8): index/create/show/store/edit/update/destroy.
6. **Route** — daftarkan di `routes/web.php` dalam grup `auth`+`verified`. Varian halaman baru: `Route::resource(...)` penuh. Varian dialog/sheet/panel inline: `->only(['index','store','update','destroy'])`.
7. **Halaman React** — `resources/js/pages/{resources}/`. Ikuti varian UI yang dipilih user (lihat `crud-pattern.md` — **selalu tanya dulu** sebelum scaffold create/edit/view). Untuk lapisan tabelnya lihat `table-pattern.md`, untuk filternya `filter-pattern.md` — keduanya juga **wajib tanya user dulu**.
8. **Wayfinder** — `php artisan wayfinder:generate --with-form --no-interaction` setelah route terdaftar (jalankan **sebelum** menulis halaman React supaya import route langsung valid).
9. **Nav** — tambah entri di **kedua** `app-sidebar.tsx` dan `app-header.tsx` (href Wayfinder + ikon Lucide).
10. **Test** — `php artisan make:test --pest {Model}IndexTest`, `{Model}CrudTest`. Ikuti template tes di `crud-pattern.md` (Bagian D) (lihat trap soal `fresh()` di bawah kalau model pakai `SoftDeletes`).
11. **Finishing** — `vendor/bin/pint --format agent {file-file yang diubah}` (pakai `--dirty` hanya kalau project ini git repo), `npm run lint`, `npm run types:check`, lalu `composer run test` / `php artisan test --compact --filter={Model}` sebelum dianggap selesai.

## Trap yang sudah ditemukan

- **FK ke `users`**: `users.id` di project ini adalah **bigint auto-increment**, bukan UUID. Kolom FK seperti `created_by`/`updated_by`/`deleted_by` pakai `$table->foreignId(...)->nullable()->constrained('users')->nullOnDelete()`, **bukan** `foreignUuid()`.
- **Audit columns (`created_by`/`updated_by`/`deleted_by`)**: tidak ada trait/Observer bawaan. Pola yang dipakai: isi via `Model::booted()` (`creating`/`updating`/`deleting` events) memakai `Auth::id()`. Saat `SoftDeletes` dipakai, set `deleted_by` di listener `deleting` lalu panggil `$model->saveQuietly()` **sebelum** proses soft-delete berjalan — proses soft-delete Eloquent sendiri hanya meng-update kolom `deleted_at` lewat query builder langsung (bukan `save()` model), jadi atribut lain yang diubah setelah itu **tidak ikut tersimpan** kalau tidak di-`saveQuietly()` duluan.
- **`fresh()` pada model dengan `SoftDeletes` selalu mengembalikan instance, bukan `null`**, meskipun sudah di-soft-delete — `fresh()` sengaja memakai `newQueryWithoutScopes()` sehingga mengabaikan `SoftDeletingScope`. Assertion "soft delete berhasil" yang benar: `{Model}::find($id)` harus `null` (menerapkan scope default), dan `{Model}::withTrashed()->find($id)->trashed()` harus `true`. **Jangan** copy pola `expect($model->fresh())->toBeNull()` untuk model yang **tidak** pakai `SoftDeletes` ke model yang **pakai** `SoftDeletes` — pola itu hanya valid untuk model tanpa soft delete.
- **Search scope (`whereAny` + `addcslashes($term, '%_\\')`) dan SQLite**: SQLite tidak menerapkan backslash sebagai escape character pada `LIKE` secara default (beda dari MySQL) kecuali ada klausa `ESCAPE` eksplisit — yang tidak ditambahkan oleh pola `whereAny` ini. Akibatnya, search term yang **mengandung underscore** (`_`) tidak match secara literal di test (SQLite in-memory, dipakai untuk `php artisan test`). Ini bukan bug yang perlu diperbaiki (ikuti konvensi `crud-pattern.md` apa adanya) — cukup **hindari underscore di search term saat menulis test**, atau pastikan test tidak bergantung pada match/no-match presisi seputar underscore.
- **Boolean field di form (`Switch`/`Checkbox`) lewat Inertia `<Form>` native**: HTML native form **tidak mengirim field checkbox/switch yang unchecked** di FormData, jadi kalau field itu diberi `name` langsung pada komponen `Switch`, saat di-uncheck request tidak membawa key itu sama sekali dan default DB (bukan `false` eksplisit) yang dipakai. Pola aman: kontrol `Switch` dengan `useState` + `onCheckedChange`, lalu render `<input type="hidden" name="..." value={checked ? '1' : '0'} />` terpisah supaya nilai selalu terkirim eksplisit.
- **Field kompleks (JSON editor, native color picker, dll.)**: boleh ditunda dari form UI iterasi pertama selama kolom sudah siap di backend (migration/model/`fillable`) — jangan silently drop dari model, cukup belum ada input UI-nya. Catat sebagai TODO di PR/komentar kalau relevan.
- **Flag "data sistem/terkunci" (`is_system` atau serupa)**: kalau resource punya konsep ini, guard di Policy `delete()` (`return ! $model->is_system;`), bukan di controller — supaya `Gate::authorize('delete', ...)` otomatis melempar 403 tanpa logic tambahan di controller. Ini opsional — hanya relevan kalau resource memang punya flag semacam itu.

## Referensi contoh hidup (opsional)

Dokumen ini dan `crud-pattern.md` sudah **mandiri** — semua template kode yang dibutuhkan ada di `crud-pattern.md` Bagian A (backend) dan Bagian B/C (frontend), tidak bergantung pada resource contoh apa pun di codebase. Kalau resource seperti `users` masih ada di project ini, boleh dijadikan referensi hidup untuk pola dasar (halaman baru, tanpa soft delete/audit columns) — tapi kalau sudah tidak ada, ikuti template di `crud-pattern.md` langsung.
