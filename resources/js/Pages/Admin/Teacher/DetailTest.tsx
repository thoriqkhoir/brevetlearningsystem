import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function AdminDetailTest({ teacher, test = {}, participants = [] }: any) {
  return (
    <AdminLayout>
      <Head title={`Detail Ujian - ${test?.title ?? ""}`} />
      <div className="py-8 mx-auto lg:px-4">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href={route("admin.teachers")}>Daftar Pengajar</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link href={route("admin.showTeacher", (teacher as any)?.id)}>Detail Pengajar</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Detail Ujian</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold text-primary">
              Detail Ujian - {(test as any)?.title}
            </h1>
          </div>

          <div className="rounded-xl bg-white border shadow p-6">
            <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
              <h2 className="text-lg font-bold md:mb-2 text-primary">Informasi Ujian</h2>
              <span className="w-fit text-sm md:text-base md:mb-0 mb-4 font-mono font-bold px-3 py-1 rounded bg-blue-200 text-blue-900 border border-blue-400 tracking-widest shadow-sm">
                Kode : {(test as any)?.code}
              </span>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="font-medium py-1 pr-4">Nama Ujian</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{(test as any)?.title}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1 pr-4">Deskripsi</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{(test as any)?.description || '-'}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1 pr-4">Durasi</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{typeof (test as any)?.duration === 'number' ? (test as any).duration : '-'} Menit</td>
                </tr>
                <tr>
                  <td className="font-medium py-1 pr-4">Passing Grade</td>
                  <td className="py-1">:</td>
                  <td className="py-1">{typeof (test as any)?.passing_score === 'number' ? (test as any).passing_score : '-'}</td>
                </tr>
                <tr>
                  <td className="font-medium py-1 pr-4">Tanggal Pelaksanaan</td>
                  <td className="py-1">:</td>
                  <td className="py-1">
                    {(test as any)?.start_date
                      ? format(new Date((test as any).start_date), 'd MMMM yyyy', { locale: id })
                      : '-'}
                    {" - "}
                    {(test as any)?.start_date
                      ? format(new Date((test as any).start_date), 'HH:mm', { locale: id })
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium py-1 pr-4">Ujian Ditutup</td>
                  <td className="py-1">:</td>
                  <td className="py-1">
                    {(test as any)?.end_date
                      ? format(new Date((test as any).end_date), 'd MMMM yyyy', { locale: id })
                      : '-'}
                    {" - "}
                    {(test as any)?.end_date
                      ? format(new Date((test as any).end_date), 'HH:mm', { locale: id })
                      : '-'}
                  </td>
                </tr>
                <tr>
                  <td className="font-medium py-1 pr-4">Banyak Soal</td>
                  <td className="py-1">:</td>
                  <td className="py-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex gap-2 py-1 ">
                         {typeof (test as any)?.question_count === 'number' ? `${(test as any).question_count} Soal` : '(Belum ada soal)'}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-xl bg-white border shadow p-6">
            <div className="flex md:flex-row flex-col gap-2 md:items-center justify-between">
              <h2 className="text-lg font-bold text-primary">Daftar Peserta ({participants?.length || 0})</h2>
            </div>

            {participants?.length ? (
              <div className="overflow-x-auto mt-3">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4">Nama</th>
                      <th className="py-2 pr-4">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p: any) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-2 pr-4">{p.user?.name || '-'}</td>
                        <td className="py-2 pr-4">{p.user?.email || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 mt-2">Belum ada peserta.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
