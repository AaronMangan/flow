<?php

namespace App\Http\Controllers;

use App\Flow\Flow;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Status;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Return the user page.
        return Inertia::render('User/UsersIndex', [
            'users' => $this->getUsers()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $statusData = Status::where('organisation_id', $request->user()->organisation_id)
            ->orWhereNull('organisation_id')
            ->get();

        // Using the map method, transform the data.
        $statuses = $statusData->map(function ($status) {
            return [
                'value' => $status->id ?? null,
                'label' => ucwords($status->name) ?? $status->id ?? null
            ];
        })->toArray();

        // Return the view for creating a new user.
        return Inertia::render('User/UserCreateOrEdit', [
            'statuses' => $statuses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        // Get the data for the user.
        $data = $request->safe()->only(['name', 'email', 'status_id']);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'status_id' => $data['status_id'] ?? Status::ACTIVE,
            'organisation_id' => (auth()->user()->hasRole('super')) ? $data['organisation_id'] : auth()->user()->organisation_id
        ]);

        event(new Registered($user));
        return Inertia::render('User/UsersIndex', ['users' => $this->getUsers()]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, User $user)
    {
        // Check if the authenticated user can view this user.
        if ($request->user()->cannot('update', $user)) {
            abort(403);
        }

        //
        $user = auth()->user()->organisation->users;

        // return view('users.show', compact('user'));
        return Inertia::render('User/UserEdit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        // Make sure the user can update the model.
        if ($request->user()->cannot('update', $user)) {
            abort(403);
        }

        // Get the data for the user.
        $data = $request->safe()->only(['name', 'email', 'status_id']);
        $updated = $user->update($data);

        // Redirect back to the user index page or show page
        return redirect()->route('user.index')
            ->with(
                $updated ? 'success' : 'fail',
                $updated ? 'User updated successfully.' : 'An error occurred saving the user'
            );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, User $user)
    {
        // Make sure the user can update the model.
        if ($request->user()->cannot('delete', $user)) {
            abort(403);
        }

        // Delete the user.
        $deleted = $user->delete();
        return response()->json(['status' => 'success', 'user' => $user]);
    }

    /**
     * Returns a listing of all users.
     *
     * @return void
     */
    private function getUsers()
    {
        if (\Auth::user()->hasRole('super')) {
            return User::with('status', 'organisation', 'roles')->get()->toArray();
        } else {
            return User::with('status', 'organisation', 'roles')
                ->where('organisation_id', \Auth::user()->organisation_id)
                ->get()
                ->toArray();
        }
    }
}
