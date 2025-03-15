<?php

namespace App\Policies;

use App\Models\Type;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TypePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
        return (\Auth::user()->hasAnyRole(['super', 'admin', 'user']))
            ? Response::allow()
            : Response::deny('Unauthorised Action');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Type $type): Response
    {
        // If the user is a super user.
        if (\Auth::user()->hasAnyRole(['super'])) {
            return Response::allow();
        }

        /**
         * Return true if the document belongs to the users organisation.
         */
        return ($type->organisation_id == \Auth::user()->organisation_id)
            ? Response::allow()
            : Response::deny('Unauthorised');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): Response
    {
        return (\Auth::user()->hasAnyRole(['super', 'admin']))
            ? Response::allow()
            : Response::deny('Unauthorised Action');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Type $type): Response
    {
        // If the user is a super user, they can edit anything.
        if ($user->hasRole('super')) {
            return Response::allow();
        }

        // Otherwise the user must have an admin role and the model being deleted must be from the users organisation.
        return ($user->hasRole('admin') && $user->organisation_id === $type->organisation_id)
            ? Response::allow()
            : Response::deny('Not authorised to complete this action');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Type $type): Response
    {
        // Super role can delete any user.
        if ($user->hasRole('super')) {
            return Response::allow();
        }

        // Otherwise the user must have an admin role and the model being deleted must be from the users organisation.
        return ($user->hasRole('admin') && $user->organisation_id === $type->organisation_id)
            ? Response::allow()
            : Response::deny('Not authorised to complete this action');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Type $type): Response
    {
        // Super role can delete any user.
        if ($user->hasRole('super')) {
            return Response::allow();
        }

        // Otherwise the user must have an admin role and the model being deleted must be from the users organisation.
        return ($user->hasRole('admin') && $user->organisation_id === $type->organisation_id)
            ? Response::allow()
            : Response::deny('Not authorised to complete this action');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Type $type): Response
    {
        //
    }
}
