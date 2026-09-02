---
title: Halaman list + CRUD Inertia
description: Spesifikasi lengkap dan mandiri untuk membangun halaman list terpaginasi plus CRUD. Empat pola UI create/edit/view - Halaman baru, Dialog, Sheet, Panel inline. Tanya user dulu, jangan mengasumsikan.
globs:
    - app/Http/Controllers/**
    - app/Http/Requests/**
    - app/Policies/**
    - app/Models/**
    - app/Enums/**
    - database/migrations/**
    - database/factories/**
    - routes/web.php
    - resources/js/pages/**
    - resources/js/components/app-sidebar.tsx
    - resources/js/components/app-header.tsx
    - resources/js/components/content-side-panel.tsx
    - resources/js/types/pagination.ts
    - tests/Feature/**
---

# Halaman list + CRUD Inertia

Kapan dipakai: menambah atau mengubah halaman list / data-grid Inertia, atau CRUD di atas list itu (create, edit, view, delete).

Dokumen ini **mandiri**. Semua struktur file, perintah scaffold, dan template kode ada di sini. Jangan bergantung pada resource contoh tertentu di codebase — kalau resource contoh sudah dihapus, dokumen ini tetap cukup untuk menghasilkan halaman yang identik.

Placeholder yang dipakai di seluruh dokumen:

| Placeholder   | Arti                                         | Contoh      |
| ------------- | -------------------------------------------- | ----------- |
| `{Model}`     | Nama model PascalCase                        | `Employee`  |
| `{Models}`    | Folder Form Request (plural PascalCase)      | `Employees` |
| `{resource}`  | Nama resource singular kebab-case            | `employee`  |
| `{resources}` | Nama resource plural kebab-case + nama route | `employees` |
| `{prop}`      | Nama prop paginator yang dikirim controller  | `employees` |

## Prinsip

- Jangan Filament atau generator CRUD. Lapisan tabelnya memakai komponen di `@/components/data-table` atau `@/components/data-grid` — lihat `table-pattern.md`, dan **tanya user dulu** paket mana.
- TanStack Table hanya lewat `@/components/data-grid`. Jangan pasang TanStack langsung di halaman.
- Tidak ada service class untuk listing. Logic `index` / `store` / `update` / `destroy` langsung di controller.
- Semua URL lewat Wayfinder. Tidak ada path string manual di React.
- Otorisasi selalu lewat Policy. Tidak ada endpoint tanpa `authorize()`.

## Lapisan tabel

Pemilihan komponen tabel punya dokumennya sendiri: **`table-pattern.md`**. Di situ ada langkah wajib bertanya ke user soal paket (`data-table` vs `data-grid`), bentuk header (label / sort / dropdown), bentuk pagination (advance / simple / tanpa), dan filter yang dibutuhkan — plus template kode tiap kombinasi.

Pemilihan komponen filter ada di **`filter-pattern.md`** (`FacetedFilter` vs `SelectBox`).

Yang tetap berlaku di dokumen ini:

- Controller mengirim paginator (`->paginate()`) plus prop `filters` yang memantulkan balik search / sort / direction yang sudah tervalidasi. Varian `*Server` yang mengurus `router.get` — jangan tulis ulang logic itu di halaman.
- Delete tetap `AlertDialog` di kolom aksi, apa pun paket tabel yang dipilih.

## Langkah 0 - tanya user pola UI mana

Sebelum scaffold route `create` / `edit` / `show`, halaman React, dialog, sheet, atau panel inline: **tanya user** pola mana yang dipakai.

| Opsi             | Ringkasan                                                         | Route resource                                 |
| ---------------- | ----------------------------------------------------------------- | ---------------------------------------------- |
| **Halaman baru** | Route + halaman terpisah `create.tsx` / `edit.tsx` / `show.tsx`   | `Route::resource(...)` penuh                   |
| **Dialog**       | Modal shadcn `Dialog` di atas list                                | `->only(['index','store','update','destroy'])` |
| **Sheet**        | Panel Radix `Sheet` (fixed, overlay) dari kanan                   | `->only(['index','store','update','destroy'])` |
| **Panel inline** | Panel non-modal di area konten layout; list menyusut jadi 2 kolom | `->only(['index','store','update','destroy'])` |

Aturan:

- Jangan mengasumsikan. Jangan mulai implementasi create/edit/view sampai ada jawaban.
- Lewati pertanyaan hanya jika user sudah menyatakan pilihannya di permintaan yang sama (misalnya "pakai panel inline").
- Tanya sekali untuk ketiga aksi (create, edit, view). Kalau user ingin campuran (misalnya create dialog, view halaman), ikuti itu — jangan mencampur tanpa izin.
- Delete **selalu** `AlertDialog` di list, apa pun pilihan create/edit/view.

---

# Bagian A - Backend (sama untuk keempat pola)

Satu-satunya perbedaan backend antar pola adalah **pendaftaran route** (lihat A.8).

## A.1 Scaffold Artisan

Jalankan semua dengan `--no-interaction`:

```bash
php artisan make:model {Model} -mf
php artisan make:controller {Model}Controller
php artisan make:policy {Model}Policy --model={Model}
php artisan make:request {Models}/Index{Model}Request
php artisan make:request {Models}/Store{Model}Request
php artisan make:request {Models}/Update{Model}Request
php artisan make:trait Concerns/{Model}ValidationRules
php artisan make:test --pest {Model}IndexTest
php artisan make:test --pest {Model}CrudTest
```

Kalau ada kolom enum, tambahkan juga:

```bash
php artisan make:enum Enums/{EnumName} --string
```

Catatan: `make:enum` tanpa prefix `Enums/` akan menaruh file di `app/` dengan namespace `App`. Enum harus berada di `app/Enums/` dengan namespace `App\Enums`.

## A.2 File backend yang dibuat

```
app/
  Concerns/{Model}ValidationRules.php     # rules dipakai bersama Store + Update
  Enums/{EnumName}.php                    # opsional, backed enum string
  Http/
    Controllers/{Model}Controller.php
    Requests/{Models}/Index{Model}Request.php
    Requests/{Models}/Store{Model}Request.php
    Requests/{Models}/Update{Model}Request.php
  Models/{Model}.php
  Policies/{Model}Policy.php
database/
  factories/{Model}Factory.php
  migrations/xxxx_create_{table}_table.php
routes/web.php                            # tambah satu baris resource
tests/Feature/{Model}IndexTest.php
tests/Feature/{Model}CrudTest.php
```

## A.3 Migration

- Index kolom yang dipakai `WHERE`, `ORDER BY`, atau `JOIN`.
- Kolom unique diberi `->unique()`.
- Kolom enum disimpan sebagai `string` dengan panjang wajar + `->default(...)` bila ada default.
- Selalu `$table->timestamps()` — list default sort `created_at`.
- `down()` cukup `Schema::dropIfExists(...)`.

```php
Schema::create('{table}', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->string('status', 20)->default('active')->index();
    $table->date('join_date')->index();
    $table->timestamps();
});
```

## A.4 Enum (bila ada kolom pilihan tetap)

Backed enum string, key TitleCase:

```php
<?php

namespace App\Enums;

enum Status: string
{
    case Active = 'active';
    case Inactive = 'inactive';
}
```

## A.5 Model

Wajib: `$table` eksplisit bila nama tabel tidak plural standar, casts enum/date, `#[Fillable]`, scope `search`.

```php
<?php

namespace App\Models;

use App\Enums\Status;
use Database\Factories\{Model}Factory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Status $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'status'])]
class {Model} extends Model
{
    /** @use HasFactory<{Model}Factory> */
    use HasFactory;

    protected $table = '{table}';

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => 'active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'join_date' => 'date',
            'status' => Status::class,
        ];
    }

    /**
     * @param  Builder<{Model}>  $query
     * @return Builder<{Model}>
     */
    #[Scope]
    protected function search(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->whereAny(['name', 'email'], 'like', $like);
    }
}
```

Aturan scope `search`:

- Wajib `addcslashes($term, '%_\\')` supaya `%` dan `_` tidak memperluas LIKE.
- Wajib return query apa adanya jika term kosong.
- Kalau resource punya relasi parent dan search harus mencakup parent, bungkus dengan closure dan `orWhereHas`:

```php
return $query->where(function (Builder $query) use ($like): void {
    $query->whereAny(['name', 'code'], 'like', $like)
        ->orWhereHas('parent', function (Builder $query) use ($like): void {
            $query->whereAny(['name', 'code'], 'like', $like);
        });
});
```

- Mirror default kolom DB ke `$attributes` model.

## A.6 Policy

`viewAny` mengizinkan semua user login untuk saat ini; perketat nanti dengan role. Jangan melewati otorisasi.

```php
<?php

