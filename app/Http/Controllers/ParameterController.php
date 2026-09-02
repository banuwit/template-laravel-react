<?php

namespace App\Http\Controllers;

use App\Http\Requests\Parameters\IndexParameterRequest;
use App\Http\Requests\Parameters\StoreParameterRequest;
use App\Http\Requests\Parameters\UpdateParameterRequest;
use App\Models\Parameter;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ParameterController extends Controller
{
    public function index(IndexParameterRequest $request): Response
    {
        $actor = $request->user();

        $parameters = Parameter::query()
            ->select(['id', 'group', 'code', 'value', 'description', 'text_color', 'bg_color', 'is_system', 'is_active', 'sort_order', 'created_at', 'updated_at'])
            ->orderBy('sort_order')
            ->orderBy('code')
            ->get()
            ->map(fn (Parameter $parameter): array => $this->transformRecord($parameter, $actor))
            ->values();

        return Inertia::render('parameters/index', [
            'parameters' => $parameters,
        ]);
    }

    public function store(StoreParameterRequest $request): RedirectResponse
    {
        Parameter::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Parameter created.')]);

        return to_route('parameters.index');
    }

    public function update(UpdateParameterRequest $request, Parameter $parameter): RedirectResponse
    {
        $parameter->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Parameter updated.')]);

        return to_route('parameters.index');
    }

    public function destroy(Parameter $parameter): RedirectResponse
    {
        Gate::authorize('delete', $parameter);

        $parameter->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Parameter deleted.')]);

        return to_route('parameters.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRecord(Parameter $parameter, ?User $actor): array
    {
        return [
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
            'created_at' => $parameter->created_at?->toIso8601String(),
            'updated_at' => $parameter->updated_at?->toIso8601String(),
            'can_delete' => $actor !== null && $actor->can('delete', $parameter),
        ];
    }
}
