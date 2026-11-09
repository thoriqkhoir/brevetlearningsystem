import TeacherLayout from "@/Layouts/TeacherLayout";
import SubmissionManagement from "@/Components/layout/Submission/SubmissionManagement";
import { Head } from "@inertiajs/react";

interface Props {
    submissions: any;
    courses: any[];
    filters: any;
}

export default function TeacherSubmissionIndex({
    submissions,
    courses,
    filters,
}: Props) {
    return (
        <TeacherLayout>
            <Head title="Submission Tugas Siswa Kelas" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <SubmissionManagement
                    submissions={submissions}
                    courses={courses}
                    filters={filters}
                    role="pengajar"
                />
            </div>
        </TeacherLayout>
    );
}

