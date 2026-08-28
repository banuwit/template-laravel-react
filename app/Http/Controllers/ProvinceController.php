<?php

namespace App\Http\Controllers;

use App\Http\Requests\Provinces\IndexProvinceRequest;
use App\Http\Requests\Provinces\StoreProvinceRequest;
use App\Http\Requests\Provinces\UpdateProvinceRequest;
use App\Models\Country;
use App\Models\Province;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProvinceController extends Controller
{
    /**
     * Display a paginated listing of provinces.
     */
    public function index(IndexProvinceRequest $request): Response
    {
        $actor = $request->user();
        $sort = $request->sort();
        $direction = $request->direction();

        $provincesQuery = Province::query()
            ->select(['provinces.id', 'provinces.country_id', 'provinces.name', 'provinces.code', 'provinces.created_at', 'provinces.updated_at'])
            ->with(['country:id,name,code'])
            ->search($request->search());

        if ($sort === 'country') {
            $provincesQuery
                ->join('countries', 'countries.id', '=', 'provinces.country_id')
                ->orderBy('countries.name', $direction)
                ->select(['provinces.id', 'provinces.country_id', 'provinces.name', 'provinces.code', 'provinces.created_at', 'provinces.updated_at']);
        } else {
            $provincesQuery->orderBy($sort, $direction);
        }

        $provinces = $provincesQuery
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Province $province): array => [
                'id' => $province->id,
                'country_id' => $province->country_id,
                'name' => $province->name,
                'code' => $province->code,
                'country' => [
                    'id' => $province->country->id,
                    'name' => $province->country->name,
                    'code' => $province->country->code,
                ],
                'created_at' => $province->created_at?->toIso8601String(),
                'updated_at' => $province->updated_at?->toIso8601String(),
                'can_delete' => $actor !== null && $actor->can('delete', $province),
            ]);

        $countries = Country::query()
            ->select(['id', 'name', 'code'])
            ->orderBy('name')
            ->get()
            ->map(fn (Country $country): array => [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code,
            ]);

        return Inertia::render('provinces/index', [
            'provinces' => $provinces,
            'countries' => $countries,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    /**
     * Store a newly created province.
     */
    public function store(StoreProvinceRequest $request): RedirectResponse
    {
        Province::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Province created.')]);

        return to_route('provinces.index');
    }

    /**
     * Update the specified province.
     */
    public function update(UpdateProvinceRequest $request, Province $province): RedirectResponse
    {
        $province->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Province updated.')]);

        return to_route('provinces.index');
    }

    /**
     * Remove the specified province.
     */
    public function destroy(Province $province): RedirectResponse
    {
        Gate::authorize('delete', $province);

        $province->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Province deleted.')]);

        return to_route('provinces.index');
    }
}
