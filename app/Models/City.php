<?php

namespace App\Models;

use Database\Factories\CityFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $province_id
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Province $province
 */
#[Fillable(['province_id', 'name'])]
class City extends Model
{
    /** @use HasFactory<CityFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Province, $this>
     */
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    /**
     * @param  Builder<City>  $query
     * @return Builder<City>
     */
    #[Scope]
    protected function search(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->where(function (Builder $query) use ($like): void {
            $query->where('name', 'like', $like)
                ->orWhereHas('province', function (Builder $query) use ($like): void {
                    $query->where('name', 'like', $like);
                });
        });
    }
}
