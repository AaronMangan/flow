<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('super') ?? false;
    }

    /**
     * Only the super role can see every user, otherwise only show other users belong to the organisation.
     *
     * @param User $authUser
     * @param User $user
     * @return void
     */
    public function view(User $user, User $model)
    {
        // Super role can view all users
        if ($user->hasRole('super')) {
            return true;
        }
        // Otherwise, check if the users belong to the same company
        return $user->organisation_id === $model->organisation_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        //
    }

    /**
     * Only the super role can see update user, otherwise only an admin can update a user.
     *
     * @param User $authUser
     * @param User $user
     * @return void
     */
    public function update(User $user, User $model)
    {
        // Super role can view all users
        if ($user->hasRole('super')) {
            return true;
        }

        // Otherwise, check if the users belong to the same company
        return $user->organisation_id === $model->organisation_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $model): bool
    {
        // Super role can delete any user.
        if ($user->hasRole('super')) {
            return true;
        }

        // Otherwise the user must have an admin role and the model being deleted must be from the users organisation.
        return $user->hasRole('admin') && $user->organisation_id === $model->organisation_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        //
    }
}
