import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useState } from "react";

interface TaxpayerEconomy {
    id: string;
    code: string;
    name: string;
    description: string;
    start_date: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    availableEconomies: TaxpayerEconomy[];
    onSelectEconomy: (economy: TaxpayerEconomy) => void;
}

export default function EconomySearchDialog({
    isOpen,
    onClose,
    availableEconomies,
    onSelectEconomy,
}: Props) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredEconomies = availableEconomies.filter(
        (economy) =>
            economy.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            economy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            economy.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectEconomy = (economy: TaxpayerEconomy) => {
        onSelectEconomy(economy);
        handleClose();
    };

    const handleClose = () => {
        setSearchTerm("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Pencarian Ekonomi</DialogTitle>
                    <DialogDescription>
                        Pilih kode ekonomi yang sesuai dengan aktivitas usaha
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <Input
                        placeholder="Cari berdasarkan kode, nama, atau deskripsi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="bg-white rounded-lg border overflow-hidden">
                        <div className="bg-yellow-100 border-b">
                            <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium text-gray-700">
                                <div>Kode</div>
                                <div>Nama Kode</div>
                                <div>Deskripsi Kode</div>
                                <div>Tanggal Mulai</div>
                            </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto divide-y">
                            {filteredEconomies.length > 0 ? (
                                filteredEconomies.map((economy) => (
                                    <div
                                        key={economy.id}
                                        className="grid grid-cols-4 gap-4 p-4 text-sm hover:bg-gray-50 cursor-pointer"
                                        onClick={() =>
                                            handleSelectEconomy(economy)
                                        }
                                    >
                                        <div className="flex md:flex-row flex-col items-center">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="mr-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectEconomy(
                                                        economy
                                                    );
                                                }}
                                            >
                                                Pilih
                                            </Button>
                                            {economy.code}
                                        </div>
                                        <div>{economy.name}</div>
                                        <div>{economy.description}</div>
                                        <div>
                                            {new Date(
                                                economy.start_date
                                            ).toLocaleDateString("id-ID")}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    {availableEconomies.length === 0
                                        ? "Data ekonomi tidak tersedia"
                                        : "Tidak ada data yang sesuai dengan pencarian"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
