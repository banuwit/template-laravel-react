<?php

namespace App\Http\Controllers;

use App\Http\Requests\Example1s\IndexExample1Request;
use App\Http\Requests\Example1s\StoreExample1Request;
use App\Http\Requests\Example1s\UpdateExample1Request;
use App\Models\Example1;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class Example1Controller extends Controller
{
    public function index(IndexExample1Request $request): Response
    {
        $actor = $request->user();

        $example1 = Example1::query()
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
            ->through(fn (Example1 $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('example1/index', [
            'example1' => $example1,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Example1::class);

        return Inertia::render('example1/create');
    }

    public function store(StoreExample1Request $request): RedirectResponse
    {
        Example1::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record created.')]);

        return to_route('example1.index');
    }

    public function show(Request $request, Example1 $example1): Response
    {
        Gate::authorize('view', $example1);

        $actor = $request->user();

        return Inertia::render('example1/show', [
            'example1' => $this->transformDetailRecord($example1, $actor),
        ]);
    }

    public function edit(Example1 $example1): Response
    {
        Gate::authorize('update', $example1);

        return Inertia::render('example1/edit', [
            'example1' => [
                'id' => $example1->id,
                'name' => $example1->name,
                'email' => $example1->email,
                'phone' => $example1->phone,
                'department' => $example1->department,
                'position' => $example1->position,
                'join_date' => $example1->join_date->toDateString(),
                'gender' => $example1->gender->value,
                'status' => $example1->status->value,
            ],
        ]);
    }

    public function update(UpdateExample1Request $request, Example1 $example1): RedirectResponse
    {
        $example1->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record updated.')]);

        return to_route('example1.index');
    }

    public function destroy(Example1 $example1): RedirectResponse
    {
        Gate::authorize('delete', $example1);

        $example1->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record deleted.')]);

        return to_route('example1.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(Example1 $record, ?User $actor): array
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

    /**
     * @return array<string, mixed>
     */
    private function transformDetailRecord(Example1 $record, ?User $actor): array
    {
        return [
            ...$this->transformRecord($record, $actor),
            'can_update' => $actor !== null && $actor->can('update', $record),
        ];
    }
}
