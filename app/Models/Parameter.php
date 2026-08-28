<?php

namespace App\Models;

use Database\Factories\ParameterFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @property string $group
 * @property string $code
 * @property string $value
 * @property string|null $description
 * @property string|null $text_color
 * @property string|null $bg_color
 * @property array<string, mixed>|null $attributes
 * @property bool $is_system
 * @property bool $is_active
 * @property int $sort_order
 * @property int|null $created_by
 * @property int|null $updated_by
 * @property int|null $deleted_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable(['group', 'code', 'value', 'description', 'text_color', 'bg_color', 'attributes', 'is_system', 'is_active', 'sort_order'])]
class Parameter extends Model
{
    /** @use HasFactory<ParameterFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'attributes' => 'array',
            'is_system' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Parameter $parameter): void {
            $parameter->created_by ??= self::actorId();
            $parameter->updated_by ??= self::actorId();
        });

        static::updating(function (Parameter $parameter): void {
            $parameter->updated_by = self::actorId();
        });

        static::deleting(function (Parameter $parameter): void {
            $parameter->deleted_by = self::actorId();
            $parameter->saveQuietly();
        });
    }

    private static function actorId(): ?int
    {
        $id = Auth::id();

        return is_int($id) ? $id : null;
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
     * @param  Builder<Parameter>  $query
     * @return Builder<Parameter>
     */
    #[Scope]
    protected function search(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->whereAny(['group', 'code', 'value', 'description'], 'like', $like);
    }
}
