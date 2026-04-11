<?php

namespace App\Http\Controllers;

use App\Models\TaxpayerEconomy;
use App\Models\TaxpayerIdentity;
use App\Models\TaxpayerAddress;
use App\Models\TaxpayerAccounting;
use App\Models\TaxpayerSourceIncome;
use App\Models\TaxpayerSourceIncomeEconomy;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Milon\Barcode\DNS2D;

class NIKRegistrationController extends Controller
{
    public function index()
    {
        $taxpayerEconomies = TaxpayerEconomy::all();
        return Inertia::render('Auth/Perseorangan/NIKRegistration/NIKRegistration', [
            'taxpayerEconomies' => $taxpayerEconomies
        ]);
    }

    public function checkNik(Request $request)
    {
        $request->validate([
            'nik' => 'required|string|size:16'
        ]);

        $taxpayerIdentity = TaxpayerIdentity::where('nik', $request->nik)->first();

        return response()->json([
            'exists' => $taxpayerIdentity ? true : false,
            'data' => $taxpayerIdentity
        ]);
    }

    public function register(Request $request)
    {
        try {
            DB::beginTransaction();

            // Log::info('Registration data received:', $request->all());

            $taxpayerData = $request->input('taxpayerIdentity', []);
            $contactData = $request->input('contactDetails', []);
            $relatedPersonsData = $request->input('relatedPersons', []);
            $economicData = $request->input('economicData', []);
            $addressesData = $request->input('addresses', []);
            $identityVerificationData = $request->input('identityVerification', []);
            $statementData = $request->input('statement', []);

            // Log::info('Extracted taxpayer data:', $taxpayerData);
            // Log::info('Extracted contact data:', $contactData);
            // Log::info('Extracted economic data:', $economicData);

            if (empty($taxpayerData)) {
                throw new \Exception('Data identitas wajib pajak tidak ditemukan');
            }

            if (empty($taxpayerData['nik'])) {
                throw new \Exception('NIK wajib diisi');
            }

            $existingTaxpayer = TaxpayerIdentity::where('nik', $taxpayerData['nik'])->first();
            if ($existingTaxpayer) {
                throw new \Exception('NIK sudah terdaftar dalam sistem');
            }

            $taxpayerIdentity = TaxpayerIdentity::create([
                'nik' => $taxpayerData['nik'],
                'name' => $taxpayerData['name'] ?? null,
                'type' => $taxpayerData['type'] ?? 'Orang Pribadi atau Warisan Belum Terbagi',
                'birth_place' => $taxpayerData['birth_place'] ?? null,
                'birth_date' => $taxpayerData['birth_date'] ?? null,
                'country' => $taxpayerData['country'] ?? null,
                'gender' => $taxpayerData['gender'] ?? null,
                'marital_status' => $taxpayerData['marital_status'] ?? null,
                'religion' => $taxpayerData['religion'] ?? null,
                'occupation' => $taxpayerData['occupation'] ?? null,
                'mother_name' => $taxpayerData['mother_name'] ?? null,
                'family_card_number' => $taxpayerData['family_card_number'] ?? null,
                'family_relationship_status' => $taxpayerData['family_relationship_status'] ?? null,
                'individual_category' => $taxpayerData['individual_category'] ?? null,
                'email' => $contactData['email'] ?? null,
                'mobile_phone_number' => $contactData['mobile_phone_number'] ?? null,
                'phone_number' => $contactData['phone_number'] ?? null,
                'fax_number' => $contactData['fax_number'] ?? null,
            ]);

            // Log::info('Taxpayer identity created:', ['id' => $taxpayerIdentity->id]);

            if (!empty($identityVerificationData['photoPreview'])) {
                try {
                    $photoData = $identityVerificationData['photoPreview'];
                    if (strpos($photoData, 'data:image/') === 0) {
                        $photoData = substr($photoData, strpos($photoData, ',') + 1);
                        $photoData = base64_decode($photoData);

                        $fileName = 'taxpayer-photo-' . $taxpayerIdentity->id . '-' . time() . '.jpg';
                        $filePath = 'taxpayer-photos/' . $fileName;

                        Storage::disk('public')->makeDirectory('taxpayer-photos');
                        Storage::disk('public')->put($filePath, $photoData);

                        $taxpayerIdentity->update(['photo' => $filePath]);

                        // Log::info('Photo saved:', ['path' => $filePath]);
                    }
                } catch (\Exception $e) {
                    // Log::warning('Failed to save photo: ' . $e->getMessage());
                }
            }

            $accounting = null;
            if (!empty($economicData) && !empty($economicData['source_incomes'])) {
                // Log::info('Processing economic data with source_incomes:', $economicData);

                $accounting = TaxpayerAccounting::create([
                    'taxpayer_identity_id' => $taxpayerIdentity->id,
                    'accounting_method' => $economicData['accounting_method'] ?? 'Pencatatan',
                    'accounting_currency' => $economicData['currency'] ?? 'Rupiah Indonesia',
                    'accounting_period' => $economicData['accounting_period'] ?? '01-12',
                ]);

                // Log::info('Taxpayer accounting created:', ['id' => $accounting->id]);

                foreach ($economicData['source_incomes'] as $sourceIncomeData) {
                    // Log::info('Processing source income:', $sourceIncomeData);

                    $sourceIncome = TaxpayerSourceIncome::create([
                        'taxpayer_accounting_id' => $accounting->id,
                        'source_income' => $sourceIncomeData['source_income'] ?? 'N/A',
                        'workplace' => $sourceIncomeData['workplace'] ?? 'N/A',
                        'monthly_income' => $sourceIncomeData['monthly_income'] ?? '0',
                    ]);

                    // Log::info('Source income created:', ['id' => $sourceIncome->id]);

                    $economyIds = [];

                    if (!empty($sourceIncomeData['economies']) && is_array($sourceIncomeData['economies'])) {
                        foreach ($sourceIncomeData['economies'] as $economy) {
                            if (!empty($economy['id']) && !in_array($economy['id'], $economyIds)) {
                                $economyIds[] = $economy['id'];
                            }
                        }
                    }

                    if (!empty($sourceIncomeData['economy_ids']) && is_array($sourceIncomeData['economy_ids'])) {
                        foreach ($sourceIncomeData['economy_ids'] as $economyId) {
                            if (!empty($economyId) && !in_array($economyId, $economyIds)) {
                                $economyIds[] = $economyId;
                            }
                        }
                    }

                    foreach ($economyIds as $economyId) {
                        $existingRelation = TaxpayerSourceIncomeEconomy::where([
                            'taxpayer_source_income_id' => $sourceIncome->id,
                            'taxpayer_economy_id' => $economyId
                        ])->first();

                        if (!$existingRelation) {
                            TaxpayerSourceIncomeEconomy::create([
                                'taxpayer_source_income_id' => $sourceIncome->id,
                                'taxpayer_economy_id' => $economyId,
                            ]);

                            // Log::info('Source income economy linked:', [
                            //     'source_income_id' => $sourceIncome->id,
                            //     'economy_id' => $economyId
                            // ]);
                        } else {
                            // Log::info('Source income economy relationship already exists, skipping:', [
                            //     'source_income_id' => $sourceIncome->id,
                            //     'economy_id' => $economyId
                            // ]);
                        }
                    }
                }
            } else {
                // Log::warning('No economic data or source_incomes found:', $economicData);
            }

            if (!empty($addressesData['addresses']) && is_array($addressesData['addresses'])) {
                foreach ($addressesData['addresses'] as $address) {
                    TaxpayerAddress::create([
                        'taxpayer_identity_id' => $taxpayerIdentity->id,
                        'address_type' => $address['address_type'] ?? null,
                        'address_detail' => $address['address_detail'] ?? null,
                        'rt' => $address['rt'] ?? null,
                        'rw' => $address['rw'] ?? null,
                        'province' => $address['province'] ?? null,
                        'region' => $address['region'] ?? null,
                        'district' => $address['district'] ?? null,
                        'sub_district' => $address['sub_district'] ?? null,
                        'region_code' => $address['region_code'] ?? null,
                        'post_code' => $address['post_code'] ?? null,
                        'geometric_data' => $address['geometric_data'] ?? null,
                        'supervisory_section' => $address['supervisory_section'] ?? null,
                    ]);
                }

                // Log::info('Addresses created:', ['count' => count($addressesData['addresses'])]);
            }

            // $npwpNumber = $this->generateNPWPNumber($taxpayerIdentity->id);
            $npwpNumber = $taxpayerIdentity->nik;
            $taxpayerIdentity->update(['npwp' => $npwpNumber]);

            DB::commit();

            $responseData = [
                'success' => true,
                'message' => 'Pendaftaran NPWP berhasil diajukan!',
                'taxpayer_id' => $taxpayerIdentity->id,
                'registration_number' => 'REG-' . str_pad($taxpayerIdentity->id, 6, '0', STR_PAD_LEFT),
                'npwp' => $npwpNumber
            ];

            if ($request->expectsJson()) {
                return response()->json($responseData);
            }

            return redirect()
                ->route('registration.confirmation', $taxpayerIdentity->id)
                ->with('success', $responseData['message']);
        } catch (\Exception $e) {
            DB::rollBack();
            // Log::error('Registration failed: ' . $e->getMessage(), [
            //     'trace' => $e->getTraceAsString(),
            //     'request_data' => $request->all()
            // ]);

            $errorMessage = 'Gagal mengajukan pendaftaran: ' . $e->getMessage();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage
                ], 500);
            }

            return back()->withErrors(['message' => $errorMessage]);
        }
    }

    public function confirmationPage($taxpayerId)
    {
        $taxpayer = TaxpayerIdentity::with(['addresses', 'accountings.sourceIncomes.economies'])
            ->findOrFail($taxpayerId);

        return Inertia::render('Auth/Perseorangan/NIKRegistration/RegistrationConfirmation', [
            'taxpayer' => $taxpayer
        ]);
    }

    private function generateQrCode($url)
    {
        try {
            $qrCodeGenerator = new DNS2D();

            $qrCodePng = $qrCodeGenerator->getBarcodePNG($url, 'QRCODE', 10, 10);
            if ($qrCodePng) {
                return 'data:image/png;base64,' . $qrCodePng;
            }

            $qrCodeSvg = $qrCodeGenerator->getBarcodeSVG($url, 'QRCODE', 8, 8, 'black', false);
            if ($qrCodeSvg) {
                $qrCodeSvg = str_replace(['<?xml version="1.0" encoding="UTF-8"?>', '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">'], '', $qrCodeSvg);
                return 'data:image/svg+xml;base64,' . base64_encode($qrCodeSvg);
            }

            return null;
        } catch (\Exception $e) {
            Log::warning('Failed to generate QR code: ' . $e->getMessage());
            return null;
        }
    }

    public function generateNPWPPDF($taxpayerId)
    {
        $taxpayer = TaxpayerIdentity::with(['addresses', 'accountings.sourceIncomes.economies'])
            ->findOrFail($taxpayerId);
        $qrCode = $this->generateQrCode($taxpayer->npwp);

        $pdf = PDF::loadView('pdf/npwp', compact('taxpayer', 'qrCode'));

        $fileName = 'NPWP-' . $taxpayer->npwp . '.pdf';


        return $pdf->stream($fileName);
    }

    private function generateNPWPNumber($taxpayerId)
    {
        do {
            $npwpNumber = '';

            $npwpNumber .= rand(1, 9);

            for ($i = 1; $i < 16; $i++) {
                $npwpNumber .= rand(0, 9);
            }

            $exists = TaxpayerIdentity::where('npwp', $npwpNumber)->exists();
        } while ($exists);

        return $npwpNumber;
    }

    public function finalSubmit(Request $request)
    {
        return $this->register($request);
    }
}
