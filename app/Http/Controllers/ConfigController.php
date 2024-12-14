<?php

namespace App\Http\Controllers;

use App\Models\Config;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\StoreConfigRequest;

class ConfigController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Config/Config', [
            'config' => $this->getConfig(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreConfigRequest $request)
    {
        $data = $request->safe()->only(['name', 'values', 'organisation_id']);
        $data['organisation_id'] = \Auth::user()->organisation_id;
        $data['values'] = json_decode($data['values']);
        $created = Config::create($data);

        return Inertia::render('Config/Config', [
            'config' => $this->getConfig(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Config $config)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Config $config)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreConfigRequest $request, Config $config)
    {
        // Authorise the action.
        if ($request->user()->cannot('update', Config::class)) {
            abort(403);
        }

        // Save the validated data.
        $data = $request->safe()->only(['name', 'values', 'organisation_id']);

        // Decode the JSON.
        $data['values'] = json_decode($data['values']);

        // Save the data.
        $updated = $config->update($data);

        // Return the response.
        return Inertia::render('Config/Config', [
            'config' => $this->getConfig()
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Config $config)
    {
        //
    }

    /**
     * Return the configuration values.
     *
     * @return array|null
     */
    private function getConfig(): ?array
    {
        if (auth()->user()->hasRole('super')) {
            return Config::with('organisation')->get()->toArray();
        } else {
            return auth()->user()->organisation->config()->toArray();
        }
    }
}
