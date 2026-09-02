<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cities\IndexCityRequest;
use App\Http\Requests\Cities\StoreCityRequest;
use App\Http\Requests\Cities\UpdateCityRequest;
use App\Models\City;
use App\Models\Province;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CityController extends Controller
{
    /**
     * Cities are a small, finite reference list, so the whole list is shown
     * on one page — this keeps every row reachable without pagination
     * controls in the UI while still using the same paginator contract
     * (`Paginated<T>`) the frontend table component expects.
     */
    private const PER_PAGE = 1000;

    public function index(IndexCityRequest $request): Response
    {
        $actor = $request->user();

        $cities = City::query()
            ->select(['id', 'province_id', 'name', 'created_at', 'updated_at'])
            ->with('province:id,country_id,name', 'province.country:id,name')
            ->search($request->search())
            ->orderBy($request->sort(), $request->direction())
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (City $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('cities/index', [
            'cities' => $cities,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
            'provinceOptions' => Province::query()
                ->with('country:id,name')
                ->orderBy('name')
                ->get(['id', 'country_id', 'name'])
                ->map(fn (Province $province): array => [
                    'value' => (string) $province->id,
                    'label' => "{$province->name} — {$province->country->name}",
                ]),
        ]);
    }

    public function store(StoreCityRequest $request): RedirectResponse
    {
        City::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('City created.')]);

        return to_route('cities.index');
    }

    public function update(UpdateCityRequest $request, City $city): RedirectResponse
    {
        $city->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('City updated.')]);

        return to_route('cities.index');
    }

    public function destroy(City $city): RedirectResponse
    {
        Gate::authorize('delete', $city);

        $city->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('City deleted.')]);

        return to_route('cities.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(City $record, ?User $actor): array
    {
        return [
            'id' => $record->id,
            'province_id' => $record->province_id,
            'province_name' => $record->province->name,
            'country_name' => $record->province->country->name,
            'name' => $record->name,
            'created_at' => $record->created_at?->toIso8601String(),
            'updated_at' => $record->updated_at?->toIso8601String(),
            'can_delete' => $actor !== null && $actor->can('delete', $record),
        ];
    }
}
