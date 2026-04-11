import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link } from "@inertiajs/react";

export default function TeacherResult({ test, attempt, review, participant }: any) {
  return (
    <TeacherLayout>
      <Head title={`Hasil Ujian - ${(test?.title ?? test?.name) ?? ""}`}/>
      <div className="py-6 px-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-primary">
              Hasil Ujian - {test?.title ?? test?.name}
            </h1>
            {participant?.user?.name && (
              <p className="text-gray-600 text-sm">Peserta: {participant.user.name}</p>
            )}
          </div>
          <Link
            href={route('teacher.showTestParticipant', [test?.id, participant?.id])}
            className="px-4 py-2 rounded-md border bg-emerald-50 hover:bg-emerald-100"
          >
            Kembali ke Detail Peserta
          </Link>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Skor</div>
              <div className="text-3xl font-semibold">{attempt?.score ?? 0}</div>
              <div className={`mt-1 inline-flex text-xs px-2 py-0.5 rounded-full ${attempt?.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {attempt?.passed ? 'Lulus' : 'Tidak Lulus'} (KKM {test?.passing_score ?? 0})
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
              {attempt?.submitted_at && (<div>Diserahkan: {new Date(attempt.submitted_at).toLocaleString()}</div>)}
            </div>
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
                  <div className="mt-2 whitespace-pre-wrap">{r.question_text}</div>
                  
                  {/* Tampilkan gambar soal jika ada */}
                  {r.image_url && (
                    <div className="mt-3">
                      <img
                        src={`/storage/${r.image_url}`}
                        alt="Gambar soal"
                        className="max-h-64 rounded border object-contain"
                      />
                    </div>
                  )}
                  
                  {r.question_type === 'short_answer' ? (
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">Jawaban Peserta:</div>
                      <div className="mt-1 whitespace-pre-wrap bg-gray-50 border rounded p-2">{r.selected || '-'}</div>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {r.options?.map((o: any) => {
                        const isSelected = r.selected === o.id;
                        const isCorrect = o.is_correct;
                        return (
                          <div key={o.id} className={`p-2 rounded border text-sm ${isCorrect ? 'bg-emerald-50 border-emerald-200' : isSelected ? 'bg-rose-50 border-rose-200' : 'bg-white'}`}>
                            <div className="flex items-start gap-2">
                              <input type="radio" disabled checked={isSelected} readOnly className="mt-1" />
                              <div className="flex-1">
                                <span>{o.option_text}</span>
                                
                                {/* Tampilkan gambar opsi jika ada */}
                                {o.image_url && (
                                  <div className="mt-2">
                                    <img
                                      src={`/storage/${o.image_url}`}
                                      alt="Gambar opsi"
                                      className="max-h-32 rounded border object-contain"
                                    />
                                  </div>
                                )}
                              </div>
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
        </div>
      </div>
    </TeacherLayout>
  );
} 