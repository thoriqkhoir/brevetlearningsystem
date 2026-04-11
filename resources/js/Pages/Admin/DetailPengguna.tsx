import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Edit, Key, Shield } from "lucide-react";
import FakturKeluaran from "./UserData/FakturKeluaran";
import FakturMasukan from "./UserData/FakturMasukan";
import Bupot from "./UserData/Bupot";
import SPT from "./UserData/SPT";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function DetailPengguna({
    user,
    fakturKeluaranCount,
    fakturMasukanCount,
    bupotCount,
    sptCount,
    fakturs,
    bupots,
    spts,
}: any) {
    const { flash }: any = usePage().props;
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const handleResetPassword = () => {
        router.post(
            route("admin.resetPassword", user.id),
            {},
            {
                onSuccess: () => {
                    setResetPasswordOpen(false);
                },
            }
        );
    };

    return (
        <AdminLayout>
            <Head title={`Detail Pengguna - ${user.name}`} />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("admin.users")}>
                                    Daftar Pengguna
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Detail Pengguna</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-semibold text-primary">
                            {user.name}
                        </h1>

                        <div className="flex gap-2">
                            <AlertDialog
                                open={resetPasswordOpen}
                                onOpenChange={setResetPasswordOpen}
                            >
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100"
                                    >
                                        <Key size={16} />
                                        Reset Kata Sandi
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Reset Kata Sandi
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Apakah Anda yakin ingin mereset kata
                                            sandi untuk{" "}
                                            <span className="font-semibold">
                                                {user.name}
                                            </span>
                                            ? Kata sandi akan diubah menjadi
                                            nomor telepon:{" "}
                                            <span className="font-mono font-semibold">
                                                {user.phone_number}
                                            </span>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-orange-600 hover:bg-orange-700"
                                            onClick={handleResetPassword}
                                        >
                                            Reset Kata Sandi
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button
                                onClick={() =>
                                    router.visit(route("admin.edit", user.id))
                                }
                            >
                                <Edit size={16} />
                                Edit Pengguna
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="col-span-2 p-4 rounded-xl bg-sidebar border">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="font-medium pr-4">
                                            Nama Pengguna
                                        </td>
                                        <td className="pr-2">:</td>
                                        <td>{user.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-4">
                                            Email
                                        </td>
                                        <td className="pr-2">:</td>
                                        <td>{user.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-4">
                                            No. Telepon
                                        </td>
                                        <td className="pr-2">:</td>
                                        <td>{user.phone_number}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-4">
                                            NPWP
                                        </td>
                                        <td className="pr-2">:</td>
                                        <td>{user.npwp ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-4">
                                            Alamat
                                        </td>
                                        <td className="pr-2">:</td>
                                        <td>{user.address ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-4">
                                            Event
                                        </td>
                                        <td className="pr-2">:</td>
                                        <td>{user.event?.name ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium pr-4">
                                            Status Kata Sandi
                                        </td>
                                        <td className="pr-2">:</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {user.is_password_reset ? (
                                                    <>
                                                        <Shield
                                                            className="text-orange-600"
                                                            size={16}
                                                        />
                                                        <span className="text-orange-600 font-medium">
                                                            Sudah direset
                                                            (default: no.
                                                            telepon)
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield
                                                            className="text-green-600"
                                                            size={16}
                                                        />
                                                        <span className="text-green-600 font-medium">
                                                            Kata sandi masih
                                                            asli
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h4 className="font-semibold mt-4 text-lg text-primary">
                                Informasi Tambahan
                            </h4>
                            <p className="text-gray-500 text-sm">
                                Belum ada informasi tambahan yang disediakan
                                untuk pengguna ini.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border">
                                <h2 className="text-sm font-medium">
                                    Faktur Keluaran
                                </h2>
                                <p className="text-5xl font-bold text-emerald-800">
                                    {fakturKeluaranCount}
                                </p>
                            </div>
                            <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border">
                                <h2 className="text-sm font-medium">
                                    Faktur Masukan
                                </h2>
                                <p className="text-5xl font-bold text-sky-800">
                                    {fakturMasukanCount}
                                </p>
                            </div>
                            <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border">
                                <h2 className="text-sm font-medium">Bupot</h2>
                                <p className="text-5xl font-bold text-orange-800">
                                    {bupotCount}
                                </p>
                            </div>
                            <div className="p-4 text-center space-y-2 rounded-xl bg-sidebar border">
                                <h2 className="text-sm font-medium">SPT</h2>
                                <p className="text-5xl font-bold text-fuchsia-800">
                                    {sptCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold text-primary">
                            Data Pengguna
                        </h2>
                        <p className="text-gray-500 text-sm mb-4">
                            Berikut adalah data Faktur Keluaran, Faktur Masukan,
                            Bupot, dan SPT yang telah dibuat oleh pengguna ini.
                        </p>
                        <Tabs defaultValue="faktur-keluaran">
                            <TabsList>
                                <TabsTrigger value="faktur-keluaran">
                                    Faktur Keluaran
                                </TabsTrigger>
                                <TabsTrigger value="faktur-masukan">
                                    Faktur Masukan
                                </TabsTrigger>
                                <TabsTrigger value="bupot">Bupot</TabsTrigger>
                                <TabsTrigger value="spt">SPT</TabsTrigger>
                            </TabsList>
                            <TabsContent value="faktur-keluaran">
                                <FakturKeluaran fakturs={fakturs} />
                            </TabsContent>
                            <TabsContent value="faktur-masukan">
                                <FakturMasukan fakturs={fakturs} />
                            </TabsContent>
                            <TabsContent value="bupot">
                                <Bupot bupots={bupots} />
                            </TabsContent>
                            <TabsContent value="spt">
                                <SPT spts={spts} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
