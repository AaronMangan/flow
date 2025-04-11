<?php

namespace App\Flow\Filters;
use Illuminate\Database\Eloquent\Builder;

abstract class FilterBuilder
{
    protected array $filters;
    
    protected Builder $query;
    
    protected $registered = [];
    
    abstract public static function key(): string;
    abstract public function build(): Builder;

    /**
     * Public constructor.
     *
     * @param Builder $query
     * @param array $filters
     */
    public function __construct(Builder $query, array $filters = [])
    {
        $this->query = $query ?? null;
        $this->filters = $filters ?? [];

        $this->register(static::key(), $this);
    }

    public function register($key, $filterInstance) {
        $this->registered[$key] = $filterInstance;
    }

    public function apply(): Builder
    {
        foreach($registered as $key => $filter) {
            $this->query = $filter->build();
        }
        
        return $this->query;
    }
}