/**
 * LocalStorage utility with robust error handling and fallback.
 */

const PREFIX = 'dkc:';

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const raw = localStorage.getItem(PREFIX + key);
      if (!raw) return defaultValue;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`Error reading localStorage for key ${key}:`, e);
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`Error writing localStorage for key ${key}:`, e);
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(PREFIX + key);
      return true;
    } catch (e) {
      console.warn(`Error removing localStorage for key ${key}:`, e);
      return false;
    }
  },

  getAllWithPrefix(prefixSuffix: string = ''): Record<string, any> {
    const result: Record<string, any> = {};
    try {
      if (typeof window === 'undefined') return result;
      const targetPrefix = PREFIX + prefixSuffix;
      for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (fullKey && fullKey.startsWith(targetPrefix)) {
          const raw = localStorage.getItem(fullKey);
          if (raw) {
            try {
              result[fullKey.replace(PREFIX, '')] = JSON.parse(raw);
            } catch {
              result[fullKey.replace(PREFIX, '')] = raw;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error reading storage items:', e);
    }
    return result;
  },

  clearAllDkcData(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (e) {
      console.warn('Error clearing storage:', e);
      return false;
    }
  },

  // Student name handling
  getStudentName(): string {
    return this.get<string>('student_name', '');
  },

  setStudentName(name: string): void {
    this.set('student_name', name);
  },

  // Save prediction log
  savePrediction(
    missionId: number,
    caseId: string,
    title: string,
    userGuess: string,
    actualOutput: string,
    status: 'same' | 'missed'
  ) {
    const key = `prediction:${missionId}:${caseId}`;
    this.set(key, {
      missionId,
      caseId,
      title,
      userGuess,
      actualOutput,
      status,
      timestamp: Date.now()
    });
  },

  // Save reflection note
  saveReflection(missionId: number, caseId: string, prompt: string, noteText: string) {
    const key = `reflection:${missionId}:${caseId}`;
    this.set(key, {
      missionId,
      caseId,
      prompt,
      noteText,
      timestamp: Date.now()
    });
  },

  // Save true/false choice & reasoning
  saveTrueFalseReason(
    missionId: number,
    caseId: string,
    statement: string,
    userChoice: boolean,
    isCorrect: boolean,
    reason: string
  ) {
    const key = `tf_reason:${missionId}:${caseId}`;
    this.set(key, {
      missionId,
      caseId,
      statement,
      userChoice,
      isCorrect,
      reason,
      timestamp: Date.now()
    });
  },

  // Save general free note per mission
  saveFreeNote(missionId: number, text: string) {
    const key = `freenote:${missionId}`;
    this.set(key, {
      missionId,
      text,
      timestamp: Date.now()
    });
  },

  // Mark a case completed
  markCaseCompleted(missionId: number, caseId: string) {
    const setKey = `completed_cases:${missionId}`;
    const completed = this.get<string[]>(setKey, []);
    if (!completed.includes(caseId)) {
      completed.push(caseId);
      this.set(setKey, completed);
    }
  },

  getCompletedCases(missionId: number): string[] {
    return this.get<string[]>(`completed_cases:${missionId}`, []);
  },

  exportNotebookAsText(): string {
    const studentName = this.getStudentName() || 'Nama Siswa Belum Diisi';
    const dateStr = new Date().toLocaleString('id-ID');
    let text = `====================================================\n`;
    text += `   BUKU CATATAN DETEKTIF KODE C++\n`;
    text += `   Nama Siswa  : ${studentName}\n`;
    text += `   Waktu Ekspor: ${dateStr}\n`;
    text += `   Aplikasi    : Detektif Kode C++ (SMA Kelas XI)\n`;
    text += `====================================================\n\n`;

    const allData = this.getAllWithPrefix();

    // Group by mission
    for (let m = 1; m <= 10; m++) {
      const missionPredictions: any[] = [];
      const missionReflections: any[] = [];
      const missionTFReasons: any[] = [];
      let missionFreeNote: any = null;

      Object.entries(allData).forEach(([key, val]) => {
        if (key.startsWith(`prediction:${m}:`)) {
          missionPredictions.push(val);
        } else if (key.startsWith(`reflection:${m}:`)) {
          missionReflections.push(val);
        } else if (key.startsWith(`tf_reason:${m}:`)) {
          missionTFReasons.push(val);
        } else if (key === `freenote:${m}`) {
          missionFreeNote = val;
        }
      });

      if (
        missionPredictions.length > 0 ||
        missionReflections.length > 0 ||
        missionTFReasons.length > 0 ||
        missionFreeNote
      ) {
        text += `\n----------------------------------------------------\n`;
        text += `MISI ${m}\n`;
        text += `----------------------------------------------------\n`;

        if (missionPredictions.length > 0) {
          text += `\n[HASIL INVESTIGASI & PREDIKSI]\n`;
          missionPredictions.forEach((p, idx) => {
            text += `${idx + 1}. ${p.title}\n`;
            text += `   Tebakan Siswa  : ${p.userGuess || '(kosong)'}\n`;
            text += `   Hasil Asli     : ${p.actualOutput}\n`;
            text += `   Kesesuaian     : ${p.status === 'same' ? 'Tepat / Sama' : 'Meleset'}\n\n`;
          });
        }

        if (missionTFReasons.length > 0) {
          text += `\n[UJI BENAR ATAU SALAH (DENGAN ALASAN)]\n`;
          missionTFReasons.forEach((tf, idx) => {
            text += `${idx + 1}. Pernyataan: ${tf.statement}\n`;
            text += `   Jawaban Siswa: ${tf.userChoice ? 'BENAR' : 'SALAH'} (${tf.isCorrect ? 'Tepat' : 'Meleset'})\n`;
            if (tf.reason) {
              text += `   Alasan Siswa : ${tf.reason}\n`;
            }
            text += `\n`;
          });
        }

        if (missionReflections.length > 0) {
          text += `\n[REFLEKSI & TEMUAN]\n`;
          missionReflections.forEach((r, idx) => {
            text += `${idx + 1}. Pertanyaan: ${r.prompt}\n`;
            text += `   Jawaban Siswa: ${r.noteText || '(belum diisi)'}\n\n`;
          });
        }

        if (missionFreeNote && missionFreeNote.text?.trim()) {
          text += `\n[CATATAN BEBAS MISI ${m}]\n`;
          text += `${missionFreeNote.text}\n\n`;
        }
      }
    }

    // Check Final Reflections
    const finalRefs: any[] = [];
    Object.entries(allData).forEach(([key, val]) => {
      if (key.startsWith('reflection:final:')) {
        finalRefs.push(val);
      }
    });

    if (finalRefs.length > 0) {
      text += `\n----------------------------------------------------\n`;
      text += `REFLEKSI AKHIR DETEKTIF KODE\n`;
      text += `----------------------------------------------------\n`;
      finalRefs.forEach((fr, idx) => {
        text += `${idx + 1}. ${fr.prompt}\n`;
        text += `   Jawaban: ${fr.noteText || '(belum diisi)'}\n\n`;
      });
    }

    text += `\n====================================================\n`;
    text += `Dibuat oleh Dimas BN. Belajar • Berbagi • Berkarya • Menginspirasi\n`;
    text += `Tetap teliti dan pantang menyerah, Detektif!\n`;
    text += `====================================================\n`;
    return text;
  }
};
