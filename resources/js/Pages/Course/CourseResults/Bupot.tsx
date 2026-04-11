import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Bupot({
    bupots,
    courseResults,
}: {
    bupots: any[];
    courseResults: any[];
}) {
    const { auth }: any = usePage().props;
    const isTeacher = auth.user.role === "pengajar";
    const [scoreData, setScoreData] = useState("");
    const [selectedResultId, setSelectedResultId] = useState<string | null>(
        null
    );
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleScoreSubmit = (resultId: string) => {
        router.post(
            route("teacher.scoreCourse", resultId),
            {
                score: parseFloat(scoreData),
            },
            {
                onSuccess: () => {
                    setScoreData("");
                    setSelectedResultId(null);
                    setDialogOpen(false);
                },
            }
        );
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (
                selectedResultId &&
                scoreData &&
                parseFloat(scoreData) >= 0 &&
                parseFloat(scoreData) <= 100
            ) {
                handleScoreSubmit(selectedResultId);
            }
        }
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numValue = parseFloat(value);

        if (value === "" || (numValue >= 0 && numValue <= 100)) {
            setScoreData(value);
        }
    };

    if (!bupots || bupots.length === 0) {
        return (
            <div className="mb-4 rounded-xl bg-sidebar border p-4">
                <h2 className="font-semibold mb-2">Bupot</h2>
                <p className="text-gray-500">Belum ada bupot yang dibuat.</p>
            </div>
        );
    }

    return (
        <div className="mb-4 rounded-xl bg-sidebar border p-4">
            <h2 className="font-semibold mb-2">Bupot</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-2 py-1 border text-left">No</th>
                            <th className="px-2 py-1 border text-left">Tipe</th>
                            <th className="px-2 py-1 border text-left">
                                Nama Pembeli
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Masa Pajak
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Jenis Pajak
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Kode Objek Pajak
                            </th>
                            <th className="px-2 py-1 border text-left">DPP</th>
                            <th className="px-2 py-1 border text-left">
                                Tarif
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Pajak
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Status
                            </th>
                            {/* <th className="px-2 py-1 border text-left">
                                Nilai
                            </th> */}
                            <th className="px-2 py-1 border text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bupots.map((bupot: any, idx: number) => {
                            let tipe = "BPPU";
                            let routeName = "bppu.downloadPDF";
                            if (bupot.object?.type === "BPNR") {
                                tipe = "BPNR";
                                routeName = "bpnr.downloadPDF";
                            } else if (bupot.object?.type === "BP21") {
                                tipe = "BP21";
                                routeName = "bp21.downloadPDF";
                            } else if (bupot.object?.type === "BP26") {
                                tipe = "BP26";
                                routeName = "bp26.downloadPDF";
                            } else if (bupot.object?.type === "BPA1") {
                                tipe = "BPA1";
                                routeName = "bpa1.downloadPDF";
                            } else if (bupot.object?.type === "BPA2") {
                                tipe = "BPA2";
                                routeName = "bpa2.downloadPDF";
                            } else if (bupot.object?.type === "SP") {
                                tipe = "SP";
                                routeName = "sp.downloadPDF";
                            } else if (bupot.object?.type === "CY") {
                                tipe = "CY";
                                routeName = "cy.downloadPDF";
                            } else if (bupot.object?.type === "MP") {
                                tipe = "MP";
                                routeName = "mp.downloadPDF";
                            }

                            let tarif = "-";
                            if (bupot.object?.tax_rates) {
                                if (
                                    [
                                        "PS17",
                                        "HARIAN",
                                        "PESANGON",
                                        "PENSIUN",
                                    ].includes(bupot.object.tax_rates)
                                ) {
                                    tarif = bupot.object.tax_rates;
                                } else if (
                                    !isNaN(Number(bupot.object.tax_rates))
                                ) {
                                    tarif = `${bupot.object.tax_rates}%`;
                                }
                            } else if (bupot.rates) {
                                tarif = `${bupot.rates}%`;
                            }

                            let colorClass = "bg-gray-600 hover:bg-gray-500";
                            switch (bupot.status) {
                                case "approved":
                                    colorClass =
                                        "bg-blue-600 hover:bg-blue-500";
                                    break;
                                case "created":
                                    colorClass =
                                        "bg-green-600 hover:bg-green-500";
                                    break;
                                case "canceled":
                                    colorClass =
                                        "bg-yellow-600 hover:bg-yellow-500";
                                    break;
                                case "deleted":
                                    colorClass = "bg-red-600 hover:bg-red-500";
                                    break;
                                case "amanded":
                                    colorClass =
                                        "bg-gray-600 hover:bg-gray-500";
                                    break;
                                default:
                                    colorClass =
                                        "bg-gray-600 hover:bg-gray-500";
                            }

                            const courseResult = courseResults.find(
                                (result: any) => result.bupot_id === bupot.id
                            );

                            return (
                                <tr key={bupot.id}>
                                    <td className="border px-2 py-1">
                                        {idx + 1}
                                    </td>
                                    <td className="border px-2 py-1">{tipe}</td>
                                    <td className="border px-2 py-1">
                                        {bupot.customer_name ?? "-"}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {bupot.bupot_period && bupot.bupot_year
                                            ? `${bupot.bupot_period} ${bupot.bupot_year}`
                                            : "-"}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {bupot.object?.tax_type ?? "-"}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {bupot.object?.tax_code ?? "-"}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {bupot.dpp
                                            ? `Rp ${Number(
                                                  bupot.dpp
                                              ).toLocaleString("id-ID")}`
                                            : "-"}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {tarif}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {bupot.tax
                                            ? `Rp ${Number(
                                                  bupot.tax
                                              ).toLocaleString("id-ID")}`
                                            : "-"}
                                    </td>
                                    <td className="border px-2 py-1 capitalize">
                                        <Badge className={` ${colorClass}`}>
                                            {bupot.status ?? "-"}
                                        </Badge>
                                    </td>
                                    {/* <td className="border px-2 py-1">
                                        {courseResult?.score !== null &&
                                        courseResult?.score !== undefined ? (
                                            <span className="font-bold text-primary">
                                                {courseResult.score}
                                            </span>
                                        ) : (
                                            <span className="italic text-gray-400 text-xs">
                                                Belum dinilai
                                            </span>
                                        )}
                                    </td> */}
                                    <td className="border px-2 py-1 space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            asChild
                                        >
                                            <a
                                                href={route(
                                                    routeName,
                                                    bupot.id
                                                )}
                                                target="_blank"
                                            >
                                                PDF
                                            </a>
                                        </Button>
                                        {/* {isTeacher && courseResult && (
                                            <Dialog
                                                open={
                                                    dialogOpen &&
                                                    selectedResultId ===
                                                        courseResult.id
                                                }
                                                onOpenChange={(open) => {
                                                    setDialogOpen(open);
                                                    if (!open) {
                                                        setSelectedResultId(
                                                            null
                                                        );
                                                        setScoreData("");
                                                    }
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100"
                                                        onClick={() => {
                                                            setSelectedResultId(
                                                                courseResult.id
                                                            );
                                                            setScoreData(
                                                                courseResult.score?.toString() ||
                                                                    ""
                                                            );
                                                            setDialogOpen(true);
                                                        }}
                                                    >
                                                        Nilai
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Berikan Penilaian
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            <p className="mb-1">
                                                                Berikan nilai
                                                                untuk bupot ini.
                                                            </p>
                                                            <p>
                                                                Tipe Bupot:{" "}
                                                                <span className="font-medium">
                                                                    {tipe}
                                                                </span>{" "}
                                                                <a
                                                                    href={route(
                                                                        routeName,
                                                                        bupot.id
                                                                    )}
                                                                    className="text-blue-600 hover:underline"
                                                                    target="_blank"
                                                                >
                                                                    [Lihat PDF]
                                                                </a>
                                                            </p>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div>
                                                        <div className="">
                                                            <Label
                                                                htmlFor="score"
                                                                className="text-right"
                                                            >
                                                                Nilai
                                                            </Label>
                                                            <Input
                                                                id="score"
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                placeholder="0-100"
                                                                className="col-span-3"
                                                                value={
                                                                    scoreData
                                                                }
                                                                onChange={
                                                                    handleScoreChange
                                                                }
                                                                onKeyDown={
                                                                    handleKeyDown
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() =>
                                                                setDialogOpen(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            Batal
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            onClick={() =>
                                                                selectedResultId &&
                                                                handleScoreSubmit(
                                                                    selectedResultId
                                                                )
                                                            }
                                                            disabled={
                                                                !scoreData ||
                                                                parseFloat(
                                                                    scoreData
                                                                ) < 0 ||
                                                                parseFloat(
                                                                    scoreData
                                                                ) > 100
                                                            }
                                                        >
                                                            Simpan Penilaian
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )} */}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
