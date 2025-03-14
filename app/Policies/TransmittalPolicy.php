<?php

namespace App\Policies;

use App\Models\Transmittal;
use Illuminate\Auth\Access\Response;

class TransmittalPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(Transmittal $transmittal): bool
    {
        // Confirm the user can view any transmittals
        return (\Auth::user()->hasAnyRole(['super', 'admin', 'user']))
        ? Response::allow()
        : Response::deny('Unauthorized Action');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(Transmittal $transmittal): bool
    {
        // If the user is a super user.
        if (\Auth::user()->hasAnyRole(['super'])) {
            return Response::allow();
        }

        /**
         * Return true if the document belongs to the users organisation.
         */
        return ($transmittal->organisation_id == \Auth::user()->organisation_id)
            ? Response::allow()
            : Response::deny('Unauthorized');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(Transmittal $transmittal): bool
    {
        return \Auth::user()->hasAnyRole(['super', 'admin'])
            ? Response::allow()
            : Response::deny('Unauthorized Action');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(Transmittal $transmittal): bool
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(Transmittal $transmittal): bool
    {
        // Super role can delete any user.
        if ($user->hasRole('super')) {
            return Response::allow();
        }

        // Otherwise the user must have an admin role and the model being deleted must be from the users organisation.
        return ($user->hasRole('admin') && $user->organisation_id === $transmittal->organisation_id)
            ? Response::allow()
            : Response::deny('Not authorised to complete this action');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(Transmittal $transmittal): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(Transmittal $transmittal): bool
    {
        //
    }
}
