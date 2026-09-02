<?php

namespace App\Models;

use App\Enums\MenuLayout;
use Database\Factories\MenuFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $icon
 * @property string|null $route_name
 * @property string|null $route_pattern
 * @property int|null $parent_id
 * @property int $level
 * @property int $sort_order
 * @property MenuLayout $layout
 * @property bool $is_active
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Menu|null $parent
 */
#[Fillable(['name', 'slug', 'icon', 'route_name', 'route_pattern', 'parent_id', 'level', 'sort_order', 'layout', 'is_active'])]
class Menu extends Model
{
    /** @use HasFactory<MenuFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'level' => 0,
        'sort_order' => 0,
        'layout' => 'sidebar',
        'is_active' => true,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'layout' => MenuLayout::class,
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Menu $menu): void {
            $menu->created_by ??= self::actorId();
            $menu->updated_by ??= self::actorId();
        });

        static::updating(function (Menu $menu): void {
            $menu->updated_by = self::actorId();
        });

        static::deleting(function (Menu $menu): void {
            $menu->deleted_by = self::actorId();
            $menu->saveQuietly();
        });
    }

    private static function actorId(): ?int
    {
        $id = Auth::id();

        return is_int($id) ? $id : null;
    }

    /**
     * @return BelongsTo<Menu, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Menu::class, 'parent_id');
    }

    /**
     * @return HasMany<Menu, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(Menu::class, 'parent_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function deletedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }

    /**
     * @param  Builder<Menu>  $query
     * @return Builder<Menu>
     */
    #[Scope]
    protected function search(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->whereAny(['name', 'slug', 'route_name'], 'like', $like);
    }
}
