<?php

namespace App\Traits;

use App\Models\Document;
use App\Models\Area;
use App\Models\Discipline;
use App\Models\Type;

trait GeneratesDocumentNumbers
{
    public static function generate(array $data = []): ?string
    {
        $area = Area::find($data['area_id']);
        $discipline = Discipline::find($data['discipline_id']);
        $type = Type::find($data['type_id']);

        $validate = [
            $area->code ?? false,
            $discipline->code ?? false,
            $type->code ?? false
        ];

        if (in_array(false, $validate)) {
            return '';
        }

        $countQuery = [
            ['area_id', '=', $data['area_id']],
            ['discipline_id', '=', $data['discipline_id']],
            ['type_id', '=', $data['type_id']]
        ];

        $countOf = Document::where($countQuery)->count() + 1;
        $indexOf = str_pad($countOf, 6, '0', STR_PAD_LEFT);
        return "{$area->code}-{$discipline->code}-{$type->code}-{$indexOf}";
    }
}
