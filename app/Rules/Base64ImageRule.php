<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class Base64ImageRule implements ValidationRule
{
    /**
     * The validation failure message
     */
    public const INVALID_SIGNATURE = 'Invalid signature';

    /**
     * Contains a list of acceptable file types for validation.
     */
    public const FILE_TYPE_ARRAY = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            // Check if the value starts with a valid base64 image prefix.
            if (!preg_match('/^data:image\/(png|jpg|jpeg|gif|webp);base64,/', $value)) {
                $fail(self::INVALID_SIGNATURE);
            }

            // Extract the base64 string without metadata.
            $exploded = explode(',', $value, 2);
            if (count($exploded) < 2) {
                $fail(self::INVALID_SIGNATURE);
            }

            // Decode base64 data so that we can check the file MIME type.
            $decoded = base64_decode($exploded[1], true);
            if ($decoded === false) {
                $fail(self::INVALID_SIGNATURE);
            }

            // Ensure the decoded data is a valid image.
            $f = finfo_open();
            $mimeType = finfo_buffer($f, $decoded, FILEINFO_MIME_TYPE);
            finfo_close($f);

            if (!in_array($mimeType, self::FILE_TYPE_ARRAY)) {
                $fail(self::INVALID_SIGNATURE);
            }
        } catch (\Exception $ex) {
            $fail(self::INVALID_SIGNATURE);
        }
    }
}
