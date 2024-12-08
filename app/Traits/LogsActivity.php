<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait LogsActivity
{
    // The allowed actions
    public const ACTIONS = [
        'created', 'updated', 'deleted',
    ];

    /**
     * Boot the trait and listen for model events.
     *
     * @return void
     */
    protected static function bootLogsActivity()
    {
        // If a new model is created.
        static::created(function ($model) {
            $model->logActivity('created');
        });

        // If an existing model is updated.
        static::updated(function ($model) {
            $model->logActivity('updated');
        });

        // If a model is deleted.
        static::deleted(function ($model) {
            $model->logActivity('deleted');
        });
    }

    /**
     * Log the activity for the model.
     *
     * @param string $action
     * @return void
     */
    protected function logActivity(string $action): bool
    {
        if (!in_array($action, self::ACTIONS)) {
            return false;
        }
        $changes = null;
        $original = $this->toJson();

        // Only log the changes if the action is 'updated'
        if ($action === 'updated') {
            $changes = $this->getChanges();
        }

        // Create a new activity log record
        ActivityLog::create([
            'model_name' => get_class($this),
            'model_id' => $this->id,
            'event' => $action,
            'data' => $changes ? json_encode($changes) : $original ?? null,
            'user_id' => auth()->id(),
            'organisation_id' => auth()->user()->organisation_id
        ]);
        return true;
    }
}
