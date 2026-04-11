import { Head, Link, usePage } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import GuestLayout from "@/Layouts/GuestLayout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import TaxpayerIdentity from "./TaxpayerIdentity";
import ContactDetails from "./ContactDetails";
import { Check } from "lucide-react";
import RelatedPersons from "./RelatedPersons";
import EconomicData from "./EconomicData";
import Address from "./Address";
import IdentityVerification from "./IdentityVerification";
import TaxpayerStatement from "./TaxpayerStatement";

interface RegistrationData {
    step1?: any;
    step2?: any;
    step3?: any;
    step4?: any;
    step5?: any;
    step6?: any;
    step7?: any;
}

export default function NIKRegistration({
    taxpayerEconomies,
}: {
    taxpayerEconomies: any[];
}) {
    const { flash }: any = usePage().props;
    const [currentStep, setCurrentStep] = useState(1);
    const [registrationData, setRegistrationData] = useState<RegistrationData>(
        {}
    );
    const [shouldClearOnUnload, setShouldClearOnUnload] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [confirmationShown, setConfirmationShown] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);

        const pageAccessedByReload =
            (window.performance.navigation &&
                window.performance.navigation.type === 1) ||
            window.performance
                .getEntriesByType("navigation")
                .map((nav) => (nav as PerformanceNavigationTiming).type)
                .includes("reload");

        const hasExistingData = loadDataFromSession();

        if (pageAccessedByReload && hasExistingData && !confirmationShown) {
            setConfirmationShown(true);
            setTimeout(() => {
                const shouldContinue = window.confirm(
                    "Halaman telah di-refresh. Data pendaftaran yang belum selesai akan dihapus. Apakah Anda ingin memulai dari awal?"
                );

                if (shouldContinue) {
                    clearSessionData();
                    setCurrentStep(1);
                    toast.success(
                        "Data pendaftaran telah direset. Silakan mulai dari awal."
                    );
                } else {
                    toast.success("Melanjutkan dengan data yang tersimpan.");
                }
                setIsInitialized(true);
            }, 500);
        } else {
            setIsInitialized(true);
        }
    }, [flash?.success, flash?.error]);

    const loadDataFromSession = (): boolean => {
        try {
            const savedData = sessionStorage.getItem("registrationData");
            const savedStep = sessionStorage.getItem("registrationCurrentStep");

            let hasData = false;

            if (savedData && savedData !== "{}") {
                const parsedData = JSON.parse(savedData);
                if (Object.keys(parsedData).length > 0) {
                    setRegistrationData(parsedData);
                    hasData = true;
                }
            }

            if (savedStep) {
                const stepNumber = parseInt(savedStep);
                if (stepNumber > 1 && stepNumber <= 7) {
                    setCurrentStep(stepNumber);
                    hasData = true;
                }
            }

            return hasData;
        } catch (error) {
            return false;
        }
    };

    const clearSessionData = () => {
        try {
            const keysToRemove = [
                "registrationData",
                "registrationCurrentStep",
                "contactDetailsData",
                "addressData",
                "economicData",
                "identityVerificationData",
                "taxpayerIdentityData",
                "relatedPersonsData",
                "sessionMarker",
                "userLeavingPage",
            ];

            keysToRemove.forEach((key) => {
                sessionStorage.removeItem(key);
            });

            const allKeys = Object.keys(sessionStorage);
            allKeys.forEach((key) => {
                if (
                    key.startsWith("registration") ||
                    key.startsWith("taxpayer")
                ) {
                    sessionStorage.removeItem(key);
                }
            });

            setRegistrationData({});
            setCurrentStep(1);
        } catch (error) {
            console.error("Error clearing session data:", error);
        }
    };

    const saveDataToSession = (stepData: any, step: number) => {
        const updatedData = {
            ...registrationData,
            [`step${step}`]: stepData,
        };

        setRegistrationData(updatedData);
        sessionStorage.setItem("registrationData", JSON.stringify(updatedData));
        sessionStorage.setItem("registrationCurrentStep", step.toString());
    };

    const steps = [
        {
            number: 1,
            title: "Identitas Wajib Pajak",
            active: currentStep === 1,
        },
        { number: 2, title: "Detail Kontak", active: currentStep === 2 },
        { number: 3, title: "Orang Terkait", active: currentStep === 3 },
        { number: 4, title: "Data Ekonomi", active: currentStep === 4 },
        { number: 5, title: "Alamat", active: currentStep === 5 },
        { number: 6, title: "Verifikasi Identitas", active: currentStep === 6 },
        {
            number: 7,
            title: "Pernyataan Wajib Pajak",
            active: currentStep === 7,
        },
    ];

    const handleNextStep = (stepData?: any) => {
        if (currentStep === 7) {
            handleFinalSubmit(stepData);
            return;
        }

        saveDataToSession(stepData, currentStep);

        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        sessionStorage.setItem("registrationCurrentStep", nextStep.toString());
    };

    const handleFinalSubmit = async (allRegistrationData?: any) => {
        try {
            setShouldClearOnUnload(true);

            clearSessionData();

            setTimeout(() => {
                window.location.href =
                    route("registration-portal") || "/registration-portal";
            }, 2000);
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyelesaikan pendaftaran");
            setShouldClearOnUnload(false);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <TaxpayerIdentity
                        onNext={handleNextStep}
                        existingData={registrationData.step1}
                    />
                );
            case 2:
                return (
                    <ContactDetails
                        onNext={handleNextStep}
                        existingData={registrationData.step2}
                    />
                );
            case 3:
                return (
                    <RelatedPersons
                        onNext={handleNextStep}
                        existingData={registrationData.step3}
                    />
                );
            case 4:
                return (
                    <EconomicData
                        onNext={handleNextStep}
                        existingData={{
                            ...registrationData.step4,
                            taxpayer_identity_id:
                                registrationData.step1?.id ||
                                sessionStorage.getItem("taxpayer_identity_id"),
                        }}
                        taxpayerEconomies={taxpayerEconomies}
                    />
                );
            case 5:
                const addressData = (() => {
                    try {
                        const saved = sessionStorage.getItem("addressData");
                        return saved
                            ? JSON.parse(saved)
                            : registrationData.step5;
                    } catch {
                        return registrationData.step5;
                    }
                })();

                return (
                    <Address
                        onNext={handleNextStep}
                        existingData={addressData}
                    />
                );
            case 6:
                const identityData = (() => {
                    try {
                        const saved = sessionStorage.getItem(
                            "identityVerificationData"
                        );
                        return saved
                            ? JSON.parse(saved)
                            : registrationData.step6;
                    } catch {
                        return registrationData.step6;
                    }
                })();

                return (
                    <IdentityVerification
                        onNext={handleNextStep}
                        existingData={identityData}
                    />
                );
            case 7:
                return (
                    <TaxpayerStatement
                        onNext={handleFinalSubmit}
                        existingData={registrationData.step7}
                    />
                );
            default:
                return (
                    <div className="text-center py-8">
                        <h2 className="text-2xl font-bold mb-4">
                            Step {currentStep}
                        </h2>
                        <p className="mb-6">
                            Content for step {currentStep} will be implemented
                            here.
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={() => handleNextStep({})}
                                className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
                            >
                                Lanjut
                            </button>
                        </div>
                    </div>
                );
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (shouldClearOnUnload || currentStep === 1 || confirmationShown) {
                return;
            }

            const isRefresh =
                e.type === "beforeunload" &&
                (window.performance.navigation?.type === 1 ||
                    window.performance
                        .getEntriesByType("navigation")
                        .some(
                            (nav) =>
                                (nav as PerformanceNavigationTiming).type ===
                                "reload"
                        ));

            if (isRefresh) {
                return;
            }

            const hasData =
                sessionStorage.getItem("registrationData") ||
                sessionStorage.getItem("registrationCurrentStep");

            if (hasData) {
                e.preventDefault();
                const message =
                    "Data yang telah diisi akan hilang jika Anda meninggalkan halaman ini. Apakah Anda yakin?";
                e.returnValue = message;
                return message;
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [currentStep, shouldClearOnUnload, confirmationShown]);

    if (!isInitialized) {
        return (
            <GuestLayout>
                <Head title="Pendaftaran NIK - Loading..." />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </GuestLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Pendaftaran NIK - Identitas Wajib Pajak" />

            <div className="text-center mb-8">
                <div className="flex justify-center mb-6">
                    <img
                        src="/images/logo.png"
                        alt="Brevet Learning System"
                        className="w-36"
                    />
                </div>

                <div className="mb-8 overflow-x-auto">
                    <div className="flex items-start space-x-2 md:space-x-4 px-4">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-start">
                                <div className="flex flex-col items-center min-w-0">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 mb-2",
                                            step.active
                                                ? "bg-blue-900 text-white border-blue-900"
                                                : currentStep > step.number
                                                ? "bg-green-600 text-white border-green-600"
                                                : "bg-gray-100 text-gray-500 border-gray-300"
                                        )}
                                    >
                                        {currentStep > step.number ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            step.number
                                        )}
                                    </div>
                                    <div className="text-xs text-center max-w-16 leading-tight">
                                        {step.title}
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex items-center h-10">
                                        <div
                                            className={cn(
                                                "w-8 md:w-16 h-0.5 mx-2",
                                                currentStep > step.number
                                                    ? "bg-green-600"
                                                    : "bg-gray-300"
                                            )}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Card className="max-w-6xl mx-auto">
                <CardContent className="p-8">{renderStep()}</CardContent>
            </Card>
        </GuestLayout>
    );
}
