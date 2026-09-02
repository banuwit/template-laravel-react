<?php

namespace App\Http\Controllers;

use App\Http\Requests\Example3s\IndexExample3Request;
use App\Http\Requests\Example3s\StoreExample3Request;
use App\Http\Requests\Example3s\UpdateExample3Request;
use App\Models\Example3;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class Example3Controller extends Controller
{
    public function index(IndexExample3Request $request): Response
    {
        $actor = $request->user();

        $example3 = Example3::query()
            ->select([
                'id',
                'name',
                'email',
                'phone',
                'department',
                'position',
                'join_date',
                'gender',
                'status',
                'created_at',
                'updated_at',
            ])
            ->search($request->search())
            ->orderBy($request->sort(), $request->direction())
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Example3 $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('example3/index', [
            'example3' => $example3,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    public function store(StoreExample3Request $request): RedirectResponse
    {
        Example3::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record created.')]);

        return to_route('example3.index');
    }

    public function update(UpdateExample3Request $request, Example3 $example3): RedirectResponse
    {
        $example3->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record updated.')]);

        return to_route('example3.index');
    }

    public function destroy(Example3 $example3): RedirectResponse
    {
        Gate::authorize('delete', $example3);

        $example3->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record deleted.')]);

        return to_route('example3.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(Example3 $record, ?User $actor): array
    {
        return [
            'id' => $record->id,
            'name' => $record->name,
            'email' => $record->email,
            'phone' => $record->phone,
            'department' => $record->department,
            'position' => $record->position,
            'join_date' => $record->join_date->toDateString(),
            'gender' => $record->gender->value,
            'status' => $record->status->value,
            'created_at' => $record->created_at?->toIso8601String(),
            'updated_at' => $record->updated_at?->toIso8601String(),
            'can_delete' => $actor !== null && $actor->can('delete', $record),
        ];
    }
}
