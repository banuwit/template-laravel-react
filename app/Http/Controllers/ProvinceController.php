<?php

namespace App\Http\Controllers;

use App\Http\Requests\Provinces\IndexProvinceRequest;
use App\Http\Requests\Provinces\StoreProvinceRequest;
use App\Http\Requests\Provinces\UpdateProvinceRequest;
use App\Models\Country;
use App\Models\Province;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProvinceController extends Controller
{
    /**
     * Provinces are a small, finite reference list, so the whole list is
     * shown on one page — this keeps every row reachable without pagination
     * controls in the UI while still using the same paginator contract
     * (`Paginated<T>`) the frontend table component expects.
     */
    private const PER_PAGE = 1000;

    public function index(IndexProvinceRequest $request): Response
    {
        $actor = $request->user();

        $provinces = Province::query()
            ->select(['id', 'country_id', 'name', 'created_at', 'updated_at'])
            ->with('country:id,name')
            ->search($request->search())
            ->orderBy($request->sort(), $request->direction())
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (Province $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('provinces/index', [
            'provinces' => $provinces,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
            'countryOptions' => Country::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Country $country): array => [
                    'value' => (string) $country->id,
                    'label' => $country->name,
                ]),
        ]);
    }

    public function store(StoreProvinceRequest $request): RedirectResponse
    {
        Province::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Province created.')]);

        return to_route('provinces.index');
    }

    public function update(UpdateProvinceRequest $request, Province $province): RedirectResponse
    {
        $province->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Province updated.')]);

        return to_route('provinces.index');
    }

    public function destroy(Province $province): RedirectResponse
    {
        Gate::authorize('delete', $province);

        $province->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Province deleted.')]);

        return to_route('provinces.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(Province $record, ?User $actor): array
    {
        return [
            'id' => $record->id,
            'country_id' => $record->country_id,
            'country_name' => $record->country->name,
            'name' => $record->name,
            'created_at' => $record->created_at?->toIso8601String(),
            'updated_at' => $record->updated_at?->toIso8601String(),
            'can_delete' => $actor !== null && $actor->can('delete', $record),
        ];
    }
}
