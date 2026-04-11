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
import { Banknote, BookMarked, File } from "lucide-react";

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
});

export default function CY({ user, bupot }: any) {
    return (
        <Authenticated>
            <Head title="eBupot CY" />

            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("cy.notIssued")}>
                                    CY Belum Terbit
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    Detail eBupot CY
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-2xl font-semibold text-primary">
                        Detail eBupot CY
                    </h1>

                    <div className="p-5 lg:p-8 rounded-xl bg-sidebar border">
                        <div className="flex items-center gap-2 mb-2">
                            <File size={16} />
                            <h3 className="font-medium">Informasi Umum</h3>
                        </div>
                        <div className="p-8 rounded-xl bg-white border mb-4">
                            <ItemDetail
                                title="Masa Pajak"
                                detail={`${bupot.bupot_period} ${bupot.bupot_year}`}
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
                                title="NITKU / Nomor Identitas Subunit Organisasi Penerima Penghasilan"
                                detail={`${bupot.customer_id}000000 - ${bupot.customer_name}`}
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <Banknote size={16} />
                            <h3 className="font-medium">
                                Pajak Penghasilan (Rp)
                            </h3>
                        </div>
                        <div className="p-8 rounded-xl bg-white border mb-4">
                            <ItemDetail
                                title="Fasilitas Pajak yang Dimiliki oleh Penerima
                            Penghasilan"
                                detail={bupot.facility}
                                className="capitalize"
                            />
                            <ItemDetail
                                title="Nama Objek Pajak"
                                detail={bupot.object.tax_name}
                            />
                            <ItemDetail
                                title="Jenis Pajak"
                                detail={bupot.object.tax_type}
                            />
                            <ItemDetail
                                title="Kode Objek Pajak"
                                detail={bupot.object.tax_code}
                            />
                            <ItemDetail
                                title="Sifat Pajak Penghasilan"
                                detail={bupot.object.tax_nature}
                                className="capitalize"
                            />
                            <ItemDetail
                                title="Dasar Pengenaan Pajak"
                                detail={rupiahFormatter.format(bupot.dpp || 0)}
                            />
                            <ItemDetail
                                title="Tarif"
                                detail={`${bupot.rates}%`}
                            />
                            <ItemDetail
                                title="Pajak Penghasilan"
                                detail={rupiahFormatter.format(bupot.tax || 0)}
                            />
                            <ItemDetail title="KAP" detail={bupot.object.kap} />
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <BookMarked size={16} />
                            <h3 className="font-medium">Dokumen Referensi</h3>
                        </div>
                        <div className="p-8 rounded-xl bg-white border mb-4">
                            <ItemDetail
                                title="Jenis Dokumen"
                                detail={bupot.doc_type}
                                className="capitalize"
                            />
                            <ItemDetail
                                title="Nomor Dokumen"
                                detail={bupot.doc_no}
                            />
                            <ItemDetail
                                title="Tanggal Dokumen"
                                detail={bupot.doc_date}
                            />
                            <ItemDetail
                                title="NITKU / Nomor Identitas Sub Unit Organisasi*"
                                detail={`${user.npwp}000000 - ${user.name}`}
                            />
                        </div>
                        <Button
                            onClick={() =>
                                router.get(route("cy.edit", bupot.id))
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
