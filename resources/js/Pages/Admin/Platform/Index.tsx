import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
    Plus, 
    Key, 
    Power, 
    Edit2, 
    Copy, 
    Check, 
    Users, 
    Search,
    ShieldAlert,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

interface PlatformItem {
    id: string;
    name: string;
    code: string;
    description: string | null;
    is_active: boolean;
    users_count: number;
    tokens: any[];
    created_at: string;
}

type PlatformFormData = {
    name: string;
    code: string;
    description: string;
    is_active: boolean;
};

export default function PlatformIndex({ platforms, filters }: any) {
    const { flash }: any = usePage().props;
    const [search, setSearch] = useState(filters?.search || "");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [createCodeSuffix, setCreateCodeSuffix] = useState(() => Math.random().toString(36).substring(2, 7));
    const [editingPlatform, setEditingPlatform] = useState<PlatformItem | null>(null);
    const [copiedToken, setCopiedToken] = useState(false);
    const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
    const [generatedToken, setGeneratedToken] = useState<string | null>(null);

    const [confirmAction, setConfirmAction] = useState<{
        open: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
    } | null>(null);

    const platformList: PlatformItem[] = Array.isArray(platforms?.data)
        ? platforms.data
        : (Array.isArray(platforms) ? platforms : []);

    useEffect(() => {
        if (flash?.plainTextToken) {
            setGeneratedToken(flash.plainTextToken);
            setIsTokenModalOpen(true);
        }
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.plainTextToken, flash?.success, flash?.error]);

    const createForm = useForm<PlatformFormData>({
        name: "",
        code: "",
        description: "",
        is_active: true,
    });

    const editForm = useForm<PlatformFormData>({
        name: "",
        code: "",
        description: "",
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get("/admin/platforms", { search }, { preserveState: true });
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post("/admin/platforms", {
            onSuccess: () => {
                createForm.reset();
                setIsCreateOpen(false);
            },
        });
    };

    const handleOpenEdit = (p: PlatformItem) => {
        setEditingPlatform(p);
        editForm.setData({
            name: p.name,
            code: p.code,
            description: p.description || "",
            is_active: p.is_active,
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingPlatform) return;
        editForm.put(`/admin/platforms/${editingPlatform.id}`, {
            onSuccess: () => {
                setEditingPlatform(null);
            },
        });
    };

    const promptToggle = (id: string, name: string, is_active: boolean) => {
        const actionLabel = is_active ? "menonaktifkan" : "mengaktifkan";
        setConfirmAction({
            open: true,
            title: is_active ? "Nonaktifkan Platform" : "Aktifkan Platform",
            description: `Apakah Anda yakin ingin ${actionLabel} platform "${name}"?`,
            onConfirm: () => {
                router.post(`/admin/platforms/${id}/toggle-status`, {}, {
                    preserveScroll: true,
                });
            },
        });
    };

    const promptGenerateToken = (id: string, name: string) => {
        setConfirmAction({
            open: true,
            title: "Generate API Token",
            description: `Apakah Anda yakin ingin membuat API Token baru untuk platform "${name}"? Token lama (jika ada) akan dinonaktifkan.`,
            onConfirm: () => {
                router.post(`/admin/platforms/${id}/generate-token`, {}, {
                    preserveScroll: true,
                    onSuccess: (page: any) => {
                        const token = page.props?.flash?.plainTextToken;
                        if (token) {
                            setGeneratedToken(token);
                            setIsTokenModalOpen(true);
                        }
                    },
                });
            },
        });
    };

    const promptRevokeTokens = (id: string, name: string) => {
        setConfirmAction({
            open: true,
            title: "Cabut API Token",
            description: `Apakah Anda yakin ingin mencabut seluruh API Token untuk platform "${name}"? External dashboard platform ini tidak akan bisa mengakses API.`,
            onConfirm: () => {
                router.post(`/admin/platforms/${id}/revoke-tokens`, {}, {
                    preserveScroll: true,
                });
            },
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedToken(true);
        toast.success("Token disalin ke clipboard");
        setTimeout(() => setCopiedToken(false), 2000);
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Platform" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Platform Mitra</h1>
                        <p className="text-sm text-gray-600">
                            Kelola platform mitra, integrasi data siswa, dan akses API eksternal terisolasi.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            const suffix = Math.random().toString(36).substring(2, 7);
                            setCreateCodeSuffix(suffix);
                            createForm.reset();
                            setIsCreateOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Platform
                    </Button>
                </div>

                {/* Plain Text Token Modal Dialog (Shadcn UI) */}
                <Dialog open={isTokenModalOpen} onOpenChange={setIsTokenModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <DialogTitle>API Token Berhasil Dibuat</DialogTitle>
                                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                        Salin token ini sekarang. Token hanya ditampilkan satu kali!
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="bg-muted/40 p-4 rounded-xl border space-y-2">
                            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                                Personal Access Token:
                            </Label>
                            <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-lg border">
                                <input
                                    type="text"
                                    readOnly
                                    value={generatedToken || ""}
                                    className="w-full text-xs font-mono bg-transparent border-none p-0 focus:outline-none focus:ring-0 text-foreground select-all"
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => generatedToken && copyToClipboard(generatedToken)}
                                    className="h-8 gap-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                                >
                                    {copiedToken ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            Tersalin
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            Salin
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <DialogFooter className="flex sm:justify-between items-center gap-2">
                            <span className="text-xs text-amber-600 font-medium">
                                ⚠️ Simpan di tempat yang aman.
                            </span>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsTokenModalOpen(false)}
                            >
                                Selesai & Tutup
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Confirm Dialog (Shadcn UI) */}
                <ConfirmDialog
                    open={confirmAction?.open ?? false}
                    title={confirmAction?.title ?? ""}
                    description={confirmAction?.description ?? ""}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={() => {
                        confirmAction?.onConfirm();
                        setConfirmAction(null);
                    }}
                />

                {/* Search & Filter */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <form onSubmit={handleSearch} className="flex items-center gap-2 w-full max-w-md">
                        <div className="relative w-full">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau kode platform..."
                                className="pl-9 text-sm"
                            />
                        </div>
                        <Button type="submit" variant="outline">
                            Cari
                        </Button>
                    </form>
                </div>
            

                {/* Platform Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Platform</th>
                                    <th className="px-6 py-3">Kode / Slug</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Siswa</th>
                                    <th className="px-6 py-3">API Token</th>
                                    <th className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {platformList.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                            Belum ada platform terdaftar.
                                        </td>
                                    </tr>
                                ) : (
                                    platformList.map((item: PlatformItem) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{item.name}</div>
                                                {item.description && (
                                                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-600">
                                                {item.code}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        item.is_active
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {item.is_active ? "Aktif" : "Non-Aktif"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <span className="inline-flex items-center gap-1.5 font-medium">
                                                    <Users className="w-4 h-4 text-gray-400" />
                                                    {item.users_count} siswa
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.tokens && item.tokens.length > 0 ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                                        <Key className="w-3.5 h-3.5" /> Token Aktif
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">Belum ada token</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => promptGenerateToken(item.id, item.name)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Generate API Token"
                                                >
                                                    <Key className="w-4 h-4" />
                                                </button>
                                                {item.tokens && item.tokens.length > 0 && (
                                                    <button
                                                        onClick={() => promptRevokeTokens(item.id, item.name)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Cabut API Token"
                                                    >
                                                        <ShieldAlert className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                                    title="Edit Platform"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => promptToggle(item.id, item.name, item.is_active)}
                                                    className={`p-1.5 rounded-lg transition ${
                                                        item.is_active
                                                            ? "text-amber-600 hover:bg-amber-50"
                                                            : "text-green-600 hover:bg-green-50"
                                                    }`}
                                                    title={item.is_active ? "Nonaktifkan Platform" : "Aktifkan Platform"}
                                                >
                                                    <Power className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination & Records Info */}
                    {platforms && (platforms.total > 0 || (platforms.links && platforms.links.length > 0)) && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t bg-gray-50/50">
                            <div className="text-xs text-muted-foreground">
                                {platforms.total !== undefined ? (
                                    <>
                                        Menampilkan <span className="font-semibold text-foreground">{platforms.from || 0}</span> sampai{" "}
                                        <span className="font-semibold text-foreground">{platforms.to || 0}</span> dari total{" "}
                                        <span className="font-semibold text-foreground">{platforms.total}</span> platform
                                    </>
                                ) : (
                                    `Total ${platformList.length} platform`
                                )}
                            </div>

                            {platforms.links && platforms.links.length > 3 && (
                                <div className="flex items-center gap-1 flex-wrap justify-center">
                                    {platforms.links.map((link: any, idx: number) => {
                                        const cleanLabel = link.label
                                            .replace("&laquo;", "«")
                                            .replace("&raquo;", "»")
                                            .replace("Previous", "Sebelumnya")
                                            .replace("Next", "Berikutnya");

                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1.5 text-xs text-muted-foreground/50 border rounded-md cursor-not-allowed bg-muted/20 select-none"
                                                    dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={idx}
                                                href={link.url}
                                                preserveScroll
                                                preserveState
                                                className={`px-3 py-1.5 text-xs rounded-md border font-medium transition ${
                                                    link.active
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                        : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Create Modal Dialog (Shadcn UI) */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Platform Baru</DialogTitle>
                            <DialogDescription>
                                Masukkan nama dan kode unik platform mitra.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase">Nama Platform</Label>
                                <Input
                                    type="text"
                                    required
                                    value={createForm.data.name}
                                    onChange={(e) => {
                                        const nameVal = e.target.value;
                                        const baseSlug = nameVal
                                            .toLowerCase()
                                            .replace(/[^a-z0-9]+/g, "-")
                                            .replace(/^-+|-+$/g, "");
                                        createForm.setData((data) => ({
                                            ...data,
                                            name: nameVal,
                                            code: baseSlug ? `${baseSlug}-${createCodeSuffix}` : "",
                                        }));
                                    }}
                                    placeholder="Contoh: Universitas Indonesia"
                                />
                                {createForm.errors.name && <p className="text-xs text-red-600">{createForm.errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase">Kode Unik (Slug Otomatis)</Label>
                                <Input
                                    type="text"
                                    required
                                    value={createForm.data.code}
                                    onChange={(e) => createForm.setData("code", e.target.value)}
                                    placeholder="contoh: univ-indonesia-a8k2f"
                                    className="font-mono text-xs"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Otomatis dibuat dengan format <span className="font-mono font-medium">namaplatform-xxxxx</span> (bisa disesuaikan manual).
                                </p>
                                {createForm.errors.code && <p className="text-xs text-red-600">{createForm.errors.code}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase">Deskripsi (Opsional)</Label>
                                <Textarea
                                    rows={3}
                                    value={createForm.data.description}
                                    onChange={(e) => createForm.setData("description", e.target.value)}
                                    placeholder="Deskripsi singkat platform..."
                                />
                            </div>
                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Simpan Platform
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Edit Modal Dialog (Shadcn UI) */}
                <Dialog open={!!editingPlatform} onOpenChange={(open) => { if (!open) setEditingPlatform(null); }}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Platform</DialogTitle>
                            <DialogDescription>
                                Perbarui informasi platform mitra.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase">Nama Platform</Label>
                                <Input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData("name", e.target.value)}
                                />
                                {editForm.errors.name && <p className="text-xs text-red-600">{editForm.errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase">Kode Unik (Slug)</Label>
                                <Input
                                    type="text"
                                    required
                                    value={editForm.data.code}
                                    onChange={(e) => editForm.setData("code", e.target.value)}
                                    className="font-mono text-xs"
                                />
                                {editForm.errors.code && <p className="text-xs text-red-600">{editForm.errors.code}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold uppercase">Deskripsi</Label>
                                <Textarea
                                    rows={3}
                                    value={editForm.data.description}
                                    onChange={(e) => editForm.setData("description", e.target.value)}
                                />
                            </div>
                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditingPlatform(null)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Simpan Perubahan
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
