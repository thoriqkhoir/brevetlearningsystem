"use client";

import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Trash, User, UserX } from "lucide-react";
import { Link } from "@inertiajs/react";
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

export type ParticipantColumns = {
    id: string;
    user?: {
        id: string;
        name: string;
        email: string;
        profile_url?: string | null;
    };
    average_score: number | null;
    best_score?: number | null;
    feedback: string | null;
    test_id: string;
    show_score?: boolean; // Tambahkan property ini
};

export const participantColumns = (
    handleRemoveParticipant: (participantId: string) => void
): ColumnDef<ParticipantColumns>[] => [
    {
        accessorKey: "no",
        header: "No",
        cell: ({ row }) => <p>{row.index + 1}</p>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "actions",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            return (
                <div className="flex justify-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                    asChild
                                >
                                    <Link
                                        href={route("teacher.showTestParticipant", [
                                            row.original.test_id,
                                            row.original.id,
                                        ])}
                                    >
                                        <User size={14} />
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Lihat Detail</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <AlertDialog>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-red-700 bg-red-50 border-red-200 hover:bg-red-100"
                                        >
                                            <Trash size={14} />
                                        </Button>
                                    </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Hapus Peserta</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Hapus Peserta dari Ujian
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus{" "}
                                    <span className="font-semibold">
                                        {row.original.user?.name}
                                    </span>{" "}
                                    dari Ujian ini? Tindakan ini tidak dapat
                                    dibatalkan dan akan menghapus semua data
                                    hasil kerja peserta.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() =>
                                        handleRemoveParticipant(row.original.id)
                                    }
                                >
                                    Hapus Peserta
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "user.name",
        id: "user_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nama" />
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            const getInitials = (name: string) => {
                return name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase() || "??";
            };

            return (
                <div className="flex items-center gap-3 w-[220px]">
                    {user?.profile_url ? (
                        <img
                            src={user.profile_url}
                            alt={`Foto profil ${user.name}`}
                            className="h-8 w-8 rounded-xl object-cover shadow-sm ring-1 ring-teal-100"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 text-xs font-bold text-white shadow-sm shrink-0">
                            {getInitials(user?.name || "??")}
                        </div>
                    )}
                    <p className="font-medium text-slate-700">{user?.name || "-"}</p>
                </div>
            );
        },
    },
    {
        accessorKey: "user.email",
        id: "user_email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => <p>{row.original.user?.email || "-"}</p>,
    },
    {
        accessorKey: "best_score",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nilai Terbaik" />
        ),
        cell: ({ row }) => {
            // Dapatkan status show_score dari row data
            const showScore = row.original.show_score ?? true;
            
            return (
                <div className="">
                    <div className="font-mono font-bold text-primary">
                        {showScore ? (
                            row.original.best_score !== null && row.original.best_score !== undefined ? (
                                row.original.best_score
                            ) : (
                                <span className="italic text-gray-400 text-sm">
                                    Belum dinilai
                                </span>
                            )
                        ) : (
                            <span className="italic text-gray-500 text-sm">
                                Tersembunyi
                            </span>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "feedback",
        header: "Feedback",
        cell: ({ row }) => (
            <p className="w-[200px] truncate">{row.original.feedback ?? "-"}</p>
        ),
    },
];