namespace App\Policies;

use App\Models\{Model};
use App\Models\User;

class {Model}Policy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, {Model} ${resource}): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, {Model} ${resource}): bool
    {
        return true;
    }

    public function delete(User $user, {Model} ${resource}): bool
    {
        return true;
    }
}
```

## A.7 Form Requests

### Concern validation (dipakai bersama Store + Update)

```php
<?php

namespace App\Concerns;

use App\Enums\Status;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

trait {Model}ValidationRules
{
    /**
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function {resource}Rules(?int ${resource}Id = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                ${resource}Id === null
                    ? Rule::unique({Model}::class)
                    : Rule::unique({Model}::class)->ignore(${resource}Id),
            ],
            'status' => ['required', new Enum(Status::class)],
        ];
    }
}
```

### `Index{Model}Request`

Wajib: whitelist `sort` lewat `in:`, plus helper bertipe. Controller **tidak boleh** membaca query param mentah.

```php
<?php

namespace App\Http\Requests\{Models};

use App\Models\{Model};
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class Index{Model}Request extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', {Model}::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:255'],
            'sort' => ['nullable', 'in:name,email,status,created_at'],
            'direction' => ['nullable', 'in:asc,desc'],
        ];
    }

    public function search(): ?string
    {
        $search = $this->validated('search');

        return is_string($search) && $search !== '' ? $search : null;
    }

    /**
     * @return 'name'|'email'|'status'|'created_at'
     */
    public function sort(): string
    {
        $sort = $this->validated('sort');

        return in_array($sort, ['name', 'email', 'status', 'created_at'], true)
            ? $sort
            : 'created_at';
    }

