---
title: Memilih dan memakai komponen tabel (data-grid vs data-table)
description: Langkah wajib bertanya ke user sebelum membangun tabel - paket mana, header seperti apa, pagination seperti apa, filter apa. Plus template kode untuk tiap kombinasi.
globs:
    - resources/js/components/data-grid/**
    - resources/js/components/data-table/**
    - resources/js/pages/**
---

# Memilih dan memakai komponen tabel

Kapan dipakai: setiap kali membangun atau mengubah tampilan tabel/list di halaman Inertia.

Project ini punya **dua** paket tabel yang sengaja hidup berdampingan. Keduanya punya API yang sebentuk (client + server, toolbar, pagination), tapi fondasinya beda. Jangan asumsikan salah satunya — **tanya user**.

Untuk urutan scaffold backend (migration → model → policy → request → controller → route → test), lihat `crud-pattern.md`. Dokumen ini hanya soal lapisan tabelnya.

Placeholder kode di dokumen ini sama dengan `crud-pattern.md`: `{Model}`, `{resources}`, `{resource}`, `{prop}` (lihat legenda lengkap di sana). Dokumen ini **mandiri** — tidak bergantung pada resource contoh mana pun di codebase.

---

## Langkah 0 — tanya user empat hal (WAJIB)

Sebelum menulis satu baris kode tabel, tanyakan keempatnya sekaligus. Lewati pertanyaan **hanya** kalau user sudah menyatakannya di permintaan yang sama.

### 1. Paket mana?

| Opsi           | Fondasi                        | Pakai kalau                                                                                                                                          |
| -------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **data-grid**  | TanStack Table v9              | Butuh column visibility toggle, header dropdown, atau nanti mau virtualisasi / column resizing / row selection. Konsisten dengan project React lain. |
| **data-table** | Primitive shadcn `Table` murni | List biasa. Tidak menyeret TanStack, bundle lebih kecil, sel lebih gampang dikustomisasi, kode lebih mudah dibaca.                                   |

Kalau user tidak punya preferensi kuat, **sarankan `data-table`** — lebih sederhana untuk mayoritas halaman list. Naikkan ke `data-grid` hanya kalau salah satu fitur khas TanStack di atas benar-benar dibutuhkan.

### 2. Header seperti apa?

| Opsi                                          | data-grid                                                    | data-table                                                                         |
| --------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| **Label saja** (tidak bisa disort)            | `DataGridHeader`                                             | `DataTableHeader`                                                                  |
| **Header sort** (klik langsung membalik arah) | `DataGridHeaderSort`                                         | `DataTableHeaderSort`                                                              |
| **Header dropdown** (menu Asc/Desc eksplisit) | `DataGridHeaderDropdown` (+ submenu toggle visibility kolom) | `DataTableHeaderDropdown` (sort saja — `data-table` tidak punya visibility toggle) |

Kolom dianggap **Label saja** kalau `sortable` tidak diset. Kolom sortable memilih antara **Header sort** (default) dan **Header dropdown**:

- `data-grid`: pilih dengan memanggil komponen yang berbeda di `header: ({ column }) => ...` pada definisi kolom — lihat template di bawah.
- `data-table`: pilih lewat field `headerVariant` di `DataTableColumn` (`'sort'` default, atau `'dropdown'`), atau tetapkan default satu halaman lewat prop `headerVariant` di `DataTableClient` / `DataTableServer` (kolom yang set `headerVariant` sendiri tetap menang):

    ```tsx
    const columns: DataTableColumn<Listed{Model}>[] = [
        { key: 'name', header: 'Name', sortable: true, headerVariant: 'dropdown', cell: (record) => record.name },
        { key: 'email', header: 'Email', sortable: true, cell: (record) => record.email }, // pakai default halaman
    ];

    <DataTableServer columns={columns} paginated={{prop}} filters={filters} url={{resources}Index.url()} headerVariant="sort" />
    ```

Boleh dicampur dalam satu baris header: kolom `actions` dan kolom status biasanya label saja, kolom teks/tanggal pakai sort atau dropdown.

Submenu visibility kolom di dalam **Header dropdown** (`data-grid` saja) bisa dimatikan tanpa mengedit tiap kolom — cukup lewat prop `showHeaderVisibilityToggle={false}` saat memanggil `DataGridClient` / `DataGridServer` di halaman:

```tsx
<DataGridServer
    columns={columns}
    paginated={{prop}}
    filters={filters}
    url={{resources}Index.url()}
    showHeaderVisibilityToggle={false}
/>
```

`DataGridHeaderDropdown` juga menerima `showVisibilityToggle` sendiri per kolom (menang atas nilai halaman) untuk kasus campuran — mis. semua kolom disembunyikan submenu-nya kecuali satu.

### 3. Pagination seperti apa?

Kedua paket punya prop `pagination` yang sama bentuknya di `Client` **dan** `Server` — pilihan ini murni di sisi pemanggilan, tidak perlu mengedit kolom, dan berlaku juga saat query/tabelnya memang tidak dipaginasi:

| Opsi                  | Nilai `pagination` | Komponen             | Isi                                                                                                  |
| --------------------- | ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------- |
| **Advance** (default) | `'advance'`        | `*PaginationAdvance` | "Showing X to Y of Z", "Page N of M", tombol first / prev / next / last, plus pemilih ukuran halaman |
| **Simple**            | `'simple'`         | `*PaginationSimple`  | "Showing X to Y of Z", "Page N of M", tombol Prev / Next saja                                        |
| **Tanpa pagination**  | `'none'`           | —                    | Tidak merender kontrol pagination sama sekali                                                        |

```tsx
<DataGridClient columns={columns} data={rows} pagination="none" />
<DataGridServer columns={columns} paginated={{prop}} filters={filters} url={{resources}Index.url()} pagination="none" />
```

`pagination="none"` di `Client` (`DataTableClient` / `DataGridClient`) merender **semua** baris tanpa memotong halaman. Di `Server` (`DataTableServer` / `DataGridServer`) baris yang tampil tetap persis apa yang dikirim controller lewat `paginated.data` — jadi `'none'` di situ dipakai kalau query-nya memang sudah mengembalikan seluruh baris (bukan hasil `->paginate()`) dan kontrol pindah halaman tidak relevan. `toolbar` dan `pagination` independen: mengirim `toolbar` tanpa `pagination` tetap menampilkan pagination Advance (default), dan `pagination="none"` tanpa `toolbar` menyembunyikan pagination tapi search/facet toolbar tetap bisa dikirim terpisah.

### 4. Filter apa yang dibutuhkan?

| Kebutuhan                               | Cara                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| Tidak ada                               | Jangan kirim prop `toolbar`                                                          |
| Search box                              | `toolbar={{ searches: [{ key, placeholder }] }}`                                     |
| Filter pilihan (status, role, kategori) | `toolbar={{ facets: [{ key, title, options }] }}` → dirender sebagai `FacetedFilter` |
| Keduanya                                | Kirim `searches` dan `facets` sekaligus                                              |

Detail pilihan komponen filter (kapan `FacetedFilter`, kapan `SelectBox`) ada di **`filter-pattern.md`**. Tanyakan itu juga kalau user butuh filter.

### Pertanyaan kelima yang sering terlupa

**Data-nya dari mana?** Ini menentukan varian `Client` atau `Server` dan biasanya sudah ketahuan dari controller:

|                                                                         | Pakai                                |
| ----------------------------------------------------------------------- | ------------------------------------ |
| Controller mengirim seluruh baris sekali (`Model::all()`, config, enum) | `DataGridClient` / `DataTableClient` |
| Controller mengirim paginator (`->paginate()`)                          | `DataGridServer` / `DataTableServer` |

Jangan pakai varian `Client` di atas paginator — yang tampil hanya baris halaman itu saja, dan sort/search-nya cuma mengaduk satu halaman.

---

## data-table — template

Kolom didefinisikan sebagai data. Komponen yang merender `<TableRow>` / `<TableCell>`.

```tsx
import { DataTableServer } from '@/components/data-table/data-table-server';
import type { DataTableColumn } from '@/components/data-table/types';

type Listed{Model} = { id: number; name: string; status: string };

const columns: DataTableColumn<Listed{Model}>[] = [
    {
        key: 'name',
        header: 'Name',
        sortable: true,
        cell: (record) => <Link href={{resources}Show(record.id)}>{record.name}</Link>,
    },
    { key: 'status', header: 'Status', cell: (record) => <Badge>{record.status}</Badge> },
    {
        key: 'actions',
        header: '',
        align: 'right',
        cell: (record) => <RowActions record={record} />,
    },
];

<DataTableServer
    columns={columns}
    paginated={{prop}}
    filters={filters}
    url={{resources}Index.url()}
    rowKey={(record) => record.id}
    pagination="advance"
    defaults={{ sort: 'created_at', direction: 'desc' }}
    toolbar={{ searches: [{ key: 'search', placeholder: 'Search {resources}...' }] }}
/>
```

Varian client sama persis, hanya menukar `paginated`/`filters`/`url` dengan `data`:

```tsx
<DataTableClient
    columns={columns}
    data={rows}
    rowKey={(row) => row.id}
    pagination="simple"
/>
```

Field `DataTableColumn` yang tersedia: `key`, `header`, `cell`, `sortable`, `align`, `headClassName`, `cellClassName`, `sortValue`, `filterValue`, `searchable`.

## data-grid — template

Kolom memakai column helper TanStack.

```tsx
import { createColumnHelper } from '@tanstack/react-table';
import { DataGridServer } from '@/components/data-grid/data-grid-server';
import { DataGridHeader } from '@/components/data-grid/data-grid-header';
import { DataGridHeaderSort } from '@/components/data-grid/data-grid-header-sort';
import type { DataGridFeatures } from '@/components/data-grid/data-grid-features';

const columnHelper = createColumnHelper<DataGridFeatures, Listed{Model}>();

export const columns = columnHelper.columns([
    columnHelper.accessor('name', {
        header: ({ column }) => <DataGridHeaderSort column={column} title="Name" />,
    }),
    columnHelper.accessor('status', {
        header: () => <DataGridHeader title="Status" />,
    }),
    columnHelper.display({
        id: 'actions',
        cell: ({ row }) => <RowActions record={row.original} />,
    }),
]);
```

Kalau menambah kolom yang perlu filter facet, daftarkan `filterFn: 'multiValue'` — filter fn itu sudah terdaftar di `data-grid-features.ts`.

---

## Trap yang sudah ditemukan

- **`per_page` belum didukung backend.** Tidak ada controller di repo ini yang menerima `per_page`; semua hardcode `->paginate(10)`. Karena itu `DataTableServer` memberi prop `showPageSize` yang **default `false`** — pemilih ukuran halaman baru dinyalakan setelah controller-nya benar-benar memvalidasi dan memakai `per_page`. `DataGridServer` **selalu** menampilkan pemilih itu, jadi di halaman data-grid selektor itu saat ini tidak berefek sampai backend-nya menyusul.
- **Aturan key search di mode client `data-table`.** `SearchConfig.key` yang sama dengan `key` sebuah kolom akan memfilter kolom itu saja; key lain (mis. `'search'`) mencari ke **semua** kolom yang `searchable`. Pakai key generik kalau mau satu kotak search untuk beberapa kolom sekaligus.
- **Nilai kosong saat sorting client.** `data-table` selalu menaruh nilai kosong/`null` di bawah, baik ascending maupun descending — jangan "perbaiki" jadi ikut terbalik.
- **`rowKey` itu penting.** Tanpa itu `data-table` memakai index array sebagai React key, yang bikin state baris (checkbox, menu terbuka) meloncat saat data berubah urutan. Selalu kirim `rowKey` kalau baris punya id.
- **Jangan pasang TanStack langsung di halaman.** Kalau butuh TanStack, lewat `@/components/data-grid`. Kalau tidak, pakai `data-table`.
- **Jangan bikin komponen pagination / search / sort header baru.** Semuanya sudah ada di kedua paket dan bisa dipakai lepas dari `Client`/`Server` (mis. `DataTableHeaderSort` di tabel yang ditulis tangan).
