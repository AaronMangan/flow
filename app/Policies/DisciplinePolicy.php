<?php

namespace App\Policies;

use App\Models\Discipline;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DisciplinePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Discipline $discipline): Response
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return (\Auth::user()->hasAnyRole(['super', 'admin']) && \App\Flow\Config::orgConfig()['disciplines'])
            ? Response::allow()
            : Response::deny('Unauthorised Action');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Discipline $discipline): Response
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Discipline $discipline): Response
    {
        // Super role can delete any user.
        if ($user->hasRole('super')) {
            return Response::allow();
        }

        // Otherwise the user must have an admin role and the model being deleted must be from the users organisation.
        return ($user->hasRole('admin') && $user->organisation_id === $discipline->organisation_id)
            ? Response::allow()
            : Response::deny('Not authorised to complete this action');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Discipline $discipline): Response
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Discipline $discipline): Response
    {
        //
    }
}
