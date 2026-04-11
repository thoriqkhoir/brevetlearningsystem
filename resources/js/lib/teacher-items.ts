import { BookKeyIcon, Database, Home, School, Users } from "lucide-react";

const adminItems = () => {
    return [
        {
            category: "Menu",
            items: [
                {
                    title: "Dashboard",
                    url: route("teacher.dashboard"),
                    icon: Home,
                },
                {
                    title: "Daftar Peserta",
                    url: route("teacher.participants"),
                    icon: Users,
                },
                {
                    title: "Daftar Kelas",
                    url: route("teacher.courses"),
                    icon: School,
                },
                {
                    title: "Daftar Ujian",
                    url: route("teacher.tests"),
                    icon: BookKeyIcon,
                },
                {
                    title: "Bank Soal",
                    url: route("teacher.questionBanks"),
                    icon: Database,
                },
            ],
        },
    ];
};

export default adminItems;
