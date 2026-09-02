<?php

namespace App\Http\Controllers;

use App\Http\Requests\Example2s\IndexExample2Request;
use App\Http\Requests\Example2s\StoreExample2Request;
use App\Http\Requests\Example2s\UpdateExample2Request;
use App\Models\Example2;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class Example2Controller extends Controller
{
    public function index(IndexExample2Request $request): Response
    {
        $actor = $request->user();

        $example2 = Example2::query()
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
            ->through(fn (Example2 $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('example2/index', [
            'example2' => $example2,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    public function store(StoreExample2Request $request): RedirectResponse
    {
        Example2::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record created.')]);

        return to_route('example2.index');
    }

    public function update(UpdateExample2Request $request, Example2 $example2): RedirectResponse
    {
        $example2->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record updated.')]);

        return to_route('example2.index');
    }

    public function destroy(Example2 $example2): RedirectResponse
    {
        Gate::authorize('delete', $example2);

        $example2->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record deleted.')]);

        return to_route('example2.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(Example2 $record, ?User $actor): array
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
