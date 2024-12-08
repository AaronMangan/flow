<?php

namespace App\Http\Controllers;

use App\Models\Config;
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
        $data = $request->safe()->only(['name', 'values']);
        $data['organisation_id'] = \Auth::user()->organisation_id;
        $data['values'] = json_decode($data['values']);
        $created = Config::create($data);

        return Inertia::render('Config/Config', [
            'config' => $this->getConfig(),
            'status' => 'success'
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
    public function update(Request $request, Config $config)
    {
        //
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
            return Config::all()->toArray();
        } else {
            return auth()->user()->organisation->config->toArray();
        }
    }
}
