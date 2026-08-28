<?php

namespace App\Http\Controllers;

use App\Http\Requests\Countries\IndexCountryRequest;
use App\Http\Requests\Countries\StoreCountryRequest;
use App\Http\Requests\Countries\UpdateCountryRequest;
use App\Models\Country;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CountryController extends Controller
{
    /**
     * Display a paginated listing of countries.
     */
    public function index(IndexCountryRequest $request): Response
    {
        $actor = $request->user();

        $countries = Country::query()
            ->select(['id', 'name', 'code', 'created_at', 'updated_at'])
            ->search($request->search())
            ->orderBy($request->sort(), $request->direction())
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Country $country): array => [
                'id' => $country->id,
                'name' => $country->name,
                'code' => $country->code,
                'created_at' => $country->created_at?->toIso8601String(),
                'updated_at' => $country->updated_at?->toIso8601String(),
                'can_delete' => $actor !== null && $actor->can('delete', $country),
            ]);

        return Inertia::render('countries/index', [
            'countries' => $countries,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    /**
     * Store a newly created country.
     */
    public function store(StoreCountryRequest $request): RedirectResponse
    {
        Country::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Country created.')]);

        return to_route('countries.index');
    }

    /**
     * Update the specified country.
     */
    public function update(UpdateCountryRequest $request, Country $country): RedirectResponse
    {
        $country->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Country updated.')]);

        return to_route('countries.index');
    }

    /**
     * Remove the specified country.
     */
    public function destroy(Country $country): RedirectResponse
    {
        Gate::authorize('delete', $country);

        $country->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Country deleted.')]);

        return to_route('countries.index');
    }
}
