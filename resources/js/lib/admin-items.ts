import {
    BookOpen,
    CalendarFold,
    Home,
    NotebookPen,
    School,
    Users,
} from "lucide-react";

const adminItems = () => {
    return [
        {
            category: "Admin Menu",
            items: [
                {
                    title: "Beranda",
                    url: route("admin.dashboard"),
                    icon: Home,
                },
                {
                    title: "Daftar Pengguna",
                    url: route("admin.users"),
                    icon: Users,
                },
                {
                    title: "Daftar Pengajar",
                    url: route("admin.teachers"),
                    icon: School,
                },
                {
                    title: "Daftar Event",
                    url: route("admin.events"),
                    icon: CalendarFold,
                },
                {
                    title: "Daftar Kelas",
                    url: route("admin.courses"),
                    icon: BookOpen,
                },
                {
                    title: "Daftar Ujian",
                    url: route("admin.tests"),
                    icon: NotebookPen,
                },
            ],
        },
    ];
};

export default adminItems;
