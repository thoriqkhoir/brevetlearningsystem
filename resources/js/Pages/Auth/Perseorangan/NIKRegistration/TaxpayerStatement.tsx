import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { router } from "@inertiajs/react";

interface Props {
    onNext: (responseData?: any) => void;
    existingData?: any;
}

export default function TaxpayerStatement({ onNext, existingData }: Props) {
    const [agreed, setAgreed] = useState(false);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreed) {
            toast.error("Anda harus menyetujui pernyataan untuk melanjutkan");
            return;
        }

        setProcessing(true);

        try {
            const registrationData = JSON.parse(
                sessionStorage.getItem("registrationData") || "{}"
            );

            let cleanedEconomicData = registrationData.step4 || {};
            if (
                cleanedEconomicData.source_incomes &&
                Array.isArray(cleanedEconomicData.source_incomes)
            ) {
                cleanedEconomicData.source_incomes =
                    cleanedEconomicData.source_incomes.map(
                        (sourceIncome: any) => {
                            const uniqueEconomyIds: (string | number)[] = [];
                            const uniqueEconomies: any[] = [];

                            if (
                                sourceIncome.economy_ids &&
                                Array.isArray(sourceIncome.economy_ids)
                            ) {
                                sourceIncome.economy_ids.forEach(
                                    (id: string | number) => {
                                        if (
                                            id &&
                                            !uniqueEconomyIds.includes(id)
                                        ) {
                                            uniqueEconomyIds.push(id);
                                        }
                                    }
                                );
                            }

                            if (
                                sourceIncome.economies &&
                                Array.isArray(sourceIncome.economies)
                            ) {
                                sourceIncome.economies.forEach(
                                    (economy: { id: string | number }) => {
                                        if (
                                            economy &&
                                            economy.id &&
                                            !uniqueEconomies.find(
                                                (e) => e.id === economy.id
                                            )
                                        ) {
                                            uniqueEconomies.push(economy);

                                            if (
                                                !uniqueEconomyIds.includes(
                                                    economy.id
                                                )
                                            ) {
                                                uniqueEconomyIds.push(
                                                    economy.id
                                                );
                                            }
                                        }
                                    }
                                );
                            }

                            return {
                                ...sourceIncome,
                                economy_ids: uniqueEconomyIds,
                                economies: uniqueEconomies,
                            };
                        }
                    );
            }

            const allData = {
                // Step 1 - Taxpayer Identity
                taxpayerIdentity: registrationData.step1 || {},

                // Step 2 - Contact Details
                contactDetails: registrationData.step2 || {},

                // Step 3 - Related Persons
                relatedPersons: registrationData.step3 || {},

                // Step 4 - Economic Data (menggunakan data yang sudah dibersihkan)
                economicData: cleanedEconomicData,

                // Step 5 - Address
                addresses: registrationData.step5 || {},

                // Step 6 - Identity Verification (ambil dari session storage terpisah jika ada)
                identityVerification:
                    registrationData.step6 ||
                    JSON.parse(
                        sessionStorage.getItem("identityVerificationData") ||
                            "{}"
                    ),

                // Step 7 - Statement
                statement: {
                    agreed: true,
                    agreedAt: new Date().toISOString(),
                },

                // Metadata
                submittedAt: new Date().toISOString(),
                userAgent: navigator.userAgent,
            };

            // Validasi data sebelum kirim
            if (
                !allData.taxpayerIdentity ||
                Object.keys(allData.taxpayerIdentity).length === 0
            ) {
                toast.error(
                    "Data identitas wajib pajak tidak lengkap. Silakan kembali ke step 1."
                );
                setProcessing(false);
                return;
            }

            if (
                !allData.contactDetails ||
                Object.keys(allData.contactDetails).length === 0
            ) {
                toast.error(
                    "Data kontak tidak lengkap. Silakan kembali ke step 2."
                );
                setProcessing(false);
                return;
            }

            router.post(route("taxpayer.register"), allData, {
                onSuccess: (page: any) => {
                    console.log("Registration successful:", page);
                    clearAllSessionData();

                    const taxpayerId =
                        page.props?.taxpayer_id || page.props?.taxpayer?.id;

                    if (taxpayerId) {
                        window.location.href = route(
                            "registration.confirmation",
                            taxpayerId
                        );
                    } else {
                        onNext(page.props);
                    }
                },
                onError: (errors) => {
                    console.error("Registration failed:", errors);
                    toast.error(
                        errors.message ||
                            "Gagal mengajukan permohonan pendaftaran"
                    );
                },
                onFinish: () => {
                    setProcessing(false);
                },
            });
        } catch (error) {
            console.error("Error submitting registration:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat mengajukan permohonan. Silakan coba lagi."
            );
            setProcessing(false);
        }
    };

    const clearAllSessionData = () => {
        try {
            // List semua key session storage yang perlu dihapus
            const keysToRemove = [
                "registrationData",
                "registrationCurrentStep",
                "taxpayerIdentityData",
                "contactDetailsData",
                "relatedPersonsData",
                "economicData",
                "addressData",
                "identityVerificationData",
            ];

            keysToRemove.forEach((key) => {
                sessionStorage.removeItem(key);
            });

            // Hapus semua key yang dimulai dengan 'registration' atau 'taxpayer'
            const allKeys = Object.keys(sessionStorage);
            allKeys.forEach((key) => {
                if (
                    key.startsWith("registration") ||
                    key.startsWith("taxpayer")
                ) {
                    sessionStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error("Error clearing session storage:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Mohon konfirmasi bahwa Wajib Pajak mematuhi pernyataan
                    berikut ini.
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Statement Box */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="statement-agreement"
                            checked={agreed}
                            onCheckedChange={(checked) =>
                                setAgreed(checked as boolean)
                            }
                            className="mt-1 flex-shrink-0"
                        />
                        <label
                            htmlFor="statement-agreement"
                            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                        >
                            Dengan menyadari sepenuhnya akan segala akibatnya
                            termasuk sanksi sesuai dengan ketentuan peraturan
                            perundang-undangan yang berlaku, saya menyatakan
                            bahwa apa yang saya sampaikan di atas adalah benar
                            dan lengkap, dan saya menyetujui untuk menggunakan
                            Akun Wajib Pajak saya sebagai sarana penerimaan
                            surat dan dokumen perpajakan.
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={!agreed || processing}
                        className={cn(
                            "px-8 py-3 font-medium rounded-lg transition-colors",
                            agreed && !processing
                                ? "bg-blue-900 text-white hover:bg-blue-800"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        )}
                    >
                        {processing ? (
                            <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Memproses...</span>
                            </div>
                        ) : (
                            "Ajukan Permohonan"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
