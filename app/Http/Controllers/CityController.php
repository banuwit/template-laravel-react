<?php

namespace App\Http\Controllers;

use App\Http\Requests\Cities\IndexCityRequest;
use App\Http\Requests\Cities\StoreCityRequest;
use App\Http\Requests\Cities\UpdateCityRequest;
use App\Models\City;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CityController extends Controller
{
    /**
     * Display a paginated listing of cities.
     */
    public function index(IndexCityRequest $request): Response
    {
        $actor = $request->user();
        $sort = $request->sort();
        $direction = $request->direction();

        $citiesQuery = City::query()
            ->select(['cities.id', 'cities.province_id', 'cities.name', 'cities.code', 'cities.created_at', 'cities.updated_at'])
            ->with(['province:id,country_id,name,code', 'province.country:id,name,code'])
            ->search($request->search());

        if ($sort === 'province') {
            $citiesQuery
                ->join('provinces', 'provinces.id', '=', 'cities.province_id')
                ->orderBy('provinces.name', $direction)
                ->select(['cities.id', 'cities.province_id', 'cities.name', 'cities.code', 'cities.created_at', 'cities.updated_at']);
        } elseif ($sort === 'country') {
            $citiesQuery
                ->join('provinces', 'provinces.id', '=', 'cities.province_id')
                ->join('countries', 'countries.id', '=', 'provinces.country_id')
                ->orderBy('countries.name', $direction)
                ->select(['cities.id', 'cities.province_id', 'cities.name', 'cities.code', 'cities.created_at', 'cities.updated_at']);
        } else {
            $citiesQuery->orderBy($sort, $direction);
        }

        $cities = $citiesQuery
            ->paginate(10)
            ->withQueryString()
            ->through(fn (City $city): array => [
                'id' => $city->id,
                'province_id' => $city->province_id,
                'name' => $city->name,
                'code' => $city->code,
                'province' => [
                    'id' => $city->province->id,
                    'name' => $city->province->name,
                    'code' => $city->province->code,
                    'country' => [
                        'id' => $city->province->country->id,
                        'name' => $city->province->country->name,
                        'code' => $city->province->country->code,
                    ],
                ],
                'created_at' => $city->created_at?->toIso8601String(),
                'updated_at' => $city->updated_at?->toIso8601String(),
                'can_delete' => $actor !== null && $actor->can('delete', $city),
            ]);

        $provinces = Province::query()
            ->select(['id', 'country_id', 'name', 'code'])
            ->with(['country:id,name,code'])
            ->orderBy('name')
            ->get()
            ->map(fn (Province $province): array => [
                'id' => $province->id,
                'name' => $province->name,
                'code' => $province->code,
                'country' => [
                    'id' => $province->country->id,
                    'name' => $province->country->name,
                    'code' => $province->country->code,
                ],
            ]);

        return Inertia::render('cities/index', [
            'cities' => $cities,
            'provinces' => $provinces,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    /**
     * Store a newly created city.
     */
    public function store(StoreCityRequest $request): RedirectResponse
    {
        City::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('City created.')]);

        return to_route('cities.index');
    }

    /**
     * Update the specified city.
     */
    public function update(UpdateCityRequest $request, City $city): RedirectResponse
    {
        $city->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('City updated.')]);

        return to_route('cities.index');
    }

    /**
     * Remove the specified city.
     */
    public function destroy(City $city): RedirectResponse
    {
        Gate::authorize('delete', $city);

        $city->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('City deleted.')]);

        return to_route('cities.index');
    }
}
