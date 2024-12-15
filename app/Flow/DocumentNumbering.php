<?php

namespace App\Flow;

final class DocumentNumbering extends Config
{
    protected $template = null;
    protected $index = null;
    protected $documentNumber = null;
    protected $discipline = null;
    protected $area = null;
    protected $type = null;

    /**
     * Constructor.
     */
    public function __construct(?string $discipline, ?string $area, ?string $type)
    {
        $this->discipline = $discipline;
        $this->area = $area;
        $this->type = $type;
    }

    public function generate(): self
    {
        //
        return $this;
    }

    public function populate()
    {

    }
}
