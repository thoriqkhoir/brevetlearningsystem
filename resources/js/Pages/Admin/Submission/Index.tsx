import AdminLayout from "@/Layouts/AdminLayout";
import SubmissionManagement from "@/Components/layout/Submission/SubmissionManagement";
import { Head } from "@inertiajs/react";

interface Props {
    submissions: any;
    courses: any[];
    filters: any;
}

export default function AdminSubmissionIndex({
    submissions,
    courses,
    filters,
}: Props) {
    return (
        <AdminLayout>
            <Head title="Manajemen Submission Tugas Siswa" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <SubmissionManagement
                    submissions={submissions}
                    courses={courses}
                    filters={filters}
                    role="admin"
                />
            </div>
        </AdminLayout>
    );
}

