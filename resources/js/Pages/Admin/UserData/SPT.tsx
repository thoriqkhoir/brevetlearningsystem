import { Badge } from "@/Components/ui/badge";

export default function SPT({ spts }: { spts: any[] }) {
    if (!spts || spts.length === 0) {
        return (
            <div className="mb-4 rounded-xl bg-sidebar border p-4">
                <h2 className="font-semibold mb-2">SPT</h2>
                <p className="text-gray-500">Belum ada SPT yang dibuat.</p>
            </div>
        );
    }

    return (
        <div className="mb-4 rounded-xl bg-sidebar border p-4">
            <h2 className="font-semibold mb-2">SPT</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-2 py-1 border text-left">No</th>
                            <th className="px-2 py-1 border text-left">
                                Jenis SPT
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Jenis Pajak
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Periode
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Tahun
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Nilai Pajak
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Tanggal Pembayaran
                            </th>
                            <th className="px-2 py-1 border text-left">
                                Status
                            </th>
                            <th className="px-2 py-1 border text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {spts.map((spt: any, idx: number) => {
                            let tipe = "-";
                            if (spt.form_id === 1) tipe = "PPN";
                            else if (spt.form_id === 2) tipe = "Unifikasi";
                            else if (spt.form_id === 3) tipe = "21/26";
                            return (
                                <tr key={spt.id}>
                                    <td className="border px-2 py-1">
                                        {idx + 1}
                                    </td>
                                    <td className="border px-2 py-1">{tipe}</td>
                                    <td className="border px-2 py-1">
                                        {spt.correction_number === 0
                                            ? "Normal"
                                            : "Pembetulan"}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {spt.start_period && spt.end_period
                                            ? `${spt.start_period} - ${spt.end_period}`
                                            : "-"}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {spt.year}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {spt.tax_value
                                            ? `Rp ${spt.tax_value.toLocaleString(
                                                  "id-ID"
                                              )}`
                                            : "-"}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {spt.paid_date
                                            ? new Date(
                                                  spt.paid_date
                                              ).toLocaleDateString("id-ID")
                                            : "-"}
                                    </td>
                                    <td className="border px-2 py-1 capitalize">
                                        {(() => {
                                            let colorClass =
                                                "bg-gray-600 hover:bg-gray-500";
                                            switch (spt.status) {
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
                                                case "rejected":
                                                    colorClass =
                                                        "bg-red-600 hover:bg-red-500";
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
                                                <Badge className={colorClass}>
                                                    {spt.status ?? "-"}
                                                </Badge>
                                            );
                                        })()}
                                    </td>
                                    <td className="border px-2 py-1">
                                        {spt.form_id === 2 ? (
                                            <a
                                                href={route(
                                                    "spt.downloadPDFUnifikasi",
                                                    spt.id
                                                )}
                                                target="_blank"
                                                className="text-blue-600 underline"
                                            >
                                                PDF
                                            </a>
                                        ) : spt.form_id === 3 ? (
                                            <a
                                                href={route(
                                                    "spt.downloadPDF21",
                                                    spt.id
                                                )}
                                                target="_blank"
                                                className="text-blue-600 underline"
                                            >
                                                PDF
                                            </a>
                                        ) : (
                                            <a
                                                href={route(
                                                    "spt.downloadPDF",
                                                    spt.id
                                                )}
                                                target="_blank"
                                                className="text-blue-600 underline"
                                            >
                                                PDF
                                            </a>
                                        )}
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
