<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\IndexUserRequest;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a paginated listing of users.
     */
    public function index(IndexUserRequest $request): Response
    {
        $actor = $request->user();

        $users = User::query()
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
                'email_verified_at',
                'created_at',
            ])
            ->search($request->search())
            ->when($request->departments(), fn ($query, array $departments) => $query->whereIn('department', $departments))
            ->when($request->positions(), fn ($query, array $positions) => $query->whereIn('position', $positions))
            ->when($request->statuses(), fn ($query, array $statuses) => $query->whereIn('status', $statuses))
            ->when($request->genders(), fn ($query, array $genders) => $query->whereIn('gender', $genders))
            ->orderBy($request->sort(), $request->direction())
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user): array => [
                ...$this->profileAttributes($user),
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
                'can_delete' => $actor !== null && $actor->can('delete', $user),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $request->search() ?? '',
                'sort' => $request->sort(),
                'direction' => $request->direction(),
                'department' => $request->departments(),
                'position' => $request->positions(),
                'status' => $request->statuses(),
                'gender' => $request->genders(),
            ],
            'departmentOptions' => User::query()
                ->whereNotNull('department')
                ->distinct()
                ->orderBy('department')
                ->pluck('department'),
            'positionOptions' => User::query()
                ->whereNotNull('position')
                ->distinct()
                ->orderBy('position')
                ->pluck('position'),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        Gate::authorize('create', User::class);

        return Inertia::render('users/create', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }

    /**
     * Display the specified user.
     */
    public function show(Request $request, User $user): Response
    {
        Gate::authorize('view', $user);

        $actor = $request->user();

        return Inertia::render('users/show', [
            'user' => [
                ...$this->profileAttributes($user),
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
                'updated_at' => $user->updated_at?->toIso8601String(),
                'can_update' => $actor !== null && $actor->can('update', $user),
                'can_delete' => $actor !== null && $actor->can('delete', $user),
            ],
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create($request->safe()->only([
            'name',
            'email',
            'password',
            'phone',
            'department',
            'position',
            'join_date',
            'gender',
            'status',
        ]));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User created.')]);

        return to_route('users.index');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        Gate::authorize('update', $user);

        return Inertia::render('users/edit', [
            'user' => $this->profileAttributes($user),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->fill($request->userAttributes());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User updated.')]);

        return to_route('users.index');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User deleted.')]);

        return to_route('users.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function profileAttributes(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'department' => $user->department,
            'position' => $user->position,
            'join_date' => $user->join_date?->toDateString(),
            'gender' => $user->gender?->value,
            'status' => $user->status->value,
        ];
    }
}
