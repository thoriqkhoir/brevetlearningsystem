import { Head, Link } from "@inertiajs/react";
import HeaderOnlyLayout from "@/Layouts/HeaderOnlyLayout";
import { useEffect, useState } from "react";

export default function Result({ test, attempt, review }: any) {

  const showScore = test?.show_score ?? true;;

  return (
    <HeaderOnlyLayout title={`Hasil Ujian - ${test?.title ?? ''}`} backHref={route('tests.index')}>
      <Head title={`Hasil Ujian - ${test?.title ?? ''}`} />
      <div className="py-6 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {showScore ? (
            <>
              <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">Skor Anda</div>
                  <div className="text-3xl font-semibold">{attempt?.score ?? 0}</div>
                  <div className={`mt-1 inline-flex text-xs px-2 py-0.5 rounded-full ${attempt?.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {attempt?.passed ? 'Lulus' : 'Tidak Lulus'} (KKM {test?.passing_score ?? 0})
                  </div>
                </div>
                <Link href={route('tests.detail', test?.id)} className="px-4 py-2 rounded border bg-emerald-50">Kembali ke Deskripsi</Link>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Review Jawaban</h2>
                <div className="space-y-4">
                  {review?.map((r: any, idx: number) => (
                    <div key={r.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Soal {idx + 1}</div>
                        {r.is_correct === true && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Benar</span>
                        )}
                        {r.is_correct === false && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Salah</span>
                        )}
                        {r.is_correct === null && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">Tidak dinilai</span>
                        )}
                      </div>
                      <div className="mt-2">{r.question_text}</div>
                      {r.question_type === 'short_answer' ? (
                        <div className="mt-2">
                          <div className="text-sm text-gray-500">Jawaban Anda:</div>
                          <div className="mt-1 whitespace-pre-wrap bg-gray-50 border rounded p-2">{r.selected || '-'}</div>
                        </div>
                      ) : (
                        <div className="mt-3 space-y-2">
                          {r.options?.map((o: any) => {
                            const isSelected = r.selected === o.id;
                            const isCorrect = o.is_correct;
                            return (
                              <div key={o.id} className={`p-2 rounded border text-sm ${isCorrect ? 'bg-emerald-50 border-emerald-200' : isSelected ? 'bg-rose-50 border-rose-200' : 'bg-white'}`}>
                                <div className="flex items-center gap-2">
                                  <input type="radio" disabled checked={isSelected} />
                                  <span>{o.option_text}</span>
                                  {isCorrect && <span className="ml-auto text-xs text-emerald-700">Kunci</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border rounded-xl p-8 shadow-sm text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <svg className="mx-auto h-16 w-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Selamat Anda Telah Mengerjakan Ujian
                </h2>
                <p className="text-gray-600 mb-6">
                  Ujian Anda telah berhasil dikumpulkan. Nilai akan diumumkan oleh pengajar.
                </p>
                <Link 
                  href={route('tests.index')} 
                  className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  Kembali ke Daftar Ujian
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </HeaderOnlyLayout>
  );
}