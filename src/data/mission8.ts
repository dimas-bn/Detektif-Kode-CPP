export interface DiagnosticCase {
  id: string;
  title: string;
  code: string;
  errorCategory: 'sintaks' | 'logika';
  question: string;
  options: {
    id: string;
    label: string;
  }[];
  correctOptionId: string;
  explanation: string;
  fixedCode: string;
  contextNote?: string;
}

export const mission8Data = {
  id: 8,
  title: 'Pemburu Error',
  overview: 'Dalam dunia koding, ada dua jenis musuh utama detektif:\n1. Error Sintaks: Kesalahan tata bahasa C++ yang membuat program TIDAK BISA DIJALANKAN sama sekali (compiler langsung menolak).\n2. Error Logika: Program berjalan mulus tanpa protes apa pun dari compiler, tetapi HASILNYA SALAH! Jenis kedua ini jauh lebih licik karena tidak ada pesan peringatan.',

  cases: [
    {
      id: 'soal-8-a',
      title: 'Kasus A: Titik Koma yang Tertinggal',
      code: `int main() {
    cout << "Halo" << endl
    return 0;
}`,
      errorCategory: 'sintaks',
      question: 'Tentukan jenis kesalahan dan tindakan perbaikan yang tepat:',
      options: [
        { id: 'opt-a1', label: 'Tambahkan tanda titik koma (;) di akhir baris cout' },
        { id: 'opt-a2', label: 'Ganti endl dengan \\n tanpa tanda kutip' },
        { id: 'opt-a3', label: 'Ubah int main() menjadi void main()' }
      ],
      correctOptionId: 'opt-a1',
      explanation: 'Setiap instruksi pernyataan di C++ wajib ditutup dengan titik koma (;). Karena tidak ada titik koma, compiler menolak melakukan kompilasi. Ini adalah murni Error Sintaks.',
      fixedCode: `int main() {
    cout << "Halo" << endl;
    return 0;
}`,
      contextNote: 'Coba ketik baris ini di compiler online dan perhatikan pesan error penolakan compiler.'
    },
    {
      id: 'soal-8-b',
      title: 'Kasus B: Menjumpai Hantu Variabel Gaib',
      code: `int main() {
    int a = 5;
    cout << b;
    return 0;
}`,
      errorCategory: 'sintaks',
      question: 'Tentukan jenis kesalahan dan tindakan perbaikan yang tepat:',
      options: [
        { id: 'opt-b1', label: 'Ganti variabel b dengan a, atau deklarasikan variabel b sebelum dipakai' },
        { id: 'opt-b2', label: 'Ubah tipe variabel a menjadi string' },
        { id: 'opt-b3', label: 'Hapus baris int a = 5;' }
      ],
      correctOptionId: 'opt-b1',
      explanation: 'Variabel b belum pernah dideklarasikan sebelumnya di memori, sehingga compiler tidak tahu apa itu "b". Ini adalah Error Sintaks. Komputer hanya bisa membaca variabel yang sudah terdaftar di memori.',
      fixedCode: `int main() {
    int a = 5;
    cout << a; // Atau deklarasikan int b = ...
    return 0;
}`,
      contextNote: 'Compiler GCC biasanya mencatat: error: ‘b’ was not declared in this scope.'
    },
    {
      id: 'soal-8-c',
      title: 'Kasus C: Perangkap Tanda Petik Tunggal vs Ganda',
      code: `int main() {
    string nama = 'Dimas';
    cout << nama;
    return 0;
}`,
      errorCategory: 'sintaks',
      question: 'Tentukan jenis kesalahan dan tindakan perbaikan yang tepat:',
      options: [
        { id: 'opt-c1', label: 'Ganti tanda petik tunggal dengan tanda petik ganda: "Dimas"' },
        { id: 'opt-c2', label: 'Ubah tipe string menjadi char nama = \'Dimas\';' },
        { id: 'opt-c3', label: 'Tambahkan tanda pagar # di depan nama' }
      ],
      correctOptionId: 'opt-c1',
      explanation: 'Di C++, tanda petik tunggal (\'...\') HANYA boleh dipakai untuk satu huruf tunggal (tipe char, misal \'A\'). Untuk teks untaian kata (string), wajib memakai tanda petik ganda ("..."). Ini adalah Error Sintaks.',
      fixedCode: `int main() {
    string nama = "Dimas";
    cout << nama;
    return 0;
}`,
      contextNote: 'Ketik di compiler online untuk melihat bagaimana compiler memprotes multi-character character constant.'
    },
    {
      id: 'soal-8-d',
      title: 'Kasus D: Nilai Rapor yang Terpotong Misterius',
      code: `int a = 80, b = 85;
double rata = (a + b) / 2;
cout << rata;
// Keterangan kasus: Nilai rata-rata seharusnya 82.5, namun program mencetak 82!`,
      errorCategory: 'logika',
      question: 'Tentukan jenis kesalahan dan tindakan perbaikan yang tepat:',
      options: [
        { id: 'opt-d1', label: 'Ganti pembagi / 2 menjadi / 2.0 agar pembagian menghasilkan desimal utuh' },
        { id: 'opt-d2', label: 'Tambahkan titik koma kedua di akhir baris' },
        { id: 'opt-d3', label: 'Ubah variabel a dan b menjadi tipe char' }
      ],
      correctOptionId: 'opt-d1',
      explanation: 'Program ini berhasil dikompilasi tanpa satupun error dari compiler, namun hasilnya keliru (82 bukannya 82.5). Ini adalah Error Logika klasik! Karena a, b, dan 2 semuanya bilangan bulat, (165 / 2) dipotong menjadi 165 / 2 = 82 sebelum disimpan ke variabel rata. Solusinya: gunakan pembagi desimal 2.0.',
      fixedCode: `int a = 80, b = 85;
double rata = (a + b) / 2.0; // Menggunakan 2.0
cout << rata; // Sekarang mencetak 82.5 dengan tepat!`,
      contextNote: 'Error logika tidak memicu pesan compiler, tetapi bisa berakibat fatal pada keakuratan data.'
    }
  ] as DiagnosticCase[],

  reflection: {
    id: 'soal-8-reflection',
    title: 'Refleksi Detektif Kode',
    prompt: 'Menurutmu mana yang lebih sulit ditemukan dan diperbaiki: error sintaks atau error logika? Mengapa?',
    hint: 'Pikirkan peran compiler: compiler selalu memberitahu nomor baris saat ada error sintaks, tetapi compiler diam seribu bahasa saat ada error logika!'
  }
};
