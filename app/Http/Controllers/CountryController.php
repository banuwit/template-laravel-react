<?php

namespace App\Http\Controllers;

use App\Http\Requests\Countries\IndexCountryRequest;
use App\Http\Requests\Countries\StoreCountryRequest;
use App\Http\Requests\Countries\UpdateCountryRequest;
use App\Models\Country;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CountryController extends Controller
{
    /**
     * Countries are a small, finite reference list, so the whole list is
     * shown on one page — this keeps every row reachable without pagination
     * controls in the UI while still using the same paginator contract
     * (`Paginated<T>`) the frontend table component expects.
     */
    private const PER_PAGE = 500;

    public function index(IndexCountryRequest $request): Response
    {
        $actor = $request->user();

        $countries = Country::query()
            ->select(['id', 'name', 'code', 'created_at', 'updated_at'])
            ->search($request->search())
            ->orderBy($request->sort(), $request->direction())
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (Country $record): array => $this->transformRecord($record, $actor));

        return Inertia::render('countries/index', [
            'countries' => $countries,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    public function store(StoreCountryRequest $request): RedirectResponse
    {
        Country::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Country created.')]);

        return to_route('countries.index');
    }

    public function update(UpdateCountryRequest $request, Country $country): RedirectResponse
    {
        $country->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Country updated.')]);

        return to_route('countries.index');
    }

    public function destroy(Country $country): RedirectResponse
    {
        Gate::authorize('delete', $country);

        $country->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Country deleted.')]);

        return to_route('countries.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(Country $record, ?User $actor): array
    {
        return [
            'id' => $record->id,
            'name' => $record->name,
            'code' => $record->code,
            'created_at' => $record->created_at?->toIso8601String(),
            'updated_at' => $record->updated_at?->toIso8601String(),
            'can_delete' => $actor !== null && $actor->can('delete', $record),
        ];
    }
}
