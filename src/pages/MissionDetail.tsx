import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, BookOpen, CheckCircle, Award, Sparkles } from 'lucide-react';
import { MISSIONS } from '../data/missions';
import { mission1Data } from '../data/mission1';
import { mission2Data } from '../data/mission2';
import { mission3Data } from '../data/mission3';
import { mission4Data } from '../data/mission4';
import { mission5Data } from '../data/mission5';
import { mission6Data } from '../data/mission6';
import { mission7Data } from '../data/mission7';
import { mission8Data } from '../data/mission8';
import { mission9Data } from '../data/mission9';
import { mission10Data } from '../data/mission10';

import { CodeViewer } from '../components/CodeViewer';
import { PredictAnswer } from '../components/PredictAnswer';
import { TraceTable } from '../components/TraceTable';
import { StepTracer } from '../components/StepTracer';
import { LineOrder } from '../components/LineOrder';
import { ExpressionLab } from '../components/ExpressionLab';
import { ReflectionNote } from '../components/ReflectionNote';
import { OnlineCompilerButton } from '../components/OnlineCompilerButton';
import { RoleMatcher } from '../components/RoleMatcher';
import { CinSimulation } from '../components/CinSimulation';
import { TempConversionDemo } from '../components/TempConversionDemo';
import { DigitSplitterDemo } from '../components/DigitSplitterDemo';
import { BranchVisualizer } from '../components/BranchVisualizer';
import { LeapYearTester } from '../components/LeapYearTester';
import { NestedLoopVisualizer } from '../components/NestedLoopVisualizer';
import { ErrorHunt } from '../components/ErrorHunt';
import { DiagnosticHunt } from '../components/DiagnosticHunt';
import { TrueFalse } from '../components/TrueFalse';
import { ProjectWorkspace } from '../components/ProjectWorkspace';
import { storage } from '../utils/storage';

