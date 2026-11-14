<?php

namespace App\Support;

use Illuminate\Validation\ValidationException;

class ReferenceLinkNormalizer
{
    /**
     * Validate and normalize dynamic reference_link payload into a clean list of {title, url} items.
     */
    public static function normalize(mixed $raw): ?array
    {
        if ($raw === null || $raw === '') {
            return null;
        }

        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                throw ValidationException::withMessages([
                    'reference_link' => 'Format link referensi tidak valid.',
                ]);
            }
            $raw = $decoded;
        }

        if (!is_array($raw)) {
            throw ValidationException::withMessages([
                'reference_link' => 'Format link referensi harus berupa daftar tautan.',
            ]);
        }

        $normalized = [];
        $index = 1;

        foreach ($raw as $item) {
            if (is_string($item)) {
                $title = '';
                $url = trim($item);
            } elseif (is_array($item)) {
                $title = trim((string) ($item['title'] ?? ''));
                $url = trim((string) ($item['url'] ?? ''));
            } else {
                continue;
            }

            if ($title === '' && $url === '') {
                continue;
            }

            if ($url === '') {
                throw ValidationException::withMessages([
                    'reference_link' => "URL link referensi ke-{$index} wajib diisi jika judul diisi.",
                ]);
            }

            $scheme = parse_url($url, PHP_URL_SCHEME);
            if (!filter_var($url, FILTER_VALIDATE_URL) || !in_array(strtolower((string) $scheme), ['http', 'https'], true)) {
                throw ValidationException::withMessages([
                    'reference_link' => "URL link referensi ke-{$index} tidak valid. Gunakan tautan lengkap http:// atau https://.",
                ]);
            }

            $normalized[] = [
                'title' => mb_substr($title !== '' ? $title : "Referensi {$index}", 0, 255),
                'url' => mb_substr($url, 0, 1000),
            ];
            $index++;
        }

        return count($normalized) > 0 ? $normalized : null;
    }
}
