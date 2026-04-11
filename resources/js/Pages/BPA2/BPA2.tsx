import ItemDetail from "@/Components/layout/ItemDetail";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Button } from "@/Components/ui/button";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Banknote, File } from "lucide-react";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

export default function BPA2({ user, bupot }: any) {
    const isForeignWorker = bupot.customer_country !== "Indonesia";

    const getBreadcrumbRoute = () => {
        if (bupot.status === 'approved') {
            return {
                route: route("bpa2.issued"),
                label: "eBupot BPA2 Telah Terbit"
            };
        } else if (bupot.status === 'canceled') {
            return {
                route: route("bpa2.invalid"),
                label: "eBupot BPA2 Tidak Valid"
            };
        } else {
            return {
                route: route("bpa2.notIssued"),
                label: "eBupot BPA2 Belum Terbit"
            };
        }
    };

    const breadcrumb = getBreadcrumbRoute();

    return (
        <Authenticated>
            <Head title="eBupot BPA2" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={breadcrumb.route}>
                                    {breadcrumb.label}
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Detail eBupot BPA2
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Detail eBupot BPA2
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        {/* INFORMASI UMUM */}
                        <div className="flex items-center gap-2 mb-2">
                            <File size={16} />
                            <h3 className="font-medium">Informasi Umum</h3>
                        </div>
                        <div className="p-8 rounded-xl bg-white border mb-4">
                            <ItemDetail
                                title="Objek Pajak"
                                detail={bupot.object?.tax_name || "-"}
                            />
                            <ItemDetail
                                title="Pembetulan Ke"
                                detail={bupot.is_more || "tidak"}
                                className="capitalize"
                            />
                            <ItemDetail
                                title="Masa Pajak Awal"
                                detail={bupot.start_period || "-"}
                            />
                            <ItemDetail
                                title="Masa Pajak Akhir"
                                detail={bupot.end_period || "-"}
                            />
                            <ItemDetail
                                title="Status"
                                detail={bupot.bupot_status}
                                className="capitalize"
                            />
                            <ItemDetail
                                title="NPWP"
                                detail={bupot.customer_id}
                            />
                            <ItemDetail
                                title="Nama"
                                detail={bupot.customer_name}
                            />
                            <ItemDetail
                                title="NIP"
                                detail={bupot.nip || "-"}
                            />
                            <ItemDetail
                                title="Pangkat/Golongan"
                                detail={bupot.rank_group || "-"}
                            />
                            <ItemDetail
                                title="Status PTKP"
                                detail={bupot.customer_ptkp}
                            />
                            <ItemDetail
                                title="Posisi"
                                detail={bupot.customer_position}
                            />
                            <ItemDetail
                                title="Jenis Pajak"
                                detail={bupot.tax_type || "-"}
                            />
                            <ItemDetail
                                title="Kode Pajak"
                                detail={bupot.tax_code || "-"}
                            />
                            <ItemDetail
                                title="Jenis Pemotongan"
                                detail={bupot.bupot_types || "-"}
                            />
                        </div>

                        {/* PENGHASILAN BRUTO */}
                        <div className="flex items-center gap-2 mb-2">
                            <Banknote size={16} />
                            <h3 className="font-medium">Penghasilan Bruto</h3>
                        </div>
                        <div className="p-8 rounded-xl bg-white border mb-4">
                            <ItemDetail
                                title="Gaji Pokok/Tunjangan Dasar Lainnya"
                                detail={rupiahFormatter.format(bupot.basic_salary || 0)}
                            />
                            <ItemDetail
                                title="Tunjangan Istri"
                                detail={rupiahFormatter.format(bupot.wifes_allowance || 0)}
                            />
                            <ItemDetail
                                title="Tunjangan Anak"
                                detail={rupiahFormatter.format(bupot.childs_allowance || 0)}
                            />
                            <ItemDetail
                                title="Tunjangan Perbaikan Penghasilan"
                                detail={rupiahFormatter.format(bupot.income_improvement_allowance || 0)}
                            />
                            <ItemDetail
                                title="Tunjangan Fungsional"
                                detail={rupiahFormatter.format(bupot.fungtional_allowance || 0)}
                            />
                            <ItemDetail
                                title="Tunjangan Beras"
                                detail={rupiahFormatter.format(bupot.rice_allowance || 0)}
                            />
                            <ItemDetail
                                title="Tunjangan Lainnya"
                                detail={rupiahFormatter.format(bupot.other_allowance || 0)}
                            />
                            <ItemDetail
                                title="Gaji Terpisah"
                                detail={rupiahFormatter.format(bupot.separate_salary || 0)}
                            />
                            <ItemDetail
                                title="Jumlah Penghasilan Bruto"
                                detail={rupiahFormatter.format(bupot.gross_income_amount || 0)}
                            />
                        </div>

                        {/* PENGURANG */}
                        <div className="flex items-center gap-2 mb-2">
                            <Banknote size={16} />
                            <h3 className="font-medium">Pengurang</h3>
                        </div>
                        <div className="p-8 rounded-xl bg-white border mb-4">
                            <ItemDetail
                                title="Biaya Jabatan/Biaya Pensiun"
                                detail={rupiahFormatter.format(bupot.position_allowance || 0)}
                            />
                            <ItemDetail
                                title="Iuran Pensiun atau Iuran THT/JHT"
                                detail={rupiahFormatter.format(bupot.pension_contribution || 0)}
                            />
                            <ItemDetail
                                title="Zakat atau Sumbangan Keagamaan yang Bersifat Wajib"
                                detail={rupiahFormatter.format(bupot.zakat || 0)}
                            />
                            <ItemDetail
                                title="Jumlah Pengurang"
                                detail={rupiahFormatter.format(bupot.amount_of_reduction || 0)}
                            />
                        </div>

                        {/* PENGHITUNGAN PPH PASAL 21 */}
                        <div className="flex items-center gap-2 mb-2">
                            <Banknote size={16} />
                            <h3 className="font-medium">
                                Penghitungan PPh Pasal 21
                            </h3>
                        </div>
                        <div className="p-8 rounded-xl bg-white border mb-4">
                            <ItemDetail
                                title="Jumlah Penghasilan Neto"
                                detail={rupiahFormatter.format(bupot.neto || 0)}
                            />
                            <ItemDetail
                                title="Nomor Bukti"
                                detail={bupot.proof_number || "-"}
                            />
                            <ItemDetail
                                title="Penghasilan Neto dari Pemotongan Sebelumnya"
                                detail={rupiahFormatter.format(bupot.before_neto || 0)}
                            />
                            <ItemDetail
                                title="Jumlah Penghasilan Neto untuk Perhitungan PPh Pasal 21 (Setahun/Disetahunkan)"
                                detail={rupiahFormatter.format(bupot.total_neto || 0)}
                            />
                            <ItemDetail
                                title="Penghasilan Tidak Kena Pajak (PTKP)"
                                detail={rupiahFormatter.format(bupot.non_taxable_income || 0)}
                            />
                            <ItemDetail
                                title="Penghasilan Kena Pajak Setahun/Disetahunkan (PKP)"
                                detail={rupiahFormatter.format(bupot.taxable_income || 0)}
                            />
                            <ItemDetail
                                title="PPh Pasal 21 atas PKP"
                                detail={rupiahFormatter.format(bupot.pph_taxable_income || 0)}
                            />
                            <ItemDetail
                                title="PPh Pasal 21 yang Telah Ditanggung Pemerintah"
                                detail={rupiahFormatter.format(bupot.pph_owed || 0)}
                            />
                            <ItemDetail
                                title="PPh Pasal 21 dan PPh Pasal 26 yang Telah Dipotong dan Dilunasi"
                                detail={rupiahFormatter.format(bupot.pph_deducted || 0)}
                            />
                            <ItemDetail
                                title="PPh Pasal 21 Terutang"
                                detail={rupiahFormatter.format(bupot.pph_deducted_withholding || 0)}
                            />
                            <ItemDetail
                                title="PPh Pasal 21 yang Telah Dipotong"
                                detail={rupiahFormatter.format(bupot.pph_hasbeen_deducted || 0)}
                            />
                            <ItemDetail
                                title="PPh Pasal 21 Desember atau yang Dipotong Pegawai Tetap Berhenti Bekerja"
                                detail={rupiahFormatter.format(bupot.pph_desember || 0)}
                            />
                            <ItemDetail title="KAP" detail={bupot.kap || "-"} />
                            <ItemDetail
                                title="NITKU / Nomor Identitas Sub Unit Organisasi"
                                detail={bupot.nitku || "-"}
                            />
                        </div>

                        <Button
                            onClick={() =>
                                router.get(route("bpa2.edit", bupot.id))
                            }
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
