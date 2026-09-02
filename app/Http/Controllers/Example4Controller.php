<?php

namespace App\Http\Controllers;

use App\Http\Requests\Example4s\IndexExample4Request;
use App\Http\Requests\Example4s\StoreExample4Request;
use App\Http\Requests\Example4s\UpdateExample4Request;
use App\Models\Example4;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class Example4Controller extends Controller
{
    public function index(IndexExample4Request $request): Response
    {
        $actor = $request->user();

        $example4 = Example4::query()
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
            ->through(fn (Example4 $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('example4/index', [
            'example4' => $example4,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    public function store(StoreExample4Request $request): RedirectResponse
    {
        Example4::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record created.')]);

        return to_route('example4.index');
    }

    public function update(UpdateExample4Request $request, Example4 $example4): RedirectResponse
    {
        $example4->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record updated.')]);

        return to_route('example4.index');
    }

    public function destroy(Example4 $example4): RedirectResponse
    {
        Gate::authorize('delete', $example4);

        $example4->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Example record deleted.')]);

        return to_route('example4.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(Example4 $record, ?User $actor): array
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
