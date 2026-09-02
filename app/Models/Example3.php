<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\Status;
use Database\Factories\Example3Factory;
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
 * @property string $phone
 * @property string $department
 * @property string $position
 * @property Carbon $join_date
 * @property Gender $gender
 * @property Status $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'phone', 'department', 'position', 'join_date', 'gender', 'status'])]
class Example3 extends Model
{
    /** @use HasFactory<Example3Factory> */
    use HasFactory;

    protected $table = 'example3';

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
            'gender' => Gender::class,
            'status' => Status::class,
        ];
    }

    /**
     * @param  Builder<Example3>  $query
     * @return Builder<Example3>
     */
    #[Scope]
    protected function search(Builder $query, ?string $term): Builder
    {
        if (blank($term)) {
            return $query;
        }

        $like = '%'.addcslashes($term, '%_\\').'%';

        return $query->whereAny(['name', 'email', 'phone', 'department', 'position'], 'like', $like);
    }
}