    /**
     * @return 'asc'|'desc'
     */
    public function direction(): string
    {
        $direction = $this->validated('direction');

        return $direction === 'asc' ? 'asc' : 'desc';
    }
}
```

### `Store{Model}Request`

```php
class Store{Model}Request extends FormRequest
{
    use {Model}ValidationRules;

    public function authorize(): bool
    {
        return $this->user()?->can('create', {Model}::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->{resource}Rules();
    }
}
```

### `Update{Model}Request`

`authorize()` harus mengambil model dari route dan memeriksa tipenya (PHPStan level 7).

```php
class Update{Model}Request extends FormRequest
{
    use {Model}ValidationRules;

    public function authorize(): bool
    {
        ${resource} = $this->route('{resource}');

        return ${resource} instanceof {Model}
            && ($this->user()?->can('update', ${resource}) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        ${resource} = $this->route('{resource}');

        return $this->{resource}Rules(
            ${resource} instanceof {Model} ? ${resource}->id : null,
        );
    }
}
```

## A.8 Controller

`index` wajib: `select` kolom yang dipakai saja, `search`, `orderBy`, `paginate(10)`, `withQueryString`, `through`.

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\{Models}\Index{Model}Request;
use App\Http\Requests\{Models}\Store{Model}Request;
use App\Http\Requests\{Models}\Update{Model}Request;
use App\Models\{Model};
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class {Model}Controller extends Controller
{
    public function index(Index{Model}Request $request): Response
    {
        $actor = $request->user();

        ${prop} = {Model}::query()
            ->select(['id', 'name', 'email', 'status', 'created_at', 'updated_at'])
            ->search($request->search())
            ->orderBy($request->sort(), $request->direction())
            ->paginate(10)
            ->withQueryString()
            ->through(fn ({Model} $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('{resources}/index', [
            '{prop}' => ${prop},
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    public function store(Store{Model}Request $request): RedirectResponse
    {
        {Model}::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('{Model} created.')]);

        return to_route('{resources}.index');
    }

    public function update(Update{Model}Request $request, {Model} ${resource}): RedirectResponse
    {
        ${resource}->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('{Model} updated.')]);

        return to_route('{resources}.index');
    }

    public function destroy({Model} ${resource}): RedirectResponse
    {
        Gate::authorize('delete', ${resource});

        ${resource}->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('{Model} deleted.')]);

        return to_route('{resources}.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord({Model} $record, ?User $actor): array
    {
        return [
            'id' => $record->id,
            'name' => $record->name,
            'email' => $record->email,
            'status' => $record->status->value,
            'created_at' => $record->created_at?->toIso8601String(),
            'updated_at' => $record->updated_at?->toIso8601String(),
            'can_delete' => $actor !== null && $actor->can('delete', $record),
        ];
    }
}
```

Aturan `through()`:

- Tanggal-waktu sebagai ISO-8601 (`toIso8601String()`), tanggal murni sebagai `toDateString()`.
- Enum dikirim sebagai `->value` (string), bukan objek.
- Selalu ikutkan `can_delete`.
- Untuk pola Dialog / Sheet / Panel inline, ikutkan juga `updated_at` karena mode view memakai data baris — tidak ada request show terpisah.
- Jangan pernah kirim kolom rahasia (password, token).

Method tambahan **hanya** untuk pola Halaman baru — lihat C.1.

## A.9 Route

Di dalam group `auth` + `verified` yang sudah ada di `routes/web.php`.

Halaman baru:

```php
Route::resource('{resources}', {Model}Controller::class);
```

Dialog / Sheet / Panel inline:

```php
Route::resource('{resources}', {Model}Controller::class)->only(['index', 'store', 'update', 'destroy']);
```

Jangan `Route::inertia()` untuk halaman yang butuh data dari query string.

## A.10 Factory dan seeder

Factory memakai `fake()`; enum diambil dari `Cases`:

```php
public function definition(): array
{
    return [
        'name' => fake()->name(),
        'email' => fake()->unique()->safeEmail(),
        'status' => fake()->randomElement(Status::cases()),
    ];
}
```

Seed data contoh di `database/seeders/DatabaseSeeder.php`, **bukan** di migration.

## A.11 Wayfinder

Setelah menambah atau mengubah route:

```bash
php artisan wayfinder:generate --with-form --no-interaction
```

Ini menghasilkan `resources/js/actions/**` dan `resources/js/routes/**`. Jangan mengedit file hasil generate.

## A.12 Navigasi

Tambah item di **kedua** file, dengan href Wayfinder dan ikon Lucide:

- `resources/js/components/app-sidebar.tsx` → array `mainNavItems`
- `resources/js/components/app-header.tsx` → array `mainNavItems`

```tsx
import { index as {resources} } from '@/routes/{resources}';

{
    title: '{Judul}',
    href: {resources}(),
    icon: Layers,
},
```

---

# Bagian B - Frontend list (sama untuk keempat pola)

## B.1 Lokasi dan layout

Halaman index di `resources/js/pages/{resources}/index.tsx`. App layout otomatis untuk semua halaman di luar `auth/` dan `settings/`.

Breadcrumb statis dipasang lewat properti `layout` di komponen:

```tsx
{Model}Index.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: '{Judul}', href: {resources}Index() },
    ],
};
```

Breadcrumb dinamis (butuh data record, mis. halaman show/edit) memakai `setLayoutProps({ breadcrumbs: [...] })` di dalam komponen.

## B.2 Kontrak tipe

Paginator selalu diketik dengan `Paginated<T>` dari `@/types` (didefinisikan di `resources/js/types/pagination.ts`). Jangan menduplikasi bentuknya.

```tsx
import type { Paginated } from '@/types';

type Listed{Model} = {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
    can_delete: boolean;
};

type SortColumn = 'name' | 'email' | 'status' | 'created_at';

type {Model}Filters = {
    search: string;
    sort: SortColumn;
    direction: 'asc' | 'desc';
};

type Props = {
    {prop}: Paginated<Listed{Model}>;
    filters: {Model}Filters;
};
```

Nilai `SortColumn` harus sama persis dengan whitelist `in:` di `Index{Model}Request`.

## B.3 List, sort, search, filter, pagination

Ditangani sepenuhnya oleh `@/components/data-table` atau `@/components/data-grid` — **jangan** menulis tangan helper `visit`, `SortableHead`, debounce search, atau markup pagination. Lihat `table-pattern.md` (wajib tanya user paket mana + bentuk header/pagination) dan `filter-pattern.md` (untuk facet/select).

Field `{Model}Filters` di B.2 di atas adalah kontrak yang dikonsumsi langsung oleh prop `filters` pada `DataTableServer` / `DataGridServer`. Kunci query yang sama dengan default (`search` kosong, `sort` default, `direction` default) dihilangkan dari URL otomatis oleh komponen itu — tidak perlu logic tambahan di halaman.

## B.4 Struktur halaman index

Susunan shadcn: `Heading` + tombol Create, lalu komponen tabel dari `table-pattern.md` (yang membawa toolbar-nya sendiri: search/facet, tabel, dan pagination sebagai satu blok).

Pakai `gap-*`, bukan `space-y-*`. Pakai token semantik (`text-muted-foreground`), bukan warna mentah.

```tsx
<div className="flex h-full flex-1 flex-col gap-6 p-4">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <Heading
            variant="small"
            title="{Judul}"
            description="Search, sort, and manage {resources}."
        />

        {/* tombol Create - bentuknya beda per pola, lihat Bagian C */}
    </div>

    {/* Komponen tabel dari table-pattern.md - toolbar + Table + pagination
        sudah satu blok, tidak perlu Card/CardHeader/CardFooter terpisah
        kecuali user secara eksplisit minta tabel dibungkus Card. */}
</div>
```

## B.5 Empty state

Dua salinan berbeda: "belum ada data" versus "tidak ada hasil search/filter". Keempat komponen (`DataTableClient`/`Server`, `DataGridClient`/`Server`) punya dua pasang prop untuk ini — **jangan** menggambar `<Empty>` manual, komponennya sudah merender ini sendiri dan menentukan sendiri pasangan mana yang tampil:

```tsx
<DataTableServer
    /* ...props lain */
    emptyTitle="No {resources} yet"
    emptyDescription="Create a record to add the first one to this list."
    emptyFilteredTitle="No matching {resources}"
    emptyFilteredDescription="Try a different search term, or clear the search to see every record."
/>
```

`emptyFilteredTitle`/`emptyFilteredDescription` boleh dihilangkan — jatuh balik ke `emptyTitle`/`emptyDescription`. Tombol Create untuk kasus "belum ada data" tetap ditaruh di baris `Heading` (lihat B.4) — komponen tabel tidak punya slot tombol Create di dalam empty state-nya.

## B.6 Delete button (wajib, semua pola)

Selalu `AlertDialog`, di-colocate di folder page sebagai `{resource}-delete-button.tsx`.

```tsx
import { Form } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import {Model}Controller from '@/actions/App/Http/Controllers/{Model}Controller';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    record: {
        id: number;
        name: string;
    };
    variant?: ComponentProps<typeof Button>['variant'];
    size?: ComponentProps<typeof Button>['size'];
};

export default function {Model}DeleteButton({
    record,
    variant = 'ghost',
    size = 'sm',
}: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant} size={size}>
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {record.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently remove this record. This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Form {...{Model}Controller.destroy.form(record.id)}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                {processing && (
                                    <Spinner data-icon="inline-start" />
                                )}
                                Delete record
                            </Button>
                        )}
                    </Form>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
```

## B.7 Form create/edit

Satu komponen form dipakai create dan edit. Untuk pola overlay (Dialog / Sheet / Panel), form menerima `onCancel` + `onSuccess`; untuk Halaman baru, form memakai `Link` Cancel ke index.

```tsx
import { Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

type {Model}FormValues = {
    name: string;
    email: string;
};

type Props = {
    form: { action: string; method: 'post' };
    record?: {Model}FormValues;
    submitLabel: string;
    onCancel: () => void;
    onSuccess: () => void;
    idPrefix?: string;
};

export default function {Model}Form({
    form,
    record,
    submitLabel,
    onCancel,
    onSuccess,
    idPrefix = '{resource}',
}: Props) {
    return (
        <Form
            {...form}
            disableWhileProcessing
            className="flex flex-col gap-4"
            resetOnSuccess={!record}
            options={{ preserveScroll: true, preserveState: true }}
            onSuccess={onSuccess}
        >
            {({ processing, errors }) => (
                <>
                    <FieldGroup>
                        <Field data-invalid={errors.name ? true : undefined}>
                            <FieldLabel htmlFor={`${idPrefix}-name`}>
                                Name
                            </FieldLabel>
                            <Input
                                id={`${idPrefix}-name`}
                                name="name"
                                defaultValue={record?.name}
                                required
                                autoFocus
                                aria-invalid={errors.name ? true : undefined}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>
                    </FieldGroup>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Spinner data-icon="inline-start" />}
                            {submitLabel}
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}
```

Aturan form:

- `options={{ preserveState: true, preserveScroll: true }}` wajib untuk pola overlay — kalau validasi gagal, overlay tetap terbuka.
- `resetOnSuccess={!record}` — reset hanya di mode create.
- `idPrefix` mencegah tabrakan `id` saat beberapa overlay dirender bersamaan di satu halaman.
- Field pilihan tetap memakai `<select>` bergaya atau shadcn `Select`; nilainya harus sama persis dengan `value` enum backend.
- Setiap field: `Field` + `FieldLabel` + kontrol + `FieldError`, dengan `data-invalid` dan `aria-invalid`.

## B.8 Mode view (read-only) - aturan lintas pola

Edit **hanya** dipicu dari kolom aksi di list, bukan dari tampilan view.

| Pola             | Di view                                                      | Cara menutup / kembali                             |
| ---------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| **Dialog**       | Tanpa `DialogFooter`; tanpa tombol Close atau Edit           | Tombol X dialog + klik luar overlay                |
| **Sheet**        | Tanpa `SheetFooter`; tanpa tombol Close atau Edit            | Tombol X sheet + klik luar overlay                 |
| **Panel inline** | Tanpa `ContentSidePanelFooter`; tanpa tombol Close atau Edit | Tombol X di `ContentSidePanelHeader`               |
| **Halaman baru** | Tanpa tombol Edit di `show.tsx`                              | Tombol **Back to {resources}** di area aksi header |

View hanya menampilkan detail memakai `dl` + komponen `DetailRow`, dengan `Badge` untuk status/kode:

```tsx
function DetailRow({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
            <dt className="w-28 shrink-0 text-sm text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm font-medium">{children}</dd>
        </div>
    );
}
```

Create dan edit tetap punya footer form (Cancel + submit).

---

# Bagian C - Empat pola create/edit/view

## C.1 Pola Halaman baru

File yang dibuat:

```
resources/js/pages/{resources}/
  index.tsx
  create.tsx
  edit.tsx
  show.tsx
  {resource}-form.tsx
  {resource}-delete-button.tsx
```

Route: `Route::resource('{resources}', {Model}Controller::class)` penuh.

Controller butuh method tambahan `create`, `show`, `edit`, masing-masing `Gate::authorize(...)` lalu `Inertia::render`:

```php
public function create(): Response
{
    Gate::authorize('create', {Model}::class);

    return Inertia::render('{resources}/create');
}

public function show(Request $request, {Model} ${resource}): Response
{
    Gate::authorize('view', ${resource});

    $actor = $request->user();

    return Inertia::render('{resources}/show', [
        '{resource}' => [
            'id' => ${resource}->id,
            'name' => ${resource}->name,
            'created_at' => ${resource}->created_at?->toIso8601String(),
            'updated_at' => ${resource}->updated_at?->toIso8601String(),
            'can_update' => $actor !== null && $actor->can('update', ${resource}),
            'can_delete' => $actor !== null && $actor->can('delete', ${resource}),
        ],
    ]);
}

public function edit({Model} ${resource}): Response
{
    Gate::authorize('update', ${resource});

    return Inertia::render('{resources}/edit', [
        '{resource}' => [
            'id' => ${resource}->id,
            'name' => ${resource}->name,
        ],
    ]);
}
```

Index memakai Inertia `Link` + Wayfinder ke create / show / edit. Nama di baris tabel menautkan ke show. Tombol aksi memakai `asChild` + `Link`:

```tsx
<Button variant="ghost" size="sm" asChild>
    <Link href={{resources}Show(record.id)}>
        <Eye data-icon="inline-start" />
        View
    </Link>
</Button>
```

`create.tsx` — `Card` berisi `{Model}Form`, breadcrumb statis via properti `layout`.

`edit.tsx` — sama, tetapi breadcrumb dinamis via `setLayoutProps` karena judulnya memakai nama record.

`show.tsx` — header aksi berisi tombol **Back to {resources}** (`variant="outline"`, `Link` ke index) dan delete button bila `can_delete`. **Tidak ada** tombol Edit. Jangan menambah `CardFooter` hanya untuk tombol back.

```tsx
<div className="flex flex-wrap items-center gap-2">
    <Button variant="outline" asChild>
        <Link href={{resources}Index()}>
            <ChevronLeft data-icon="inline-start" />
            Back to {resources}
        </Link>
    </Button>
    {record.can_delete && (
        <{Model}DeleteButton
            record={record}
            variant="outline"
            size="default"
        />
    )}
</div>
```

## C.2 Pola Dialog

File yang dibuat:

```
resources/js/pages/{resources}/
  index.tsx
  {resource}-dialogs.tsx
  {resource}-form.tsx
  {resource}-delete-button.tsx
```

Jangan membuat `create.tsx` / `edit.tsx` / `show.tsx`. Jangan daftarkan route GET create/edit/show.

State di halaman index:

```tsx
type {Model}Dialog =
    | { type: 'closed' }
    | { type: 'create' }
    | { type: 'edit'; record: Listed{Model} }
    | { type: 'view'; record: Listed{Model} };

const [dialog, setDialog] = useState<{Model}Dialog>({ type: 'closed' });

function closeDialog() {
    setDialog({ type: 'closed' });

    if (Object.keys(page.props.errors ?? {}).length > 0) {
        visit(filters);
    }
}
```

`closeDialog` membersihkan error validasi yang tertinggal dengan melakukan visit ulang — tanpa ini, error lama muncul lagi saat dialog dibuka berikutnya.

Render di akhir halaman index:

```tsx
<{Model}Dialogs
    dialog={dialog}
    onDialogChange={(next) => {
        if (next.type === 'closed') {
            closeDialog();

            return;
        }

        setDialog(next);
    }}
/>
```

Tombol Create di header dan empty state memanggil `setDialog({ type: 'create' })` — bukan `Link` ke route create.

`{resource}-dialogs.tsx` — tiga `Dialog` terpisah (create, edit, view). `DialogTitle` wajib ada di setiap dialog. `DialogContent` memakai `className="max-h-[90vh] overflow-y-auto sm:max-w-md"` supaya form panjang tetap bisa di-scroll.

```tsx
export default function {Model}Dialogs({ dialog, onDialogChange }: Props) {
    const close = () => onDialogChange({ type: 'closed' });

    return (
        <>
            <Dialog
                open={dialog.type === 'create'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New {Model}</DialogTitle>
                        <DialogDescription>...</DialogDescription>
                    </DialogHeader>
                    <{Model}Form
                        form={{Model}Controller.store.form()}
                        submitLabel="Add New {Model}"
                        onCancel={close}
                        onSuccess={close}
                        idPrefix="{resource}-create"
                    />
                </DialogContent>
            </Dialog>

            {/* edit: sama, pakai key={dialog.record.id} dan update.form(id) */}

            <Dialog
                open={dialog.type === 'view'}
                onOpenChange={(open) => {
                    if (!open) {
                        close();
                    }
                }}
            >
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
                    {dialog.type === 'view' && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{dialog.record.name}</DialogTitle>
                                <DialogDescription>Details.</DialogDescription>
                            </DialogHeader>
                            {/* dl + DetailRow, tanpa DialogFooter */}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
```

Dialog edit wajib `key={dialog.record.id}` supaya `defaultValue` form ikut berganti saat pindah record.

Mode view memakai data baris hasil `through()`. Jangan fetch halaman show.

## C.3 Pola Sheet (Radix)

File yang dibuat:

```
resources/js/pages/{resources}/
  index.tsx
  {resource}-sheets.tsx
  {resource}-form.tsx
  {resource}-delete-button.tsx
```

Jangan membuat `create.tsx` / `edit.tsx` / `show.tsx`. Jangan daftarkan route GET create/edit/show.

Sheet bersifat **modal** (default Radix): overlay menutupi halaman, panel fixed ke viewport kanan. Pilih ini bila user ingin fokus penuh pada form tanpa interaksi list di belakang.

State di index sama persis dengan pola Dialog, hanya penamaannya `sheet` / `setSheet` / `closeSheet`.

`{resource}-sheets.tsx` — satu komponen panel internal dipakai ulang untuk tiga mode. Kelas layout wajib konsisten:

```tsx
const sheetContentClassName = 'gap-0 overflow-y-auto p-0 sm:max-w-md';
const sheetHeaderClassName = 'gap-1 border-b px-4 py-4 pr-12 text-left';
const sheetBodyClassName = 'flex flex-col gap-4 p-4';
const sheetFooterClassName =
    'mt-auto gap-2 border-t px-4 py-4 sm:flex-row sm:justify-end';

function {Model}SheetPanel({
    open,
    onOpenChange,
    title,
    description,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className={sheetContentClassName}>
                <SheetHeader className={sheetHeaderClassName}>
                    <SheetTitle>{title}</SheetTitle>
                    {description ? (
                        <SheetDescription>{description}</SheetDescription>
                    ) : null}
                </SheetHeader>
                <div className={cn(sheetBodyClassName, 'flex-1')}>
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
}
```

- `pr-12` di header memberi ruang untuk tombol X bawaan Radix.
- `SheetTitle` wajib ada (accessibility Radix).
- Footer `border-t` hanya dipakai bila form dipisah dari body; mode view **tidak** punya footer.
- **Jangan ubah** `@/components/ui/sheet.tsx` kecuali user meminta eksplisit — itu komponen shadcn shared.

## C.4 Pola Panel inline

File yang dibuat:

```
resources/js/pages/{resources}/
  index.tsx
  {resource}-sheets.tsx        # wrapper layout + konten panel
  {resource}-form.tsx
  {resource}-delete-button.tsx
```

Jangan membuat `create.tsx` / `edit.tsx` / `show.tsx`. Jangan daftarkan route GET create/edit/show.

**Bukan** Radix Sheet. Pakai primitive `@/components/content-side-panel` (non-modal, hidup di dalam area konten app layout). Panel hanya menempati area `{children}` layout, jadi header breadcrumb tetap penuh lebar dan list menyusut jadi grid 2 kolom saat panel terbuka.

API `@/components/content-side-panel`:

| Export                        | Props penting                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `ContentSidePanelLayout`      | `open: boolean`, `panel: ReactNode`, `children: ReactNode`, `panelLabel?: string`, `className?: string` |
| `ContentSidePanelHeader`      | `onClose?: () => void` (merender tombol X di kanan atas)                                                |
| `ContentSidePanelTitle`       | `h2` bergaya                                                                                            |
| `ContentSidePanelDescription` | `p` muted                                                                                               |
| `ContentSidePanelBody`        | area scroll `flex-1`                                                                                    |
| `ContentSidePanelFooter`      | hanya untuk create/edit, **bukan** view                                                                 |

Perbedaan struktural dari Dialog/Sheet: `ContentSidePanelLayout` **membungkus konten index**, jadi JSX halaman index bersarang di dalamnya:

```tsx
return (
    <>
        <Head title="{Judul}" />

        <{Model}Sheets
            sheet={sheet}
            onSheetChange={(next) => {
                if (next.type === 'closed') {
                    closeSheet();

                    return;
                }

                setSheet(next);
            }}
        >
            <div className="flex min-h-0 flex-1 flex-col gap-6 p-4">
                {/* seluruh isi halaman index */}
            </div>
        </{Model}Sheets>
    </>
);
```

Perhatikan: container memakai `min-h-0 flex-1` (bukan `h-full`) supaya grid layout menyusut dengan benar.

Wrapper panel:

```tsx
export default function {Model}Sheets({
    sheet,
    onSheetChange,
    children,
}: Props) {
    const close = () => onSheetChange({ type: 'closed' });
    const isOpen = sheet.type !== 'closed';

    return (
        <ContentSidePanelLayout
            open={isOpen}
            panelLabel={
                sheet.type === 'create'
                    ? 'Add New {Model}'
                    : sheet.type === 'edit'
                      ? 'Edit {Model}'
                      : sheet.type === 'view'
                        ? 'View {Model}'
                        : '{Model} panel'
            }
            panel={
                isOpen ? (
                    <{Model}PanelContent sheet={sheet} onClose={close} />
                ) : null
            }
        >
            {children}
        </ContentSidePanelLayout>
    );
}
```

Konten panel adalah satu komponen yang bercabang per mode, masing-masing merender `ContentSidePanelHeader` (dengan `onClose`) + `ContentSidePanelBody`:

```tsx
function {Model}PanelContent({
    sheet,
    onClose,
}: {
    sheet: {Model}Sheet;
    onClose: () => void;
}) {
    if (sheet.type === 'create') {
        return (
            <>
                <ContentSidePanelHeader onClose={onClose}>
                    <ContentSidePanelTitle>Add New {Model}</ContentSidePanelTitle>
                    <ContentSidePanelDescription>...</ContentSidePanelDescription>
                </ContentSidePanelHeader>
                <ContentSidePanelBody>
                    <{Model}Form
                        form={{Model}Controller.store.form()}
                        submitLabel="Add New {Model}"
                        onCancel={onClose}
                        onSuccess={onClose}
                        idPrefix="{resource}-create"
                    />
                </ContentSidePanelBody>
            </>
        );
    }

    // edit: sama, pakai key={sheet.record.id} + update.form(id)
    // view: ContentSidePanelBody berisi dl + DetailRow, tanpa footer

    return null;
}
```

Aturan khusus panel inline:

- Klik di luar panel **tidak** menutup panel (non-modal). Tutup lewat tombol X di header atau Cancel pada form.
- Animasi buka/tutup sudah ada di `ContentSidePanelLayout`. **Jangan** menambah fade saat berganti mode (create ↔ edit ↔ view) — konten berganti langsung.
- **Jangan ubah** `@/components/ui/sheet.tsx` untuk pola ini. Kalau butuh kemampuan baru, perluas `content-side-panel.tsx`.

## C.5 Perbandingan Sheet versus Panel inline

|                             | Sheet                           | Panel inline                                |
| --------------------------- | ------------------------------- | ------------------------------------------- |
| Komponen                    | `@/components/ui/sheet`         | `@/components/content-side-panel`           |
| Posisi                      | Fixed portal, overlay viewport  | Inline di area konten layout                |
| Header app                  | Tertutup overlay                | Tetap penuh lebar                           |
| Body list                   | Lebar penuh di belakang overlay | Menyusut jadi 2 kolom                       |
| Interaksi list saat terbuka | Diblokir overlay                | Tetap bisa (search, pagination, baris lain) |
| Tutup dengan klik luar      | Bisa                            | Tidak — hanya tombol eksplisit              |
| Struktur JSX                | Sibling setelah konten index    | Membungkus konten index                     |

---

# Bagian D - Tes

Pakai Pest, `RefreshDatabase`, dan `AssertableInertia as Assert`. Helper payload yang dipakai lintas file boleh ditaruh di `tests/Pest.php`.

## D.1 `{Model}IndexTest` (wajib, semua pola)

Minimum enam tes:

1. Tamu diarahkan ke login.
2. User terautentikasi melihat `component('{resources}/index')`, jumlah baris benar, urutan default `created_at desc`, `can_delete` true, filter default (`sort=created_at`, `direction=desc`).
3. Search mempersempit hasil dan `filters.search` terisi.
4. Sort sesuai whitelist mengubah urutan.
5. Pagination: 11 record → 10 baris, `total=11`, `last_page=2`, `current_page=1`.
6. Kolom sort tidak valid → redirect + `assertSessionHasErrors('sort')`.

```php
test('guests are redirected to the login page', function () {
    $this->get(route('{resources}.index'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit the {resources} list', function () {
    $user = User::factory()->create();
    $older = {Model}::factory()->create(['created_at' => now()->subMinute()]);
    $newer = {Model}::factory()->create(['created_at' => now()]);

    $this->actingAs($user)
        ->get(route('{resources}.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('{resources}/index')
            ->has('{prop}.data', 2)
            ->where('{prop}.data.0.id', $newer->id)
            ->where('{prop}.data.0.can_delete', true)
            ->where('{prop}.data.1.id', $older->id)
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc'),
        );
});

test('invalid sort columns are rejected', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->from(route('{resources}.index'))
        ->get(route('{resources}.index', ['sort' => 'id']))
        ->assertRedirect(route('{resources}.index'))
        ->assertSessionHasErrors('sort');
});
```

## D.2 `{Model}CrudTest`

Berlaku untuk semua pola: guest tidak bisa store; store berhasil; validasi unique gagal; validasi enum/format gagal; update berhasil; update mengabaikan unique miliknya sendiri; destroy berhasil.

Untuk pola **Dialog / Sheet / Panel inline**, tambahkan tes bahwa route halaman tidak terdaftar, dan pastikan redirect kegagalan validasi kembali ke index:

```php
test('create, show, and edit {resources} pages are not registered', function () {
    expect(Route::has('{resources}.create'))->toBeFalse()
        ->and(Route::has('{resources}.show'))->toBeFalse()
        ->and(Route::has('{resources}.edit'))->toBeFalse();
});
```

Untuk pola **Halaman baru**, gantilah dengan tes bahwa tamu diblokir di `create` / `show`, user terautentikasi bisa membuka ketiga halaman, dan kegagalan validasi redirect kembali ke form.

## D.3 Menjalankan verifikasi

```bash
php artisan test --compact tests/Feature/{Model}IndexTest.php tests/Feature/{Model}CrudTest.php
vendor/bin/pint --dirty --format agent
npm run types:check
```

Jika tes gagal dengan `ViteException: Unable to locate file in Vite manifest`, jalankan `npm run build` lebih dulu — halaman React baru belum masuk manifest.

---

# Checklist sebelum selesai

- [ ] Migration punya index untuk kolom sort/filter, dan `down()` yang benar
- [ ] Model punya `#[Fillable]`, casts, scope `search` dengan `addcslashes`
- [ ] Policy terdaftar dan dipakai di setiap Form Request + `destroy`
- [ ] `Index{Model}Request` mem-whitelist `sort` dengan `in:` dan menyediakan helper bertipe
- [ ] Controller `select` + `search` + `orderBy` + `paginate(10)` + `withQueryString` + `through`
- [ ] Route sesuai pola yang dipilih (penuh versus `only`)
- [ ] `php artisan wayfinder:generate --with-form --no-interaction` dijalankan
- [ ] Nav ditambahkan di `app-sidebar.tsx` **dan** `app-header.tsx`
- [ ] Halaman React memakai `Paginated<T>`, dan tabelnya `DataTableClient`/`DataTableServer` atau `DataGridClient`/`DataGridServer` (bukan markup tabel tulis tangan) sesuai `table-pattern.md`
- [ ] Mode view tanpa tombol Edit/Close di footer
- [ ] Delete memakai `AlertDialog`
- [ ] Tes Index + CRUD lulus, Pint bersih, `types:check` bersih

# Jangan

- Mengasumsikan pola create/edit/view tanpa menanya (kecuali user sudah memilih)
- Membuat `create.tsx` / `edit.tsx` / `show.tsx` untuk pola Dialog / Sheet / Panel inline — atau sebaliknya, memakai overlay untuk pola Halaman baru
- Mendaftarkan route GET `create` / `edit` / `show` pada pola overlay
- Path hardcoded seperti `'/users'` di React
- `{Model}::paginate()` tanpa `orderBy` / `select` / `through`
- Mempercayai `$request->sort` tanpa whitelist `in:`
- Memakai Radix Sheet untuk panel inline, atau sebaliknya
- Mengubah `@/components/ui/sheet.tsx` saat mengerjakan panel inline
- Menambah tombol Edit atau Close di footer view (dialog/sheet/panel), atau tombol Edit di `show.tsx`
- Pola UI list alternatif (div-grid, infinite scroll) kecuali user memintanya
- Menulis tangan helper sort/search/pagination di halaman list (`visit`, `SortableHead`, debounce manual) — itu tugas `data-table`/`data-grid`, lihat `table-pattern.md`
- Mengedit file hasil generate Wayfinder di `resources/js/actions/**` dan `resources/js/routes/**`
