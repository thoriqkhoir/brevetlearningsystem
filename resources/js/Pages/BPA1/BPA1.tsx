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

export default function BPA1({ user, bupot }: any) {
    const isForeignWorker = bupot.customer_country !== "Indonesia";

    const getBreadcrumbRoute = () => {
        if (bupot.status === 'approved') {
            return {
                route: route("bpa1.issued"),
                label: "eBupot BPA1 Telah Terbit"
            };
        } else if (bupot.status === 'draft') {
            return {
                route: route("bpa1.invalid"),
                label: "eBupot BPA1 Tidak Valid"
            };
        } else {
            return {
                route: route("bpa1.notIssued"),
                label: "eBupot BPA1 Belum Terbit"
            };
        }
    };

    const breadcrumb = getBreadcrumbRoute();
    
    return (
        <Authenticated>
            <Head title="eBupot BPA1" />

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
                                    Detail eBupot BPA1
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Detail eBupot BPA1
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
                                title="Pegawai Asing"
                                detail={isForeignWorker ? "Ya" : "Tidak"}
                            />
                            <ItemDetail
                                title="NPWP"
                                detail={bupot.customer_id}
                            />
                            <ItemDetail
                                title="Nama"
                                detail={bupot.customer_name}
                            />
                            {isForeignWorker && (
                                <>
                                    <ItemDetail
                                        title="Alamat"
                                        detail={bupot.customer_address || "-"}
                                    />
                                    <ItemDetail
                                        title="Nomor Paspor"
                                        detail={bupot.customer_passport || "-"}
                                    />
                                    <ItemDetail
                                        title="Negara"
                                        detail={bupot.customer_country}
                                    />
                                </>
                            )}
                            <ItemDetail
                                title="Jenis Kelamin"
                                detail={bupot.customer_gender || "-"}
                                className="capitalize"
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
                                title="Gaji Pokok / Pensiun"
                                detail={rupiahFormatter.format(bupot.basic_salary || 0)}
                            />
                            <ItemDetail
                                title="Tunjangan PPh"
                                detail={rupiahFormatter.format(bupot.tax_allowance || 0)}
                            />
                            <ItemDetail
                                title="Tunjangan Lainnya, Uang Lembur dan sebagainya"
                                detail={rupiahFormatter.format(bupot.other_allowance || 0)}
                            />
                            <ItemDetail
                                title="Honorarium dan Imbalan lain Sejenisnya"
                                detail={rupiahFormatter.format(bupot.honorarium || 0)}
                            />
                            <ItemDetail
                                title="Premi Asuransi yang Dibayar Pemberi Kerja"
                                detail={rupiahFormatter.format(bupot.premi || 0)}
                            />
                            <ItemDetail
                                title="Penerimaan dalam Bentuk Natura dan Kenikmatan Lainnya yang Dikenakan Pemotongan PPh Pasal 21"
                                detail={rupiahFormatter.format(bupot.in_kind_acceptance || 0)}
                            />
                            <ItemDetail
                                title="Tantiem, Bonus, Gratifikasi, Jasa Produksi dan THR"
                                detail={rupiahFormatter.format(bupot.tantiem || 0)}
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
                                title="Zakat atau Sumbangan Keagamaan yang Bersifat Wajib yang Dibayarkan Melalui Pemberi Kerja"
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
                                title="Jumlah Penghasilan Neto untuk Perhitungan PPh Pasal 21 (Setahun/Disetahunkan)"
                                detail={rupiahFormatter.format(bupot.total_neto || 0)}
                            />
                            <ItemDetail
                                title="Penghasilan Tidak Kena Pajak (PTKP)"
                                detail={rupiahFormatter.format(bupot.non_taxable_income || 0)}
                            />
                            <ItemDetail
                                title="Penghasilan Neto dari Pemotongan Sebelumnya"
                                detail={rupiahFormatter.format(bupot.before_neto || 0)}
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
                                title="PPh Pasal 21 dan PPh Pasal 26 yang Telah Ditanggung Pemerintah"
                                detail={rupiahFormatter.format(bupot.pph_government || 0)}
                            />
                            <ItemDetail
                                title="PPh Pasal 21 Desember atau yang Dipotong Pegawai Tetap Berhenti Bekerja"
                                detail={rupiahFormatter.format(bupot.pph_desember || 0)}
                            />
                            <ItemDetail
                                title="Fasilitas Pajak yang Dimiliki oleh Penerima Penghasilan"
                                detail={bupot.facility || "tanpa fasilitas"}
                                className="capitalize"
                            />
                            <ItemDetail title="KAP" detail={bupot.kap || "-"} />
                            <ItemDetail
                                title="NITKU / Nomor Identitas Sub Unit Organisasi"
                                detail={bupot.nitku || "-"}
                            />
                        </div>

                        <Button
                            onClick={() =>
                                router.get(route("bpa1.edit", bupot.id))
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