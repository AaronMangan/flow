<?php

namespace App\Flow\Filters;

use Illuminate\Database\Eloquent\Builder;

final class SearchFilter extends FilterBuilder
{
    protected $model;

    public function __construct(Builder $query, array $filters = [])
    {
        // Call the parent constructor.
        parent::__construct($query, $filters);

        $this->model = $this->query->getModel();
    }

    public static function key(): string
    {
        return 'search';
    }

    /**
     * Defines how the filter interacts with the application, by specify with fields it can use and which models it works with, etc.
     */
    public function definition(): array
    {
        return [
            'key' => 'search',      // What the incoming key in the data is.
            'fields' => '*',        // What field/s the filter applies to.
            'models' => '*'         // Specify which models this filter works with. Use '*' for all models.
        ];
    }

    public function build(): Builder
    {
        foreach($this->columns() as $col) {
            $this->query->orWhere($col, 'like', "%{$this->filters[self::key()]}%");
        }
        return $this->query;
    }

    public function dump()
    {
        return $this->query->dd();
    }

    private function columns(): array
    {
        return (!is_array($this->definition()['fields']) && $this->definition()['fields'] == '*') 
            ? $this->model->getFillable()
            : $this->definition()['fields'];
    }
}