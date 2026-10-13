export const mission6Data = {
  id: 6,
  title: 'Peta Keputusan (Percabangan)',
  overview: 'Komputer mampu mengambil keputusan cerdas menggunakan struktur if, else if, dan else. Namun ingat, C++ mengevaluasi cabang secara berurutan dari atas ke bawah dan langsung melompat keluar begitu menemukan kondisi pertama yang terpenuhi!',

  case6_1_code: `if (nilai >= 90) cout << "A";
else if (nilai >= 80) cout << "B";
else if (nilai >= 70) cout << "C";
else cout << "D";`,

  case6_1_rules: [
    {
      lineNum: 1,
      conditionText: 'if (nilai >= 90)',
      actionText: 'cout << "A";',
      outputGrade: 'A',
      predicate: (n: number) => n >= 90
    },
    {
      lineNum: 2,
      conditionText: 'else if (nilai >= 80)',
      actionText: 'cout << "B";',
      outputGrade: 'B',
      predicate: (n: number) => n >= 80
    },
    {
      lineNum: 3,
      conditionText: 'else if (nilai >= 70)',
      actionText: 'cout << "C";',
      outputGrade: 'C',
      predicate: (n: number) => n >= 70
    },
    {
      lineNum: 4,
      conditionText: 'else (lainnya)',
      actionText: 'cout << "D";',
      outputGrade: 'D',
      predicate: () => true
    }
  ],

  case6_1_predicts: [
    {
      id: 'soal-6-1-p95',
      title: 'Prediksi Cabang: nilai = 95',
      question: 'Jika nilai = 95, huruf apa yang akan tercetak ke layar?',
      actualOutput: 'A',
      explanation: 'Karena 95 >= 90 bernilai benar pada baris pertama, program mencetak "A" dan langsung melompati semua else if di bawahnya.'
    },
    {
      id: 'soal-6-1-p85',
      title: 'Prediksi Cabang: nilai = 85',
      question: 'Jika nilai = 85, huruf apa yang akan tercetak ke layar?',
      actualOutput: 'B',
      explanation: 'Kondisi pertama (>= 90) salah (dilewati). Kondisi kedua (>= 80) benar, sehingga program mencetak "B".'
    },
    {
      id: 'soal-6-1-p80',
      title: 'Prediksi Cabang: nilai = 80',
      question: 'Jika nilai = 80, huruf apa yang akan tercetak ke layar?',
      actualOutput: 'B',
      explanation: 'Karena menggunakan operator >= (lebih besar atau sama dengan), angka 80 tepat memenuhi syarat kedua (80 >= 80 = true).'
    },
    {
      id: 'soal-6-1-p70',
      title: 'Prediksi Cabang: nilai = 70',
      question: 'Jika nilai = 70, huruf apa yang akan tercetak ke layar?',
      actualOutput: 'C',
      explanation: 'Dua kondisi awal salah, lalu 70 >= 70 benar pada baris ketiga, mencetak "C".'
    },
    {
      id: 'soal-6-1-p69',
      title: 'Prediksi Cabang: nilai = 69',
      question: 'Jika nilai = 69, huruf apa yang akan tercetak ke layar?',
      actualOutput: 'D',
      explanation: 'Semua kondisi bertingkat bernilai salah, sehingga program masuk ke blok penampung terakhir (else) dan mencetak "D".'
    }
  ],

  case6_2_code: `if (nilai >= 70) cout << "C";
else if (nilai >= 80) cout << "B";
else if (nilai >= 90) cout << "A";
else cout << "D";`,

  case6_2_rules: [
    {
      lineNum: 1,
      conditionText: 'if (nilai >= 70)',
      actionText: 'cout << "C";',
      outputGrade: 'C',
      predicate: (n: number) => n >= 70
    },
    {
      lineNum: 2,
      conditionText: 'else if (nilai >= 80)',
      actionText: 'cout << "B";',
      outputGrade: 'B',
      predicate: (n: number) => n >= 80
    },
    {
      lineNum: 3,
      conditionText: 'else if (nilai >= 90)',
      actionText: 'cout << "A";',
      outputGrade: 'A',
      predicate: (n: number) => n >= 90
    },
    {
      lineNum: 4,
      conditionText: 'else (lainnya)',
      actionText: 'cout << "D";',
      outputGrade: 'D',
      predicate: () => true
    }
  ],

  case6_2_predict: {
    id: 'soal-6-2-predict',
    title: 'Perangkap Urutan Cabang: nilai = 95',
    question: 'Perhatikan kode yang urutannya dibalik di atas. Apa yang tercetak jika nilai = 95?',
    actualOutput: 'C',
    explanation: 'Kondisi diperiksa dari atas dan BERHENTI di kondisi pertama yang benar! Karena 95 >= 70 sudah benar di baris pertama, program mencetak "C" dan langsung keluar. Baris untuk predikat A (>= 90) tidak pernah diperiksa! Aturan emas: urutkan syarat percabangan bertingkat dari yang paling ketat ke yang paling longgar.'
  },

  case6_3_predicts: [
    {
      id: 'soal-6-3-2024',
      title: 'Uji Tahun 2024',
      question: 'Apakah tahun 2024 termasuk tahun kabisat atau bukan kabisat?',
      actualOutput: 'Kabisat',
      explanation: '2024 habis dibagi 4 (2024 % 4 == 0) dan bukan kelipatan 100.'
    },
    {
      id: 'soal-6-3-1900',
      title: 'Uji Tahun 1900',
      question: 'Apakah tahun 1900 termasuk tahun kabisat atau bukan kabisat?',
      actualOutput: 'Bukan kabisat',
      explanation: '1900 habis dibagi 4 DAN habis dibagi 100, tetapi TIDAK habis dibagi 400 (1900 / 400 bersisa 300). Maka 1900 BUKAN tahun kabisat.'
    },
    {
      id: 'soal-6-3-2000',
      title: 'Uji Tahun 2000',
      question: 'Apakah tahun 2000 termasuk tahun kabisat atau bukan kabisat?',
      actualOutput: 'Kabisat',
      explanation: 'Meskipun habis dibagi 100, tahun 2000 habis dibagi 400 (2000 % 400 == 0), sehingga tetap kabisat.'
    },
    {
      id: 'soal-6-3-2023',
      title: 'Uji Tahun 2023',
      question: 'Apakah tahun 2023 termasuk tahun kabisat atau bukan kabisat?',
      actualOutput: 'Bukan kabisat',
      explanation: '2023 ganjil dan tidak habis dibagi 4 (2023 % 4 = 3).'
    }
  ]
};
