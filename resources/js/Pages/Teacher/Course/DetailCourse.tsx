import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/Components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import {
    CalendarIcon,
    Eye,
    FileText,
    Pencil,
    Plus,
    Search,
    Trash,
    UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmDialog from "@/Components/layout/ConfirmDialog";
import toast from "react-hot-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { cn } from "@/lib/utils";
import {
    participantColumns,
    ParticipantColumns,
} from "@/Components/layout/UserCourse/columns";
import { DataTableParticipant } from "@/Components/layout/UserCourse/data-table";
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

export default function DetailCourse({
    course,
    participants = [],
    courseSchedules = [],
    courseTests = [],
    questionBanks = [],
}: any) {
    const { flash }: any = usePage().props;
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<
        string[]
    >([]);
    const [addParticipantOpen, setAddParticipantOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pdfViewOpen, setPdfViewOpen] = useState(false);
    const [deleteModulOpen, setDeleteModulOpen] = useState(false);
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [scheduleDateOpen, setScheduleDateOpen] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
        null,
    );
    const [scheduleForm, setScheduleForm] = useState({
        title: "",
        scheduled_date: null as Date | null,
        scheduled_time: "",
        zoom_link: "",
    });
    const [testDialogOpen, setTestDialogOpen] = useState(false);
    const [testStartDateOpen, setTestStartDateOpen] = useState(false);
    const [testEndDateOpen, setTestEndDateOpen] = useState(false);
    const [editingCourseTestId, setEditingCourseTestId] = useState<
        string | null
    >(null);
    const [courseTestForm, setCourseTestForm] = useState({
        title: "",
        description: "",
        question_bank_id: "",
        duration: "",
        passing_score: "",
        questions_to_show: "",
        start_date: null as Date | null,
        start_time: "",
        end_date: null as Date | null,
        end_time: "",
        show_score: true,
    });

    const selectedQuestionBank = questionBanks.find(
        (bank: any) => bank.id === courseTestForm.question_bank_id,
    );
    const maxQuestionsFromSelectedBank = Number(
        selectedQuestionBank?.questions_count ?? 0,
    );

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const parseLocalDateTimeParts = (value?: string | null) => {
        if (!value) {
            return null;
        }

        const matched = String(value).match(
            /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/,
        );

        if (!matched) {
            return null;
        }

        return {
            year: Number(matched[1]),
            month: Number(matched[2]),
            day: Number(matched[3]),
            hour: Number(matched[4]),
            minute: Number(matched[5]),
            second: Number(matched[6] ?? 0),
        };
    };

    const formatLocalDateTime = (value?: string | null) => {
        const parts = parseLocalDateTimeParts(value);
        if (!parts) return "-";

        const localDate = new Date(
            parts.year,
            parts.month - 1,
            parts.day,
            parts.hour,
            parts.minute,
            parts.second,
        );

        return format(localDate, "d MMMM yyyy, HH:mm", { locale: id });
    };

    const parseDateTimeParts = (value?: string | null) => {
        if (!value) {
            return {
                date: null as Date | null,
                time: "",
            };
        }

        const parts = parseLocalDateTimeParts(value);

        if (!parts) {
            return {
                date: null as Date | null,
                time: "",
            };
        }

        const localDate = new Date(
            parts.year,
            parts.month - 1,
            parts.day,
            parts.hour,
            parts.minute,
            parts.second,
        );
        const hour = String(parts.hour).padStart(2, "0");
        const minute = String(parts.minute).padStart(2, "0");

        return {
            date: localDate,
            time: `${hour}:${minute}`,
        };
    };

    const combineDateTime = (date: Date | null, time: string) => {
        if (!date || !time) {
            return null;
        }

        const [hourText, minuteText] = time.split(":");
        const hour = Number(hourText);
        const minute = Number(minuteText);

        if (Number.isNaN(hour) || Number.isNaN(minute)) {
            return null;
        }

        const combined = new Date(date);
        combined.setHours(hour, minute, 0, 0);

        return format(combined, "yyyy-MM-dd HH:mm:ss");
    };

    const parseLocalDateTimeText = (value: string) => {
        const parts = parseLocalDateTimeParts(value);
        if (!parts) return null;

        return new Date(
            parts.year,
            parts.month - 1,
            parts.day,
            parts.hour,
            parts.minute,
            parts.second,
        );
    };

    const resetScheduleForm = () => {
        setScheduleForm({
            title: "",
            scheduled_date: null,
            scheduled_time: "",
            zoom_link: "",
        });
    };

    const openCreateScheduleDialog = () => {
        setEditingScheduleId(null);
        resetScheduleForm();
        setScheduleDialogOpen(true);
    };

    const openEditScheduleDialog = (schedule: any) => {
        const scheduleParts = parseDateTimeParts(schedule.scheduled_at);

        setEditingScheduleId(schedule.id);
        setScheduleForm({
            title: schedule.title ?? "",
            scheduled_date: scheduleParts.date,
            scheduled_time: scheduleParts.time,
            zoom_link: schedule.zoom_link ?? "",
        });
        setScheduleDialogOpen(true);
    };

    const submitSchedule = () => {
        if (
            !scheduleForm.title ||
            !scheduleForm.scheduled_date ||
            !scheduleForm.scheduled_time
        ) {
            toast.error("Lengkapi semua field jadwal.");
            return;
        }

        const scheduledAt = combineDateTime(
            scheduleForm.scheduled_date,
            scheduleForm.scheduled_time,
        );

        if (!scheduledAt) {
            toast.error("Format tanggal/jam jadwal tidak valid.");
            return;
        }

        const payload = {
            title: scheduleForm.title,
            scheduled_at: scheduledAt,
            zoom_link: scheduleForm.zoom_link || null,
        };

        const onSuccess = () => {
            setScheduleDialogOpen(false);
            setEditingScheduleId(null);
            resetScheduleForm();
        };

        if (editingScheduleId) {
            router.put(
                route("teacher.courseSchedules.update", [
                    course.id,
                    editingScheduleId,
                ]),
                payload,
                {
                    preserveScroll: true,
                    onSuccess,
                },
            );
            return;
        }

        router.post(
            route("teacher.courseSchedules.store", course.id),
            payload,
            {
                preserveScroll: true,
                onSuccess,
            },
        );
    };

    const deleteSchedule = (scheduleId: string) => {
        router.delete(
            route("teacher.courseSchedules.destroy", [course.id, scheduleId]),
            {
                preserveScroll: true,
            },
        );
    };

    const resetCourseTestForm = () => {
        setCourseTestForm({
            title: "",
            description: "",
            question_bank_id: "",
            duration: "",
            passing_score: "",
            questions_to_show: "",
            start_date: null,
            start_time: "",
            end_date: null,
            end_time: "",
            show_score: true,
        });
    };

    const openCreateCourseTestDialog = () => {
        setEditingCourseTestId(null);
        resetCourseTestForm();
        setTestDialogOpen(true);
    };

    const openEditCourseTestDialog = (courseTest: any) => {
        const startParts = parseDateTimeParts(courseTest.start_date);
        const endParts = parseDateTimeParts(courseTest.end_date);

        setEditingCourseTestId(courseTest.id);
        setCourseTestForm({
            title: courseTest.title ?? "",
            description: courseTest.description ?? "",
            question_bank_id: courseTest.question_bank_id ?? "",
            duration: String(courseTest.duration ?? 0),
            passing_score: String(courseTest.passing_score ?? 0),
            questions_to_show:
                courseTest.questions_to_show !== null &&
                typeof courseTest.questions_to_show !== "undefined"
                    ? String(courseTest.questions_to_show)
                    : "",
            start_date: startParts.date,
            start_time: startParts.time,
            end_date: endParts.date,
            end_time: endParts.time,
            show_score: !!courseTest.show_score,
        });
        setTestDialogOpen(true);
    };

    const submitCourseTest = () => {
        if (!courseTestForm.title || !courseTestForm.question_bank_id) {
            toast.error("Judul dan bank soal wajib diisi.");
            return;
        }

        if (
            (courseTestForm.start_date && !courseTestForm.start_time) ||
            (!courseTestForm.start_date && courseTestForm.start_time)
        ) {
            toast.error("Lengkapi tanggal dan jam mulai ujian.");
            return;
        }

        if (
            (courseTestForm.end_date && !courseTestForm.end_time) ||
            (!courseTestForm.end_date && courseTestForm.end_time)
        ) {
            toast.error("Lengkapi tanggal dan jam selesai ujian.");
            return;
        }

        const startDateText = combineDateTime(
            courseTestForm.start_date,
            courseTestForm.start_time,
        );
        const endDateText = combineDateTime(
            courseTestForm.end_date,
            courseTestForm.end_time,
        );

        if (!startDateText && endDateText) {
            toast.error("Tanggal selesai ujian membutuhkan tanggal mulai.");
            return;
        }

        if (startDateText && endDateText) {
            const startDate = parseLocalDateTimeText(startDateText);
            const endDate = parseLocalDateTimeText(endDateText);

            if (!startDate || !endDate) {
                toast.error("Format tanggal/jam ujian tidak valid.");
                return;
            }

            if (startDate > endDate) {
                toast.error(
                    "Tanggal selesai ujian tidak boleh sebelum tanggal mulai.",
                );
                return;
            }
        }

        const selectedBank = questionBanks.find(
            (bank: any) => bank.id === courseTestForm.question_bank_id,
        );
        const maxQuestions = Number(selectedBank?.questions_count ?? 0);
        const requestedQuestions = Number(
            courseTestForm.questions_to_show || 0,
        );

        if (
            requestedQuestions > 0 &&
            maxQuestions > 0 &&
            requestedQuestions > maxQuestions
        ) {
            toast.error(
                `Jumlah soal ditampilkan tidak boleh melebihi total soal pada bank (${maxQuestions}).`,
            );
            return;
        }

        const payload: any = {
            title: courseTestForm.title,
            description: courseTestForm.description || null,
            question_bank_id: courseTestForm.question_bank_id,
            duration: Number(courseTestForm.duration || 0),
            passing_score: Number(courseTestForm.passing_score || 0),
            questions_to_show: courseTestForm.questions_to_show
                ? Number(courseTestForm.questions_to_show)
                : null,
            start_date: startDateText,
            end_date: endDateText,
            show_score: courseTestForm.show_score,
        };

        const onSuccess = () => {
            setTestDialogOpen(false);
            setEditingCourseTestId(null);
            resetCourseTestForm();
        };

        if (editingCourseTestId) {
            router.put(
                route("teacher.courseTests.update", [
                    course.id,
                    editingCourseTestId,
                ]),
                payload,
                {
                    preserveScroll: true,
                    onSuccess,
                },
            );
            return;
        }

        router.post(route("teacher.courseTests.store", course.id), payload, {
            preserveScroll: true,
            onSuccess,
        });
    };

    const deleteCourseTest = (courseTestId: string) => {
        router.delete(
            route("teacher.courseTests.destroy", [course.id, courseTestId]),
            {
                preserveScroll: true,
            },
        );
    };

    const handleViewModul = () => {
        window.open(route("course.viewModul", course.id), "_blank");
    };

    const handleDeleteModul = async () => {
        try {
            router.delete(route("course.deleteModul", course.id), {
                preserveState: true,
                onSuccess: () => {
                    toast.success("Modul berhasil dihapus");
                    setDeleteModulOpen(false);
                },
                onError: (errors) => {
                    console.error("Delete errors:", errors);
                    toast.error("Gagal menghapus modul");
                },
            });
        } catch (error) {
            toast.error("Terjadi kesalahan saat menghapus modul");
            console.error("Delete modul error:", error);
        }
    };

    const handleRemoveParticipant = (participantId: string) => {
        router.delete(
            route("teacher.removeParticipant", [course.id, participantId]),
            {
                preserveScroll: true,
            },
        );
    };

    const handleSearchUsers = (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        fetch(
            `${route("teacher.searchUsers")}?search=${encodeURIComponent(
                query,
            )}&course_id=${course.id}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            },
        )
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data.searchResults || []);
                setIsSearching(false);
            })
            .catch((error) => {
                console.error("Search error:", error);
                setIsSearching(false);
            });
    };

    const handleAddParticipant = (userId: string) => {
        router.post(
            route("teacher.addParticipant", course.id),
            { user_id: userId },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setAddParticipantOpen(false);
                    setSearchQuery("");
                    setSearchResults([]);
                },
            },
        );
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearchUsers(searchQuery);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const participantsData: ParticipantColumns[] = participants.map(
        (p: any) => ({
            id: p.id,
            user: p.user,
            average_score: p.average_score,
            feedback: p.feedback,
            course_id: course.id,
        }),
    );

    const columns = participantColumns(handleRemoveParticipant);

    return (
        <TeacherLayout>
            <Head title={`Detail Kelas - ${course.name}`} />
            <div className="py-8 mx-auto lg:px-4">
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href={route("teacher.courses")}>
                                    Daftar Kelas
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Detail Kelas</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex items-center justify-between">
                        <h1 className="text-xl sm:text-2xl font-semibold text-primary">
                            Detail Kelas - {course.name}
                        </h1>
                        <div className="flex flex-col sm:flex-col md:flex-row items-center gap-2 md:gap-2 ">
                            <Button asChild>
                                <Link
                                    href={route(
                                        "teacher.editCourse",
                                        course.id,
                                    )}
                                >
                                    <Pencil size={16} />
                                    Edit Kelas
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-fit text-red-700 bg-red-200 border-red-200 hover:bg-red-300 flex items-center gap-1"
                                onClick={() => {
                                    setOpenDeleteModal(true);
                                }}
                            >
                                <Trash size={16} />
                                Hapus
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white border shadow p-6">
                        <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
                            <h2 className="text-lg font-bold md:mb-2 text-primary">
                                Informasi Kelas
                            </h2>
                            <span className="w-fit text-sm md:text-base md:mb-0 mb-4 font-mono font-bold px-3 py-1 rounded bg-blue-200 text-blue-900 border border-blue-400 tracking-widest shadow-sm">
                                Kode : {course.code}
                            </span>
                        </div>
                        <table className="w-full text-sm">
                            <tbody>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Nama Kelas
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">{course.name}</td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Deskripsi
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.description || "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Tanggal Pelaksanaan
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.start_date
                                            ? format(
                                                  new Date(course.start_date),
                                                  "d MMMM yyyy",
                                                  { locale: id },
                                              )
                                            : "-"}
                                        {" - "}
                                        {course.end_date
                                            ? format(
                                                  new Date(course.end_date),
                                                  "d MMMM yyyy",
                                                  { locale: id },
                                              )
                                            : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Akses Materi
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        {course.access_rights ? (
                                            JSON.parse(
                                                course.access_rights,
                                            ).map(
                                                (
                                                    access: string,
                                                    idx: number,
                                                ) => (
                                                    <span
                                                        key={access}
                                                        className="inline-block bg-yellow-100 text-yellow-700 px-2 py-1 rounded mr-2 text-xs font-semibold"
                                                    >
                                                        {access === "efaktur"
                                                            ? "e-Faktur"
                                                            : access ===
                                                                "ebupot"
                                                              ? "e-Bupot"
                                                              : access}
                                                    </span>
                                                ),
                                            )
                                        ) : (
                                            <span className="italic text-gray-400">
                                                Tidak ada akses materi
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="font-medium py-1 pr-4">
                                        Modul
                                    </td>
                                    <td className="py-1">:</td>
                                    <td className="py-1">
                                        <div className="flex md:flex-row flex-col md:items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                                className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                            >
                                                <Link
                                                    href={route(
                                                        "course.modules.index",
                                                        course.id,
                                                    )}
                                                >
                                                    <FileText size={14} />
                                                    Lihat Modul (
                                                    {course.modules_count ||
                                                        "Belum ada modul"}
                                                    )
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                                className="text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                                            >
                                                <Link
                                                    href={route(
                                                        "course.modules.create",
                                                        course.id,
                                                    )}
                                                >
                                                    <Plus size={14} />
                                                    Tambah Modul
                                                </Link>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="rounded-xl bg-white border shadow p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-primary">
                                Jadwal Kelas ({courseSchedules.length})
                            </h2>
                            <Button
                                variant="outline"
                                className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                onClick={openCreateScheduleDialog}
                            >
                                <Plus size={16} />
                                Tambah Jadwal
                            </Button>
                        </div>

                        {courseSchedules.length > 0 ? (
                            <div className="space-y-2">
                                {courseSchedules.map((schedule: any) => (
                                    <div
                                        key={schedule.id}
                                        className="rounded-lg border p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                    >
                                        <div>
                                            <div className="font-semibold text-gray-800">
                                                {schedule.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatLocalDateTime(
                                                    schedule.scheduled_at,
                                                )}
                                            </div>
                                        </div>
                                        {schedule.zoom_link ? (
                                            <a
                                                href={schedule.zoom_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm font-medium text-blue-700 hover:underline"
                                            >
                                                Buka Link Meeting
                                            </a>
                                        ) : (
                                            <span className="text-sm text-gray-500 italic">
                                                Link meeting belum diisi
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                                                onClick={() =>
                                                    openEditScheduleDialog(
                                                        schedule,
                                                    )
                                                }
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-700 border-red-200 hover:bg-red-50"
                                                    >
                                                        <Trash size={14} />
                                                        Hapus
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Hapus Jadwal
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Apakah Anda yakin
                                                            ingin menghapus
                                                            jadwal ini?
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Batal
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className="bg-red-600 hover:bg-red-700"
                                                            onClick={() =>
                                                                deleteSchedule(
                                                                    schedule.id,
                                                                )
                                                            }
                                                        >
                                                            Hapus
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Belum ada jadwal kelas.
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl bg-white border shadow p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-primary">
                                Ujian Kelas ({courseTests.length})
                            </h2>
                            <Button
                                variant="outline"
                                className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                onClick={openCreateCourseTestDialog}
                            >
                                <Plus size={16} />
                                Tambah Ujian
                            </Button>
                        </div>

                        {courseTests.length > 0 ? (
                            <div className="space-y-2">
                                {courseTests.map((courseTest: any) => (
                                    <div
                                        key={courseTest.id}
                                        className="rounded-xl border bg-slate-50/60 p-4"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                            <div>
                                                <div className="font-semibold text-gray-800 text-base">
                                                    {courseTest.title}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Bank Soal:{" "}
                                                    {courseTest.question_bank
                                                        ?.name || "-"}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 md:justify-end md:self-start">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-blue-700 border-blue-200 hover:bg-blue-50"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            "teacher.courseTests.detail",
                                                            [
                                                                course.id,
                                                                courseTest.id,
                                                            ],
                                                        )}
                                                    >
                                                        <Eye size={14} />
                                                        Detail
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-yellow-700 border-yellow-200 hover:bg-yellow-50"
                                                    onClick={() =>
                                                        openEditCourseTestDialog(
                                                            courseTest,
                                                        )
                                                    }
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-700 border-red-200 hover:bg-red-50"
                                                        >
                                                            <Trash size={14} />
                                                            Hapus
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Hapus Ujian
                                                                Kelas
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Apakah Anda
                                                                yakin ingin
                                                                menghapus ujian
                                                                kelas ini?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Batal
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-600 hover:bg-red-700"
                                                                onClick={() =>
                                                                    deleteCourseTest(
                                                                        courseTest.id,
                                                                    )
                                                                }
                                                            >
                                                                Hapus
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                                            <div className="rounded-md border bg-white p-2">
                                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                    Durasi
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {courseTest.duration || 0}{" "}
                                                    menit
                                                </p>
                                            </div>
                                            <div className="rounded-md border bg-white p-2">
                                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                    Passing Score
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {courseTest.passing_score ||
                                                        0}
                                                </p>
                                            </div>
                                            <div className="rounded-md border bg-white p-2 col-span-2 md:col-span-1">
                                                <p className="text-[11px] uppercase tracking-wide text-gray-500">
                                                    Soal Ditampilkan
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {courseTest.questions_to_show ||
                                                        "Semua"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
                                            <div className="rounded-md border border-dashed bg-white p-2">
                                                Jadwal Mulai:{" "}
                                                {courseTest.start_date
                                                    ? formatLocalDateTime(
                                                          courseTest.start_date,
                                                      )
                                                    : "-"}
                                            </div>
                                            <div className="rounded-md border border-dashed bg-white p-2">
                                                Jadwal Selesai:{" "}
                                                {courseTest.end_date
                                                    ? formatLocalDateTime(
                                                          courseTest.end_date,
                                                      )
                                                    : "-"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Belum ada ujian kelas.
                            </div>
                        )}
                    </div>

                    <Dialog
                        open={scheduleDialogOpen}
                        onOpenChange={setScheduleDialogOpen}
                    >
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingScheduleId
                                        ? "Edit Jadwal Kelas"
                                        : "Tambah Jadwal Kelas"}
                                </DialogTitle>
                                <DialogDescription>
                                    Lengkapi judul, waktu pelaksanaan, dan link
                                    meeting.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-3 py-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Judul Jadwal
                                    </p>
                                    <Input
                                        placeholder="Masukkan judul jadwal"
                                        value={scheduleForm.title}
                                        onChange={(e) =>
                                            setScheduleForm((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Waktu Pelaksanaan
                                    </p>
                                    <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-3">
                                        <Popover
                                            open={scheduleDateOpen}
                                            onOpenChange={setScheduleDateOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        "w-full min-w-0 justify-start text-left font-normal overflow-hidden",
                                                        !scheduleForm.scheduled_date &&
                                                            "text-muted-foreground",
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                                    {scheduleForm.scheduled_date ? (
                                                        format(
                                                            scheduleForm.scheduled_date,
                                                            "yyyy-MM-dd",
                                                        )
                                                    ) : (
                                                        <span className="truncate">
                                                            Pilih tanggal
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={
                                                        scheduleForm.scheduled_date ||
                                                        undefined
                                                    }
                                                    onSelect={(date) => {
                                                        setScheduleForm(
                                                            (prev) => ({
                                                                ...prev,
                                                                scheduled_date:
                                                                    date ??
                                                                    null,
                                                            }),
                                                        );
                                                        setScheduleDateOpen(
                                                            false,
                                                        );
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>

                                        <Input
                                            type="time"
                                            className="w-full min-w-[120px]"
                                            value={scheduleForm.scheduled_time}
                                            onChange={(e) =>
                                                setScheduleForm((prev) => ({
                                                    ...prev,
                                                    scheduled_time:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Link Meeting (Opsional)
                                    </p>
                                    <Input
                                        placeholder="Masukkan link meeting jika sudah tersedia"
                                        value={scheduleForm.zoom_link}
                                        onChange={(e) =>
                                            setScheduleForm((prev) => ({
                                                ...prev,
                                                zoom_link: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <Button onClick={submitSchedule}>
                                    {editingScheduleId
                                        ? "Simpan Perubahan"
                                        : "Tambah Jadwal"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog
                        open={testDialogOpen}
                        onOpenChange={setTestDialogOpen}
                    >
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCourseTestId
                                        ? "Edit Ujian Kelas"
                                        : "Tambah Ujian Kelas"}
                                </DialogTitle>
                                <DialogDescription>
                                    Ujian kelas bersifat opsional dan tetap
                                    terikat ke bank soal Anda.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Judul Ujian
                                    </p>
                                    <Input
                                        placeholder="Masukkan judul ujian"
                                        value={courseTestForm.title}
                                        onChange={(e) =>
                                            setCourseTestForm((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Bank Soal
                                    </p>
                                    <select
                                        value={courseTestForm.question_bank_id}
                                        onChange={(e) => {
                                            const nextBankId = e.target.value;
                                            const nextBank = questionBanks.find(
                                                (bank: any) =>
                                                    bank.id === nextBankId,
                                            );
                                            const nextMax = Number(
                                                nextBank?.questions_count ?? 0,
                                            );

                                            setCourseTestForm((prev) => {
                                                if (!nextBankId) {
                                                    return {
                                                        ...prev,
                                                        question_bank_id:
                                                            nextBankId,
                                                        questions_to_show: "",
                                                    };
                                                }

                                                const currentQuestions = Number(
                                                    prev.questions_to_show || 0,
                                                );

                                                return {
                                                    ...prev,
                                                    question_bank_id:
                                                        nextBankId,
                                                    questions_to_show:
                                                        currentQuestions > 0 &&
                                                        nextMax > 0 &&
                                                        currentQuestions >
                                                            nextMax
                                                            ? String(nextMax)
                                                            : prev.questions_to_show,
                                                };
                                            });
                                        }}
                                        className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    >
                                        <option value="">
                                            Pilih bank soal
                                        </option>
                                        {questionBanks.map((bank: any) => (
                                            <option
                                                key={bank.id}
                                                value={bank.id}
                                            >
                                                {bank.name}
                                                {bank.is_active
                                                    ? ""
                                                    : " (Nonaktif)"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Deskripsi Ujian
                                    </p>
                                    <Input
                                        placeholder="Masukkan deskripsi ujian"
                                        value={courseTestForm.description}
                                        onChange={(e) =>
                                            setCourseTestForm((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Durasi ujian (menit)
                                    </p>
                                    <Input
                                        type="number"
                                        min={0}
                                        placeholder="Contoh: 60"
                                        value={courseTestForm.duration}
                                        onChange={(e) =>
                                            setCourseTestForm((prev) => ({
                                                ...prev,
                                                duration: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Nilai minimum lulus (passing score)
                                    </p>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={100}
                                        placeholder="Contoh: 75"
                                        value={courseTestForm.passing_score}
                                        onChange={(e) =>
                                            setCourseTestForm((prev) => ({
                                                ...prev,
                                                passing_score: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground">
                                        Jumlah soal yang ditampilkan
                                    </p>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={
                                            maxQuestionsFromSelectedBank > 0
                                                ? maxQuestionsFromSelectedBank
                                                : undefined
                                        }
                                        disabled={
                                            !courseTestForm.question_bank_id
                                        }
                                        placeholder={
                                            courseTestForm.question_bank_id
                                                ? maxQuestionsFromSelectedBank >
                                                  0
                                                    ? `Maksimal ${maxQuestionsFromSelectedBank}`
                                                    : "Bank soal belum memiliki soal"
                                                : "Pilih bank soal terlebih dahulu"
                                        }
                                        value={courseTestForm.questions_to_show}
                                        onChange={(e) => {
                                            const rawValue = e.target.value;

                                            if (rawValue === "") {
                                                setCourseTestForm((prev) => ({
                                                    ...prev,
                                                    questions_to_show: "",
                                                }));
                                                return;
                                            }

                                            const parsed = Number(rawValue);
                                            if (Number.isNaN(parsed)) {
                                                return;
                                            }

                                            const limitedValue =
                                                maxQuestionsFromSelectedBank >
                                                    0 &&
                                                parsed >
                                                    maxQuestionsFromSelectedBank
                                                    ? maxQuestionsFromSelectedBank
                                                    : parsed;

                                            setCourseTestForm((prev) => ({
                                                ...prev,
                                                questions_to_show:
                                                    String(limitedValue),
                                            }));
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        {courseTestForm.question_bank_id
                                            ? maxQuestionsFromSelectedBank > 0
                                                ? `Total soal bank terpilih: ${maxQuestionsFromSelectedBank}`
                                                : "Bank soal terpilih belum memiliki soal."
                                            : "Pilih bank soal untuk mengatur jumlah soal ditampilkan."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:col-span-2">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Waktu Mulai Ujian
                                        </p>
                                        <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2">
                                            <Popover
                                                open={testStartDateOpen}
                                                onOpenChange={
                                                    setTestStartDateOpen
                                                }
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full min-w-0 justify-start text-left font-normal overflow-hidden",
                                                            !courseTestForm.start_date &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                                        {courseTestForm.start_date ? (
                                                            format(
                                                                courseTestForm.start_date,
                                                                "yyyy-MM-dd",
                                                            )
                                                        ) : (
                                                            <span className="truncate">
                                                                Tanggal mulai
                                                                ujian
                                                            </span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            courseTestForm.start_date ||
                                                            undefined
                                                        }
                                                        onSelect={(date) => {
                                                            setCourseTestForm(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    start_date:
                                                                        date ??
                                                                        null,
                                                                }),
                                                            );
                                                            setTestStartDateOpen(
                                                                false,
                                                            );
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <Input
                                                type="time"
                                                className="w-full min-w-[120px]"
                                                value={
                                                    courseTestForm.start_time
                                                }
                                                onChange={(e) =>
                                                    setCourseTestForm(
                                                        (prev) => ({
                                                            ...prev,
                                                            start_time:
                                                                e.target.value,
                                                        }),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Waktu Selesai Ujian
                                        </p>
                                        <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-2">
                                            <Popover
                                                open={testEndDateOpen}
                                                onOpenChange={
                                                    setTestEndDateOpen
                                                }
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full min-w-0 justify-start text-left font-normal overflow-hidden",
                                                            !courseTestForm.end_date &&
                                                                "text-muted-foreground",
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                                                        {courseTestForm.end_date ? (
                                                            format(
                                                                courseTestForm.end_date,
                                                                "yyyy-MM-dd",
                                                            )
                                                        ) : (
                                                            <span className="truncate">
                                                                Tanggal selesai
                                                                ujian
                                                            </span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto p-0"
                                                    align="start"
                                                >
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            courseTestForm.end_date ||
                                                            undefined
                                                        }
                                                        onSelect={(date) => {
                                                            setCourseTestForm(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    end_date:
                                                                        date ??
                                                                        null,
                                                                }),
                                                            );
                                                            setTestEndDateOpen(
                                                                false,
                                                            );
                                                        }}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <Input
                                                type="time"
                                                className="w-full min-w-[120px]"
                                                value={courseTestForm.end_time}
                                                onChange={(e) =>
                                                    setCourseTestForm(
                                                        (prev) => ({
                                                            ...prev,
                                                            end_time:
                                                                e.target.value,
                                                        }),
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <label className="md:col-span-2 flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={courseTestForm.show_score}
                                        onCheckedChange={(checked) =>
                                            setCourseTestForm((prev) => ({
                                                ...prev,
                                                show_score: checked === true,
                                            }))
                                        }
                                    />
                                    Tampilkan nilai ke peserta
                                </label>
                                <Button
                                    className="md:col-span-2"
                                    onClick={submitCourseTest}
                                >
                                    {editingCourseTestId
                                        ? "Simpan Perubahan"
                                        : "Tambah Ujian"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="rounded-xl bg-white border shadow p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-primary">
                                Daftar Peserta ({participants.length})
                            </h2>
                            <Dialog
                                open={addParticipantOpen}
                                onOpenChange={setAddParticipantOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                                    >
                                        <UserPlus size={16} />
                                        Tambah Peserta
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>
                                            Tambah Peserta
                                        </DialogTitle>
                                        <DialogDescription>
                                            Cari dan tambahkan peserta ke kelas
                                            ini.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="relative">
                                            <Search
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                size={16}
                                            />
                                            <Input
                                                placeholder="Cari nama atau email peserta..."
                                                className="pl-10"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Search Results */}
                                        <div className="max-h-64 overflow-y-auto">
                                            {isSearching && (
                                                <div className="text-center py-4 text-gray-500">
                                                    Mencari...
                                                </div>
                                            )}

                                            {!isSearching &&
                                                searchQuery.length >= 2 &&
                                                searchResults.length === 0 && (
                                                    <div className="text-center py-4 text-gray-500">
                                                        Tidak ada peserta
                                                        ditemukan
                                                    </div>
                                                )}

                                            {searchResults.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleAddParticipant(
                                                                user.id,
                                                            )
                                                        }
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        Tambah
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <DataTableParticipant
                            columns={columns}
                            data={participantsData}
                        />
                    </div>
                </div>
                <ConfirmDialog
                    title="Hapus Kelas"
                    description="Apakah Anda yakin ingin menghapus kelas ini?"
                    open={openDeleteModal}
                    onClose={() => setOpenDeleteModal(false)}
                    onConfirm={() => {
                        router.delete(
                            route("teacher.destroyCourse", course.id),
                            {
                                preserveScroll: true,
                            },
                        );
                    }}
                />
            </div>
        </TeacherLayout>
    );
}