export const MissionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const missionId = parseInt(id || '1', 10);

  const mission = MISSIONS.find((m) => m.id === missionId);

  // Completed cases tracker for current mission
  const [completedCases, setCompletedCases] = useState<string[]>([]);
  // Mission 9 first attempt correct counter
  const [firstAttemptCorrectCount, setFirstAttemptCorrectCount] = useState<number>(0);

  useEffect(() => {
    setCompletedCases(storage.getCompletedCases(missionId));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Calculate initial first attempt score for Mission 9
    if (missionId === 9) {
      calculateM9FirstAttempt();
    }
  }, [missionId]);

  const refreshProgress = () => {
    setCompletedCases(storage.getCompletedCases(missionId));
  };

  const calculateM9FirstAttempt = () => {
    let count = 0;
    mission9Data.questions.forEach((q) => {
      const saved = storage.get<{ firstAttemptCorrect?: boolean } | null>(
        `truefalse:9:${q.id}`,
        null
      );
      if (saved && saved.firstAttemptCorrect) {
        count++;
      }
    });
    setFirstAttemptCorrectCount(count);
  };

  const handleM9Completed = () => {
    refreshProgress();
    calculateM9FirstAttempt();
  };

  if (!mission) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Misi Tidak Ditemukan</h2>
        <Link to="/peta-misi" className="text-cyan-400 hover:underline">
          Kembali ke Peta Misi
        </Link>
      </div>
    );
  }

  const prevMission = MISSIONS.find((m) => m.id === missionId - 1);
  const nextMission = MISSIONS.find((m) => m.id === missionId + 1);
  const isMissionFinished = completedCases.length >= mission.caseCount;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to="/peta-misi" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Peta Misi</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-cyan-400 font-bold">Misi {mission.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <OnlineCompilerButton />
          <Link
            to="/catatan"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 text-xs font-semibold touch-target transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Buku Catatan</span>
          </Link>
        </div>
      </div>

      {/* Mission Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-8 border-cyan-500/30 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono mb-3">
              <span className="font-bold">INVESTIGASI KASUS #{mission.id}</span>
              <span>•</span>
              <span>{mission.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white font-orbitron tracking-tight mb-2">
              {mission.title}
            </h1>
            <div className="text-sm font-mono text-purple-300 mb-3 font-semibold">
              {mission.subtitle}
            </div>
            <p className="text-slate-300 text-base max-w-3xl leading-relaxed">
              {mission.description}
            </p>
          </div>

          <div className="bg-black/50 border border-cyan-500/20 rounded-xl p-4 text-center shrink-0 min-w-[150px]">
            <span className="text-xs font-mono text-slate-400 uppercase block mb-1">
              Kasus Terjawab / Dicek
            </span>
            <div className="text-2xl font-mono font-bold text-cyan-300">
              {completedCases.length} / {mission.caseCount}
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (completedCases.length / mission.caseCount) * 100)}%`
                }}
              />
            </div>
            {isMissionFinished && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 mt-2">
                <CheckCircle className="w-3 h-3" />
                Misi Selesai
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MISSION 1: Membedah Anatomi Program                            */}
      {/* ============================================================== */}
      {missionId === 1 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-2 font-orbitron">
              Spesimen Kode: Penghitung Luas Persegi Panjang
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Perhatikan baik-baik susunan kode C++ lengkap di bawah ini beserta nomor barisnya:
            </p>
            <CodeViewer code={mission1Data.mainCode} title="anatomi_dasar.cpp" />
          </div>

          <RoleMatcher
            missionId={1}
            caseId="soal-1-1"
            onCompleted={refreshProgress}
          />

          <PredictAnswer
            missionId={1}
            caseId={mission1Data.case1_2.id}
            title={mission1Data.case1_2.title}
            question={mission1Data.case1_2.question}
            code={mission1Data.case1_2.code}
            actualOutput={mission1Data.case1_2.actualOutput}
            explanation={mission1Data.case1_2.explanation}
            contextNote={mission1Data.case1_2.contextNote}
          />

          <PredictAnswer
            missionId={1}
            caseId={mission1Data.case1_3.id}
            title={mission1Data.case1_3.title}
            question={mission1Data.case1_3.question}
            code={mission1Data.case1_3.code}
            actualOutput={mission1Data.case1_3.actualOutput}
            explanation={mission1Data.case1_3.explanation}
            contextNote={mission1Data.case1_3.contextNote}
          />

          <ReflectionNote
            missionId={1}
            caseId={mission1Data.case1_4.id}
            title={mission1Data.case1_4.title}
            prompt={mission1Data.case1_4.prompt}
            hint={mission1Data.case1_4.hint}
            hintButtonLabel={mission1Data.case1_4.hintButtonLabel}
            onCompleted={refreshProgress}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 2: Jejak Memori                                       */}
      {/* ============================================================== */}
      {missionId === 2 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed">
              {mission2Data.overview}
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg font-bold text-white mb-2 font-orbitron">
              Kode Investigasi: Jejak Perubahan Variabel
            </h3>
            <CodeViewer code={mission2Data.codeSnippet} title="jejak_memori.cpp" />
          </div>

          <TraceTable
            missionId={2}
            caseId={mission2Data.case2_1_table.id}
            data={mission2Data.case2_1_table}
            onCompleted={refreshProgress}
          />

          <StepTracer data={mission2Data.case2_1_steptracer} />

          <PredictAnswer
            missionId={2}
            caseId={mission2Data.case2_2.id}
            title={mission2Data.case2_2.title}
            question={mission2Data.case2_2.question}
            code={mission2Data.case2_2.code}
            actualOutput={mission2Data.case2_2.actualOutput}
            explanation={mission2Data.case2_2.explanation}
            contextNote={mission2Data.case2_2.contextNote}
          />

          <LineOrder
            missionId={2}
            caseId={mission2Data.case2_3_order.id}
            data={mission2Data.case2_3_order}
            onCompleted={refreshProgress}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 3: Laboratorium Tipe Data                             */}
      {/* ============================================================== */}
      {missionId === 3 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed">
              {mission3Data.overview}
            </p>
          </div>

          <PredictAnswer
            missionId={3}
            caseId={mission3Data.predictCases[0].id}
            title={mission3Data.predictCases[0].title}
            question={mission3Data.predictCases[0].question}
            code={mission3Data.predictCases[0].code}
            actualOutput={mission3Data.predictCases[0].actualOutput}
            explanation={mission3Data.predictCases[0].explanation}
          />

          <PredictAnswer
            missionId={3}
            caseId={mission3Data.predictCases[1].id}
            title={mission3Data.predictCases[1].title}
            question={mission3Data.predictCases[1].question}
            code={mission3Data.predictCases[1].code}
            actualOutput={mission3Data.predictCases[1].actualOutput}
            explanation={mission3Data.predictCases[1].explanation}
          />

          <ReflectionNote
            missionId={3}
            caseId={mission3Data.midReflection.id}
            title={mission3Data.midReflection.title}
            prompt={mission3Data.midReflection.prompt}
            hint={mission3Data.midReflection.hint}
            onCompleted={refreshProgress}
          />

          {mission3Data.predictCases.slice(2).map((c) => (
            <PredictAnswer
              key={c.id}
              missionId={3}
              caseId={c.id}
              title={c.title}
              question={c.question}
              code={c.code}
              actualOutput={c.actualOutput}
              explanation={c.explanation}
            />
          ))}

          <ExpressionLab
            title="Laboratorium Eksperimen Ekspresi Bebas"
            initialExpression="7 / 2"
            presetList={['7 / 2', '7.0 / 2', '7 / 2.0', '10 % 3', '3.99 + 1']}
          />

          <ReflectionNote
            missionId={3}
            caseId={mission3Data.finalReflection.id}
            title={mission3Data.finalReflection.title}
            prompt={mission3Data.finalReflection.prompt}
            hint={mission3Data.finalReflection.hint}
            hintButtonLabel={mission3Data.finalReflection.hintButtonLabel}
            onCompleted={refreshProgress}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 4: Input dan Output                                   */}
      {/* ============================================================== */}
      {missionId === 4 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed">
              {mission4Data.overview}
            </p>
          </div>

          <LineOrder
            missionId={4}
            caseId={mission4Data.case4_1_order.id}
            data={mission4Data.case4_1_order}
            onCompleted={refreshProgress}
          />

          <PredictAnswer
            missionId={4}
            caseId={mission4Data.case4_2_predict.id}
            title={mission4Data.case4_2_predict.title}
            question={mission4Data.case4_2_predict.question}
            code={mission4Data.case4_2_predict.code}
            actualOutput={mission4Data.case4_2_predict.actualOutput}
            explanation={mission4Data.case4_2_predict.explanation}
            contextNote={mission4Data.case4_2_predict.contextNote}
          />

          <CinSimulation />

          <TempConversionDemo />

          <ReflectionNote
            missionId={4}
            caseId={mission4Data.case4_3_reflection.id}
            title={mission4Data.case4_3_reflection.title}
            prompt={mission4Data.case4_3_reflection.prompt}
            hint={mission4Data.case4_3_reflection.hint}
            onCompleted={refreshProgress}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 5: Operator dan Urutan Pengerjaan                      */}
      {/* ============================================================== */}
      {missionId === 5 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed">
              {mission5Data.overview}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              Kasus 5.1: Hierarki Operator Aritmatika & Logika
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Tebak hasil evaluasi setiap ekspresi di bawah ini:
            </p>

            <div className="space-y-6">
              {mission5Data.case5_1_predicts.map((c) => (
                <PredictAnswer
                  key={c.id}
                  missionId={5}
                  caseId={c.id}
                  title={c.title}
                  question={c.question}
                  code={c.code}
                  actualOutput={c.actualOutput}
                  explanation={c.explanation}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              Kasus 5.2: Akumulator & Compound Assignment
            </h3>
            <TraceTable
              missionId={5}
              caseId={mission5Data.case5_2_trace.id}
              data={mission5Data.case5_2_trace}
              onCompleted={refreshProgress}
            />
            <StepTracer data={mission5Data.case5_2_steptracer} />
          </div>

          <DigitSplitterDemo />
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 6: Peta Keputusan (Percabangan)                        */}
      {/* ============================================================== */}
      {missionId === 6 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed">
              {mission6Data.overview}
            </p>
          </div>

          {/* Kasus 6.1: Visualizer Percabangan Standar */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-white font-orbitron">
                Kasus 6.1: Alur Penilaian Nilai Huruf
              </h3>
            </div>
            <div className="mb-4">
              <CodeViewer code={mission6Data.case6_1_code} title="grading_standar.cpp" />
            </div>

            <p className="text-slate-300 text-sm mb-4">
              Tebak huruf yang keluar untuk nilai-nilai berikut sebelum mengamati jalur percabangannya:
            </p>

            <div className="space-y-4 mb-6">
              {mission6Data.case6_1_predicts.map((p) => (
                <PredictAnswer
                  key={p.id}
                  missionId={6}
                  caseId={p.id}
                  title={p.title}
                  question={p.question}
                  actualOutput={p.actualOutput}
                  explanation={p.explanation}
                  showCompilerButton={false}
                />
              ))}
            </div>

            <BranchVisualizer
              title="Visualizer Eksekusi Jalur Kasus 6.1"
              rules={mission6Data.case6_1_rules}
              defaultChips={[95, 85, 80, 70, 69]}
            />
          </div>

          {/* Kasus 6.2: Perangkap Urutan Terbalik */}
          <div className="pt-6 border-t border-cyan-500/20">
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              Kasus 6.2: Perangkap Urutan Cabang Terbalik
            </h3>
            <p className="text-slate-300 text-sm mb-3">
              Perhatikan baik-baik kode berikut. Urutan pengecekan sengaja disusun terbalik (dari yang longgar &gt;= 70 ke yang ketat &gt;= 90):
            </p>
            <div className="mb-4">
              <CodeViewer code={mission6Data.case6_2_code} title="grading_terbalik.cpp" />
            </div>

            <PredictAnswer
              missionId={6}
              caseId={mission6Data.case6_2_predict.id}
              title={mission6Data.case6_2_predict.title}
              question={mission6Data.case6_2_predict.question}
              actualOutput={mission6Data.case6_2_predict.actualOutput}
              explanation={mission6Data.case6_2_predict.explanation}
              showCompilerButton={true}
              code={mission6Data.case6_2_code}
            />

            <BranchVisualizer
              title="Visualizer Jalur Kasus 6.2 (Mengapa 95 Jadi C?)"
              rules={mission6Data.case6_2_rules}
              defaultChips={[95, 85, 80, 70, 69]}
            />
          </div>

          {/* Kasus 6.3: Penguji Tahun Kabisat */}
          <div className="pt-6 border-t border-cyan-500/20">
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              Kasus 6.3: Logika Komposit Tahun Kabisat
            </h3>
            <p className="text-slate-300 text-sm mb-4">
              Sebelum membuka simulator penguji, tebak status kabisat untuk 4 tahun uji berikut:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {mission6Data.case6_3_predicts.map((kp) => (
                <PredictAnswer
                  key={kp.id}
                  missionId={6}
                  caseId={kp.id}
                  title={kp.title}
                  question={kp.question}
                  actualOutput={kp.actualOutput}
                  explanation={kp.explanation}
                  showCompilerButton={false}
                />
              ))}
            </div>

            <LeapYearTester />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 7: Mesin Pengulang (Perulangan)                        */}
      {/* ============================================================== */}
      {missionId === 7 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed">
              {mission7Data.overview}
            </p>
          </div>

          {/* Kasus 7.1: TraceTable lalu StepTracer */}
          <div>
            <h3 className="text-xl font-bold text-white font-orbitron mb-3">
              Kasus 7.1: Jejak Iterasi Perulangan for
            </h3>
            <TraceTable
              missionId={7}
              caseId={mission7Data.case7_1_trace.id}
              data={mission7Data.case7_1_trace}
              onCompleted={refreshProgress}
            />
            <StepTracer data={mission7Data.case7_1_steptracer} />
          </div>

          {/* Kasus 7.2: Visualizer Nested Loop Segitiga Bintang */}
          <div className="pt-6 border-t border-cyan-500/20">
            <NestedLoopVisualizer
              missionId={7}
              caseId="soal-7-2-nested"
              onCompleted={refreshProgress}
            />
          </div>

          {/* Kasus 7.3: Infinite Loop Error Hunt */}
          <div className="pt-6 border-t border-cyan-500/20">
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              Kasus 7.3: Menjinakkan Perulangan Abadi
            </h3>
            <ErrorHunt
              missionId={7}
              caseId={mission7Data.case7_3_errorhunt.id}
              data={mission7Data.case7_3_errorhunt}
              onCompleted={refreshProgress}
            />
          </div>

          {/* Kasus 7.4: StepTracer Faktorial & Tantangan Overflow */}
          <div className="pt-6 border-t border-cyan-500/20">
            <h3 className="text-xl font-bold text-white font-orbitron mb-2">
              Kasus 7.4: Penelusuran Perhitungan Faktorial (5!)
            </h3>
            <StepTracer data={mission7Data.case7_4_steptracer} />

            <ReflectionNote
              missionId={7}
              caseId={mission7Data.case7_4_reflection.id}
              title={mission7Data.case7_4_reflection.title}
              prompt={mission7Data.case7_4_reflection.prompt}
              hint={mission7Data.case7_4_reflection.hint}
              onCompleted={refreshProgress}
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 8: Pemburu Error                                      */}
      {/* ============================================================== */}
      {missionId === 8 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed whitespace-pre-line">
              {mission8Data.overview}
            </p>
          </div>

          <div className="space-y-6">
            {mission8Data.cases.map((c) => (
              <DiagnosticHunt
                key={c.id}
                missionId={8}
                caseId={c.id}
                data={c}
                onCompleted={refreshProgress}
              />
            ))}
          </div>

          <ReflectionNote
            missionId={8}
            caseId={mission8Data.reflection.id}
            title={mission8Data.reflection.title}
            prompt={mission8Data.reflection.prompt}
            hint={mission8Data.reflection.hint}
            onCompleted={refreshProgress}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 9: Benar atau Salah, dan Buktikan                      */}
      {/* ============================================================== */}
      {missionId === 9 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed">
              {mission9Data.overview}
            </p>
          </div>

          <div className="space-y-6">
            {mission9Data.questions.map((q) => (
              <TrueFalse
                key={q.id}
                missionId={9}
                caseId={q.id}
                data={q}
                onCompleted={handleM9Completed}
              />
            ))}
          </div>

          {/* First attempt summary card */}
          <div className="glass-panel rounded-2xl p-6 border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-purple-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white font-orbitron text-base">
                  Statistik Akurasi Analisis Detektif
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm">
                  {firstAttemptCorrectCount} dari 7 pernyataan dijawab tepat pada percobaan pertama.
                </p>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-400 italic bg-black/50 px-3 py-1.5 rounded-lg border border-slate-700">
              *Informasi ini disimpan ke Buku Catatan tanpa mempengaruhi nilai.
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MISSION 10: Misi Final: Proyek Mini Mandiri                    */}
      {/* ============================================================== */}
      {missionId === 10 && (
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-5 border-l-4 border-cyan-400">
            <p className="text-slate-200 text-base leading-relaxed">
              {mission10Data.overview}
            </p>
          </div>

          {/* Project Workspace Component */}
          <ProjectWorkspace
            projects={mission10Data.projects}
            missionId={10}
            caseId="proyek-mini-mandiri"
            onCompleted={refreshProgress}
          />

          {/* Final Reflections Section */}
          <div className="pt-8 border-t border-cyan-500/20">
            <div className="mb-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 block mb-1">
                Tahap Penutup Kurikulum
              </span>
              <h3 className="text-2xl font-black text-white font-orbitron">
                Refleksi Akhir Detektif Kode C++
              </h3>
              <p className="text-slate-300 text-sm mt-1">
                Tiga pertanyaan refleksi ini akan melengkapi portofolio akhir di Buku Catatanmu sebelum siap diekspor ke guru pembimbing.
              </p>
            </div>

            <div className="space-y-6">
              {mission10Data.finalReflections.map((fr) => (
                <ReflectionNote
                  key={fr.id}
                  missionId={10}
                  caseId={fr.id}
                  title={fr.title}
                  prompt={fr.prompt}
                  placeholder={fr.placeholder}
                  onCompleted={refreshProgress}
                />
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-purple-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-white font-orbitron">
                    Investigasi Seluruh Misi Telah Lengkap!
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm">
                    Kunjungi Buku Catatan untuk memberi nama, meninjau statistik penemuanmu, dan mengunduh berkas laporan teks (.txt).
                  </p>
                </div>
              </div>

              <Link
                to="/catatan"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm font-orbitron tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 touch-target cursor-pointer shrink-0"
              >
                <span>Buka Buku Catatan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer between missions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-12 border-t border-cyan-500/20">
        {prevMission ? (
          <Link
            to={`/misi/${prevMission.id}`}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-cyan-500/30 text-sm font-semibold touch-target cursor-pointer w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Sebelumnya: Misi {prevMission.id}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextMission ? (
          <Link
            to={`/misi/${nextMission.id}`}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-sm font-bold touch-target cursor-pointer w-full sm:w-auto justify-center shadow-lg shadow-cyan-500/20"
          >
            <span>Berikutnya: Misi {nextMission.id}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            to="/catatan"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-sm font-bold touch-target cursor-pointer w-full sm:w-auto justify-center shadow-lg shadow-purple-500/20 font-orbitron"
          >
            <span>Buku Catatan Detektif</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
