import { Badge } from "@/Components/ui/badge";

export default function Bupot({ bupots }: { bupots: any[] }) {
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
                            <th className="px-2 py-1 border text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bupots.map((bupot: any, idx: number) => {
                            // Tentukan tipe dan route download PDF
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

                            // Format tarif
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

                            // Status badge
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
                                    <td className="border px-2 py-1">
                                        <a
                                            href={route(routeName, bupot.id)}
                                            target="_blank"
                                            className="text-blue-600 underline"
                                        >
                                            PDF
                                        </a>
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
