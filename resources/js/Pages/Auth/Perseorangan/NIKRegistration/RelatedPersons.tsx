import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import { Plus } from "lucide-react";

interface Props {
    onNext: (responseData?: any) => void;
    existingData?: any;
}

export default function RelatedPersons({ onNext }: Props) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onNext({});
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Masukkan orang terkait wajib pajak.
                </h1>
            </div>

            <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-8">
                    Tambahkan Orang yang Mempunyai Hubungan Istimewa
                </h2>

                <div className="flex justify-center mb-8">
                    <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <div className="flex flex-col items-center bg-blue-900 p-1 rounded-full">
                            <Plus className="w-12 h-12 text-white" />
                        </div>
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="flex justify-end items-center pt-6">
                    <Button
                        type="submit"
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        Lanjut
                    </Button>
                </div>
            </form>
        </div>
    );
}
