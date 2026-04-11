<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class RegionController extends Controller
{
    private $baseUrl = 'https://wilayah.id/api';
    private $cacheTimeout = 3600; // 1 jam

    public function provinces(): JsonResponse
    {
        try {
            $cacheKey = 'wilayah_provinces';

            $data = Cache::remember($cacheKey, $this->cacheTimeout, function () {
                $response = Http::timeout(30)->get("{$this->baseUrl}/provinces.json");

                if ($response->successful()) {
                    $responseData = $response->json();

                    if (isset($responseData['data'])) {
                        return collect($responseData['data'])->map(function ($item) {
                            return [
                                'id' => $item['code'],
                                'name' => $item['name']
                            ];
                        })->toArray();
                    }

                    return $responseData;
                }

                throw new \Exception('Failed to fetch provinces');
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service unavailable'], 503);
        }
    }

    public function regencies(string $provinceCode): JsonResponse
    {
        try {
            $cacheKey = "wilayah_regencies_{$provinceCode}";

            $data = Cache::remember($cacheKey, $this->cacheTimeout, function () use ($provinceCode) {
                $response = Http::timeout(30)->get("{$this->baseUrl}/regencies/{$provinceCode}.json");

                if ($response->successful()) {
                    $responseData = $response->json();

                    if (isset($responseData['data'])) {
                        return collect($responseData['data'])->map(function ($item) {
                            return [
                                'id' => $item['code'],
                                'name' => $item['name']
                            ];
                        })->toArray();
                    }

                    return $responseData;
                }

                throw new \Exception('Failed to fetch regencies');
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service unavailable'], 503);
        }
    }

    public function districts(string $regencyCode): JsonResponse
    {
        try {
            $cacheKey = "wilayah_districts_{$regencyCode}";

            $data = Cache::remember($cacheKey, $this->cacheTimeout, function () use ($regencyCode) {
                $response = Http::timeout(30)->get("{$this->baseUrl}/districts/{$regencyCode}.json");

                if ($response->successful()) {
                    $responseData = $response->json();

                    if (isset($responseData['data'])) {
                        return collect($responseData['data'])->map(function ($item) {
                            return [
                                'id' => $item['code'],
                                'name' => $item['name']
                            ];
                        })->toArray();
                    }

                    return $responseData;
                }

                throw new \Exception('Failed to fetch districts');
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service unavailable'], 503);
        }
    }

    public function villages(string $districtCode): JsonResponse
    {
        try {
            $cacheKey = "wilayah_villages_{$districtCode}";

            $data = Cache::remember($cacheKey, $this->cacheTimeout, function () use ($districtCode) {
                $response = Http::timeout(30)->get("{$this->baseUrl}/villages/{$districtCode}.json");

                if ($response->successful()) {
                    $responseData = $response->json();

                    if (isset($responseData['data'])) {
                        return collect($responseData['data'])->map(function ($item) {
                            return [
                                'id' => $item['code'],
                                'name' => $item['name']
                            ];
                        })->toArray();
                    }

                    return $responseData;
                }

                throw new \Exception('Failed to fetch villages');
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Service unavailable'], 503);
        }
    }

    public function getCoordinates(string $villageCode): JsonResponse
    {
        try {
            $cacheKey = "village_coordinates_{$villageCode}";

            $data = Cache::remember($cacheKey, $this->cacheTimeout, function () use ($villageCode) {
                // Try multiple geocoding services

                // Option 1: Try Nominatim (OpenStreetMap)
                $coordinates = $this->getCoordinatesFromNominatim($villageCode);

                if (!$coordinates) {
                    // Option 2: Generate approximate coordinates based on village code
                    $coordinates = $this->generateApproximateCoordinates($villageCode);
                }

                return $coordinates;
            });

            return response()->json($data);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to get coordinates'], 500);
        }
    }

    private function getCoordinatesFromNominatim(string $villageCode): ?array
    {
        try {
            // Get village details first
            $villageResponse = Http::timeout(30)->get("{$this->baseUrl}/village/{$villageCode}.json");

            if (!$villageResponse->successful()) {
                return null;
            }

            $villageData = $villageResponse->json();
            $villageName = $villageData['name'] ?? '';

            if (empty($villageName)) {
                return null;
            }

            // Search coordinates using Nominatim
            $searchQuery = urlencode($villageName . ', Indonesia');
            $nominatimUrl = "https://nominatim.openstreetmap.org/search?q={$searchQuery}&format=json&limit=1";

            $response = Http::timeout(30)
                ->withHeaders([
                    'User-Agent' => 'EFaktur-App/1.0'
                ])
                ->get($nominatimUrl);

            if ($response->successful()) {
                $results = $response->json();

                if (!empty($results)) {
                    $result = $results[0];
                    return [
                        'latitude' => (float) $result['lat'],
                        'longitude' => (float) $result['lon'],
                        'formatted_coordinates' => $result['lat'] . ', ' . $result['lon'],
                        'source' => 'nominatim'
                    ];
                }
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function generateApproximateCoordinates(string $villageCode): array
    {
        // Fallback: Generate approximate coordinates based on region
        // This is a simplified approach - in production, you'd want a proper mapping

        $provinceCode = substr($villageCode, 0, 2);

        // Approximate center coordinates for Indonesian provinces
        $provinceCoordinates = [
            '11' => [-4.695135, 96.749397],   // Aceh
            '12' => [2.115717, 99.062752],    // Sumatera Utara
            '13' => [-0.789275, 100.414650],  // Sumatera Barat
            '14' => [0.533415, 101.449539],   // Riau
            '15' => [-1.609972, 103.607254],  // Jambi
            '16' => [-3.319694, 104.914424],  // Sumatera Selatan
            '17' => [-3.786756, 102.265894],  // Bengkulu
            '18' => [-4.558042, 105.4068],    // Lampung
            '19' => [-2.741927, 106.440735],  // Kepulauan Bangka Belitung
            '21' => [0.916674, 104.459309],   // Kepulauan Riau
            '31' => [-6.200000, 106.816666],  // DKI Jakarta
            '32' => [-6.914744, 107.609810],  // Jawa Barat
            '33' => [-7.150975, 110.140259],  // Jawa Tengah
            '34' => [-7.797068, 110.370529],  // Daerah Istimewa Yogyakarta
            '35' => [-7.517611, 112.238229],  // Jawa Timur
            '36' => [-6.395981, 106.817261],  // Banten
            '51' => [-8.340539, 115.091949],  // Bali
            '52' => [-8.652894, 117.362595],  // Nusa Tenggara Barat
            '53' => [-8.874217, 121.774017],  // Nusa Tenggara Timur
            '61' => [-0.026611, 109.342003],  // Kalimantan Barat
            '62' => [-1.681488, 113.382355],  // Kalimantan Tengah
            '63' => [-3.0926415, 115.2837585], // Kalimantan Selatan
            '64' => [0.502183, 117.153709],   // Kalimantan Timur
            '65' => [2.72077, 117.13902],     // Kalimantan Utara
            '71' => [0.6246932, 123.9750018], // Sulawesi Utara
            '72' => [-1.4300254, 121.4456179], // Sulawesi Tengah
            '73' => [-4.269928, 119.9740534], // Sulawesi Selatan
            '74' => [-4.14491, 122.174605],   // Sulawesi Tenggara
            '75' => [0.6999372, 122.4467238], // Gorontalo
            '76' => [-2.8441371, 119.2320784], // Sulawesi Barat
            '81' => [-3.2384616, 130.1452734], // Maluku
            '82' => [1.5709993, 127.8087693], // Maluku Utara
            '91' => [-4.269928, 138.0803529], // Papua (former)
            '92' => [-1.3361154, 133.1747162], // Papua Barat
            '93' => [-6.08, 140.52],          // Papua Selatan (estimated)
            '94' => [-3.31, 138.03],          // Papua Tengah (estimated)
            '95' => [-4.06, 138.95],          // Papua Pegunungan (estimated)
            '96' => [-1.69, 132.30],          // Papua Barat Daya (estimated)
        ];

        $coordinates = $provinceCoordinates[$provinceCode] ?? [-6.200000, 106.816666];

        // Add small random offset to make it more specific to village
        $latOffset = (hexdec(substr($villageCode, -4, 2)) - 127) / 10000;
        $lonOffset = (hexdec(substr($villageCode, -2)) - 127) / 10000;

        $latitude = $coordinates[0] + $latOffset;
        $longitude = $coordinates[1] + $lonOffset;

        return [
            'latitude' => round($latitude, 6),
            'longitude' => round($longitude, 6),
            'formatted_coordinates' => round($latitude, 6) . ', ' . round($longitude, 6),
            'source' => 'approximate'
        ];
    }
}
