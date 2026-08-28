<?php

namespace App\Http\Controllers;

use App\Http\Requests\Parameters\IndexParameterRequest;
use App\Http\Requests\Parameters\StoreParameterRequest;
use App\Http\Requests\Parameters\UpdateParameterRequest;
use App\Models\Parameter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ParameterController extends Controller
{
    private const array FORM_FIELDS = [
        'group', 'code', 'value', 'description', 'text_color', 'bg_color', 'is_system', 'is_active', 'sort_order',
    ];

    /**
     * Display a paginated listing of parameters.
     */
    public function index(IndexParameterRequest $request): Response
    {
        $actor = $request->user();

        $parameters = Parameter::query()
            ->select(['id', 'group', 'code', 'value', 'is_system', 'is_active', 'sort_order', 'created_at'])
            ->search($request->search())
            ->orderBy($request->sort(), $request->direction())
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Parameter $parameter): array => [
                'id' => $parameter->id,
                'group' => $parameter->group,
                'code' => $parameter->code,
                'value' => $parameter->value,
                'is_system' => $parameter->is_system,
                'is_active' => $parameter->is_active,
                'sort_order' => $parameter->sort_order,
                'created_at' => $parameter->created_at?->toIso8601String(),
                'can_delete' => $actor !== null && $actor->can('delete', $parameter),
            ]);

        return Inertia::render('parameters/index', [
            'parameters' => $parameters,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
            ],
        ]);
    }

    /**
     * Show the form for creating a new parameter.
     */
    public function create(): Response
    {
        Gate::authorize('create', Parameter::class);

        return Inertia::render('parameters/create');
    }

    /**
     * Display the specified parameter.
     */
    public function show(Request $request, Parameter $parameter): Response
    {
        Gate::authorize('view', $parameter);

        $actor = $request->user();

        $parameter->loadMissing(['createdBy', 'updatedBy']);

        return Inertia::render('parameters/show', [
            'parameter' => [
                'id' => $parameter->id,
                'group' => $parameter->group,
                'code' => $parameter->code,
                'value' => $parameter->value,
                'description' => $parameter->description,
                'text_color' => $parameter->text_color,
                'bg_color' => $parameter->bg_color,
                'is_system' => $parameter->is_system,
                'is_active' => $parameter->is_active,
                'sort_order' => $parameter->sort_order,
                'created_by' => $parameter->createdBy?->name,
                'updated_by' => $parameter->updatedBy?->name,
                'created_at' => $parameter->created_at?->toIso8601String(),
                'updated_at' => $parameter->updated_at?->toIso8601String(),
                'can_update' => $actor !== null && $actor->can('update', $parameter),
                'can_delete' => $actor !== null && $actor->can('delete', $parameter),
            ],
        ]);
    }

    /**
     * Store a newly created parameter.
     */
    public function store(StoreParameterRequest $request): RedirectResponse
    {
        Parameter::create($request->safe()->only(self::FORM_FIELDS));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Parameter created.')]);

        return to_route('parameters.index');
    }

    /**
     * Show the form for editing the specified parameter.
     */
    public function edit(Parameter $parameter): Response
    {
        Gate::authorize('update', $parameter);

        return Inertia::render('parameters/edit', [
            'parameter' => [
                'id' => $parameter->id,
                'group' => $parameter->group,
                'code' => $parameter->code,
                'value' => $parameter->value,
                'description' => $parameter->description,
                'text_color' => $parameter->text_color,
                'bg_color' => $parameter->bg_color,
                'is_system' => $parameter->is_system,
                'is_active' => $parameter->is_active,
                'sort_order' => $parameter->sort_order,
            ],
        ]);
    }

    /**
     * Update the specified parameter.
     */
    public function update(UpdateParameterRequest $request, Parameter $parameter): RedirectResponse
    {
        $parameter->fill($request->safe()->only(self::FORM_FIELDS));
        $parameter->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Parameter updated.')]);

        return to_route('parameters.index');
    }

    /**
     * Remove the specified parameter.
     */
    public function destroy(Parameter $parameter): RedirectResponse
    {
        Gate::authorize('delete', $parameter);

        $parameter->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Parameter deleted.')]);

        return to_route('parameters.index');
    }
}
