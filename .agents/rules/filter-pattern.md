---
title: Memilih dan memakai komponen filter (FacetedFilter vs SelectBox)
description: Langkah wajib bertanya ke user sebelum membangun filter atau select - komponen mana, single/multi/search, tampilan option seperti apa, dipakai di mana. Plus template kode.
globs:
    - resources/js/components/filters/**
    - resources/js/components/data-grid/**
    - resources/js/components/data-table/**
    - resources/js/pages/**
---

# Memilih dan memakai komponen filter

Kapan dipakai: setiap kali butuh kontrol pilihan — filter di toolbar tabel, select di form, filter di card atau halaman.

Semua ada di `@/components/filters` dan **tidak terikat tabel**. Jangan pernah membuat popover multi-select, dropdown pilihan, atau combobox baru — pakai yang sudah ada.

Placeholder kode di dokumen ini sama dengan `crud-pattern.md`: `{Model}`, `{resources}`, `{resource}`, `{prop}` (lihat legenda lengkap di sana). Dokumen ini **mandiri** — tidak bergantung pada resource contoh mana pun di codebase.

---

## Langkah 0 — tanya user tiga hal (WAJIB)

### 1. Komponen mana?

Perbedaan intinya adalah **kapan pilihan berlaku**:

|                        | `FacetedFilter`                                                       | `SelectBox`                                                                  |
| ---------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Berlakunya             | Ditunda — ada tombol **Apply** dan **Reset**                          | **Langsung** saat item diklik, tanpa Apply                                   |
| Trigger menampilkan    | Judul + badge jumlah terpilih                                         | Label terpilih (single) atau chip (multi)                                    |
| Cocok untuk            | Filter tabel, terutama server-side yang tiap perubahan memicu request | Form control, filter yang murah, select di card atau halaman                 |
| Bisa jadi form control | Tidak                                                                 | Ya — prop `name` merender hidden input                                       |
| Tampilan option        | Label + ikon                                                          | Label + ikon / emoji / dot warna / avatar / badge / deskripsi, plus grouping |

Aturan praktis:

- **Filter di toolbar tabel yang memicu request server** → `FacetedFilter`. Apply mencegah satu request per centang.
- **Select di form** → `SelectBox` dengan `name`.
- **Filter client-side yang murah, atau select di card/halaman** → `SelectBox`.

Kalau user ragu, tanyakan: _"filternya langsung berlaku saat diklik, atau ada tombol Apply dulu?"_ — jawabannya menentukan komponennya.

### 2. Satu pilihan, banyak pilihan, atau perlu search?

| Kebutuhan        | `SelectBox`               | `FacetedFilter`             |
| ---------------- | ------------------------- | --------------------------- |
| Single select    | default (`mode="single"`) | `variant="single"`          |
| Multi select     | `mode="multi"`            | `variant="multi"` (default) |
| Ada kotak search | `searchable`              | selalu ada                  |

### 3. Option-nya perlu tampil seperti apa?

Khusus `SelectBox`, semuanya lewat data — **jangan** bikin komponen baru per gaya:

| Kebutuhan                       | Field di `SelectOption`                         |
| ------------------------------- | ----------------------------------------------- |
| Ikon Lucide                     | `icon`                                          |
| Bendera / emoji                 | `emoji`                                         |
| Titik warna status              | `color` (kelas Tailwind, mis. `bg-emerald-500`) |
| Avatar user                     | `avatar: { src?, fallback }`                    |
| Badge di kanan                  | `badge: { label, variant? }`                    |
| Baris keterangan di bawah label | `description`                                   |
| Pengelompokan + pemisah         | `group`                                         |
| Option non-aktif                | `disabled`                                      |
| Kata kunci tambahan buat search | `keywords`                                      |

---

## Template

### Filter di toolbar tabel

Tidak dirender langsung — cukup deklarasikan di `toolbar.facets`, dan `data-grid` / `data-table` yang merendernya sebagai `FacetedFilter`:

```tsx
<DataTableServer
    columns={columns}
    paginated={{prop}}
    filters={filters}
    url={{resources}Index.url()}
    toolbar={{
        searches: [{ key: 'search', placeholder: 'Search {resources}...' }],
        facets: [
            {
                key: 'status',
                title: 'Status',
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'invited', label: 'Invited' },
                ],
            },
        ],
    }}
/>
```

Di mode server, `key` facet dikirim sebagai query param — pastikan Form Request memvalidasinya dan controller memakainya.

### Filter satu-pilihan di toolbar tabel (`SelectBox`, bukan `FacetedFilter`)

Kalau filternya cuma boleh satu nilai dan harus langsung berlaku begitu diklik (tanpa Apply), pakai `toolbar.selects` — **`DataGridServer` saja**, `DataGridClient` belum mengimplementasikan ini:

```tsx
<DataGridServer
    columns={columns}
    paginated={{prop}}
    filters={filters}
    url={{resources}Index.url()}
    toolbar={{
        selects: [
            {
                key: 'status',
                placeholder: 'Status',
                options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                ],
                clearable: true,
            },
        ],
    }}
/>
```

`DataGridServer` merender tiap entri `selects` sebagai `SelectBox` mode single, lalu tetap mengirim nilainya sebagai array satu elemen (`status[]=active`) ke backend — sama seperti `facets`. Jadi filter `whereIn` yang sudah ada di controller/Form Request **tidak perlu diubah** saat suatu facet multi-pilihan diturunkan jadi single-pick di UI, cukup pindahkan definisinya dari `toolbar.facets` ke `toolbar.selects`.

### SelectBox sebagai form control

```tsx
import { SelectBox } from '@/components/filters/select-box';

<SelectBox
    name="role_id"
    options={roles}
    value={roleId}
    onValueChange={setRoleId}
    invalid={!!errors.role_id}
    clearable
    searchable
    placeholder="Pilih role"
/>;
```

Prop `name` merender hidden input supaya nilainya ikut terkirim di Inertia `<Form>` native — single jadi `name`, multi jadi `name[]` (satu input per nilai, langsung terbaca Laravel sebagai array).

### SelectBox multi dengan option kaya

```tsx
const statuses: SelectOption[] = [
    {
        value: 'active',
        label: 'Active',
        color: 'bg-emerald-500',
        group: 'Aktif',
    },
    {
        value: 'trial',
        label: 'Trial',
        color: 'bg-amber-500',
        group: 'Aktif',
        description: 'Berakhir dalam 14 hari',
    },
    {
        value: 'banned',
        label: 'Banned',
        color: 'bg-red-500',
        group: 'Nonaktif',
        badge: { label: 'Admin', variant: 'destructive' },
    },
];

<SelectBox
    mode="multi"
    searchable
    options={statuses}
    value={selected}
    onValueChange={setSelected}
    maxChips={2}
/>;
```

### FacetedFilter dipakai lepas dari tabel

```tsx
<FacetedFilter
    title="Status"
    options={options}
    appliedValues={applied}
    onApply={setApplied}
    onClear={() => setApplied([])}
/>
```

Mode lain: `value` / `onValueChange` untuk controlled sederhana. Untuk option yang diambil dari server, tersedia `onOpenChange` (lazy load), `isLoading`, `isError`, `onSearchChange` (search didelegasikan ke server), `onLoadMore` / `hasMore` / `isFetchingMore` (infinite scroll).

---

## Trap yang sudah ditemukan

- **Jangan kirim `value` dan `appliedValues` bersamaan ke `FacetedFilter`.** `appliedValues` menang. Pilih satu mode: `value` + `onValueChange` (controlled) **atau** `appliedValues` + `onApply` + `onClear` (apply mode).
- **`SelectBox` mode multi tidak menutup popover** setiap kali memilih (`keepOpenOnSelect`, default `true`); mode single menutup otomatis. Jangan tambahkan tombol "Selesai" — itu mengubahnya jadi `FacetedFilter`.
- **`SelectOption` adalah superset `FilterOption`**, jadi daftar option yang sama bisa dipakai di kedua komponen. Yang sebaliknya tidak berlaku: adornment (`avatar`, `badge`, `description`, `color`) hanya dirender `SelectBox`.
- **Search `SelectBox` mencocokkan label, `value`, dan `keywords`.** Kalau `value`-nya id numerik, isi `keywords` supaya bisa dicari dengan kata yang manusiawi.
- **Jangan pakai `ui/select.tsx` (Radix) untuk multi-select atau select ber-search** — primitive itu tidak mendukung keduanya. Itu alasan `SelectBox` dibangun di atas Popover + Command.
- **Trigger `SelectBox` default `w-full`** (cocok untuk form control yang mau selebar field-nya). Begitu dipakai sebagai filter toolbar di sebelah `FacetedFilter` (yang triggernya selalu shrink-to-fit ke konten), `w-full` bikin dia melar memenuhi sisa baris — beda sendiri dari trigger lain di baris yang sama. `DataGridServer` sudah menambahkan `className="w-auto"` di setiap `SelectBox` yang dirender dari `toolbar.selects` supaya ukurannya konsisten dengan `FacetedFilter`; kalau merender `SelectBox` sebagai filter toolbar secara manual (bukan lewat `toolbar.selects`), tambahkan `className="w-auto"` yang sama.
- **Warna trigger `SelectBox` sengaja disamakan dengan `FacetedFilter`.** Placeholder, label terpilih, dan chevron semuanya warna teks penuh (bukan `text-muted-foreground`) — persis seperti judul dan chevron `FacetedFilter` yang tidak pernah redup. Ini berlaku di semua pemakaian `SelectBox` (filter toolbar maupun form control di province/city/menu), bukan cuma di konteks filter. Jangan kembalikan `text-muted-foreground` ke placeholder/chevron dengan alasan "biar kayak native select" — itu perubahan yang disengaja.
- **Icon clear (×) `SelectBox` warnanya `text-destructive`**, tanpa hover background — konsisten dengan elemen destructive lain di project (tombol delete, `DropdownMenuItem variant="destructive"`).
