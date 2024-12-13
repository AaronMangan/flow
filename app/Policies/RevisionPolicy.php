<?php

namespace App\Policies;

use App\Models\Revision;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class RevisionPolicy
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
    public function view(User $user, Revision $revision): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return \Auth::user()->hasAnyRole(['super', 'admin'])
            ? Response::allow()
            : Response::deny('Unauthorised Action');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Revision $revision): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Revision $revision): bool
    {
        // Super role can delete any user.
        if ($user->hasRole('super')) {
            return Response::allow();
        }

        // Otherwise the user must have an admin role and the model being deleted must be from the users organisation.
        return ($user->hasRole('admin') && $user->organisation_id === $revision->organisation_id)
            ? Response::allow()
            : Response::deny('Not authorised to complete this action');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Revision $revision): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Revision $revision): bool
    {
        //
    }
}