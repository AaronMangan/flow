<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organisation;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\StatusSeeder;
use App\Models\Status;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Exception;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Organisation::withoutEvents(function () {
            // Check that we have the necessary credentials.
            if (!$this->environmentCredentials()) {
                throw new \Exception('Please check your .env file has the right credentials, or remove this seeder');
            }

            // Call other seeders.
            $this->call([
                StatusSeeder::class,        // Creates statuses to apply to the users.
            ]);

            // Set the created models to the active status.
            $activeStatus = Status::where('name', 'active')->first();

            /**
             * SUPER ADMIN
             */
            // Super Admin Organisation
            $superOrg = Organisation::create([
                'name' => env('SUPER_ORG_NAME'),
                'address' => env('SUPER_ADDRESS', null),
                'phone' => env('SUPER_PHONE', null),
                'settings' => json_encode([])
            ]);

            // Create a Super role
            $roleSuper = Role::create(['name' => 'super']);
            $permissionSuper = Permission::create(['guard_name' => 'web', 'name' => 'full permissions']);
            $roleSuper->givePermissionTo($permissionSuper);

            // Create a super admin user.
            $superUser = User::create([
                'name' => env('SUPER_NAME'),
                'email' => env('SUPER_EMAIL'),
                'password' => env('SUPER_PASSWORD'),
                'organisation_id' => $superOrg->id,
                'status_id' => $activeStatus->id ?? null,
            ]);
            // Assign that user the role.
            $superUser->assignRole($roleSuper);

            /**
             * ADMIN USERS
             */
            // Regular Organisation
            $adminOrg = Organisation::create([
                'name' => env('ADMIN_ORG_NAME'),
                'address' => env('ADMIN_ADDRESS', null),
                'phone' => env('ADMIN_PHONE', null),
                'settings' => json_encode([])
            ]);

            // Create an admin org and permissions
            $roleAdmin = Role::create(['name' => 'admin']);
            $permissionAdmin = Permission::create(['guard_name' => 'web', 'name' => 'admin']);
            $roleAdmin->givePermissionTo($permissionAdmin);

            // Create an admin org and permissions
            $roleUser = Role::create(['name' => 'user']);
            $permissionUser = Permission::create(['guard_name' => 'web', 'name' => 'readonly']);
            $roleUser->givePermissionTo($permissionAdmin);

            // Create an admin user.
            $adminUser = User::create([
                'name' => env('ADMIN_NAME'),
                'email' => env('ADMIN_EMAIL'),
                'password' => env('ADMIN_PASSWORD'),
                'organisation_id' => $adminOrg->id,
                'status_id' => $activeStatus->id ?? null,
            ]);

            // Create a regular user.
            $regularUser = User::create([
                'name' => env('USER_NAME'),
                'email' => env('USER_EMAIL'),
                'password' => env('USER_PASSWORD'),
                'organisation_id' => $adminOrg->id,
                'status_id' => $activeStatus->id ?? null,
            ]);

            // Assign the role to that user.
            $adminUser->assignRole($roleAdmin);

            // Assign permissions to the regular user.
            $regularUser->assignRole($roleUser);
        });
    }

    /**
     * A basic check that the env file has the defined values to run the seeder.
     * Add the required values into an array. It defaults to false if the value doesn't exist.
     * Then we simply check if false is in the array and viola, we know if the variables were set.
     *
     * @return boolean|null
     */
    private function environmentCredentials(): ?bool
    {
        return (in_array(false, [
            env('SUPER_ORG_NAME', false),
            env('SUPER_NAME', false),
            env('SUPER_PASSWORD', false),
            env('ADMIN_ORG_NAME', false),
            env('ADMIN_NAME', false),
            env('ADMIN_PASSWORD', false),
            env('USER_NAME', false),
            env('USER_PASSWORD', false),
        ])) ? false : true;
    }
}
