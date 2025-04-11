<?php

namespace App\Flow\Filters;

use Illuminate\Database\Eloquent\Builder;

final class DisciplineFilter extends FilterBuilder
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
        return 'discipline';
    }

    public function definition(): array
    {
        return [
            'key' => 'discipline',              // What the incoming key in the data is.
            'fields' => ['discipline_id'],      // What field/s the filter applies to.
            'models' => [                       // The models that the filter works for.
                \App\Models\Document::class,
            ]
        ];
    }

    public function build(): Builder
    {
        foreach($this->columns() as $col) {
            $this->query->where($col, $this->filters[self::key()]);
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