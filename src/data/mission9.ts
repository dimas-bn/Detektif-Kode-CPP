import { TrueFalseData } from '../types';

export const mission9Data = {
  id: 9,
  title: 'Benar atau Salah, dan Buktikan',
  overview: 'Seorang detektif tidak boleh mudah percaya pada mitos. Uji pemahaman fondasimu melalui 7 pernyataan fundamental C++ berikut. Tuliskan alasanmu sebelum menekan tombol jawaban!',

  questions: [
    {
      id: 'soal-9-1',
      title: 'Pernyataan 1: Operator Penugasan vs Perbandingan',
      statement: 'Tanda sama dengan tunggal (=) dan tanda sama dengan ganda (==) memiliki fungsi yang sama di C++.',
      isTrue: false,
      explanation: 'Salah. Tanda = adalah operator penugasan (assignment) untuk mengisi nilai ke dalam variabel, sedangkan == adalah operator relasional untuk membandingkan apakah dua nilai sama.'
    },
    {
      id: 'soal-9-2',
      title: 'Pernyataan 2: Kepekaan Huruf Besar-Kecil (Case Sensitivity)',
      statement: 'Variabel bernama "Nama" dan "nama" dianggap sebagai variabel yang sama oleh compiler C++.',
      isTrue: false,
      explanation: 'Salah. Bahasa C++ bersifat case-sensitive (peka huruf besar dan kecil). Variabel Nama, nama, dan NAMA dianggap sebagai tiga kotak variabel yang sepenuhnya berbeda di memori.'
    },
    {
      id: 'soal-9-3',
      title: 'Pernyataan 3: Pembagian Bilangan Bulat',
      statement: 'Hasil perhitungan ekspresi 7 / 2 pada bilangan bulat di C++ adalah 3.5.',
      isTrue: false,
      explanation: 'Salah. Di C++, bilangan bulat dibagi bilangan bulat menghasilkan bilangan bulat yang dipotong ke arah nol (truncation), sehingga 7 / 2 menghasilkan 3. Untuk mendapatkan hasil 3.5, salah satu angka harus ditulis desimal, misalnya 7.0 / 2.'
    },
    {
      id: 'soal-9-4',
      title: 'Pernyataan 4: Titik Awal Eksekusi Program',
      statement: 'Setiap program C++ selalu mulai dieksekusi pertama kali dari fungsi main().',
      isTrue: true,
      explanation: 'Benar. Fungsi int main() adalah pintu masuk (entry point) resmi yang dicari oleh sistem operasi dan compiler untuk memulai eksekusi instruksi baris demi baris.'
    },
    {
      id: 'soal-9-5',
      title: 'Pernyataan 5: Penggunaan Tanda Titik Koma (;)',
      statement: 'Setiap baris kode di C++ harus diakhiri dengan tanda titik koma (;).',
      isTrue: false,
      explanation: 'Salah. Baris direktif preprocessor seperti #include <iostream>, kepala fungsi int main() {, kepala percabangan if (...) {, kepala perulangan for (...) {, serta kurung kurawal penutup } TIDAK memakai titik koma di ujungnya.'
    },
    {
      id: 'soal-9-6',
      title: 'Pernyataan 6: Deklarasi Variabel Sebelum Digunakan',
      statement: 'Setiap variabel harus dideklarasikan tipe dan namanya terlebih dahulu sebelum dapat digunakan dalam instruksi kode.',
      isTrue: true,
      explanation: 'Benar. C++ menganut sistem statically-typed. Compiler harus mengetahui nama dan tipe variabel agar dapat mengalokasikan ukuran memori yang tepat di RAM sebelum instruksi dijalankan.'
    },
    {
      id: 'soal-9-7',
      title: 'Pernyataan 7: Jumlah Iterasi Perulangan for',
      statement: 'Perulangan for (int i = 1; i <= 3; i++) akan menjalankan tubuh perulangannya tepat sebanyak 3 kali.',
      isTrue: true,
      explanation: 'Benar. Nilai i dimulai dari 1, berlanjut ke 2, lalu ke 3 (total 3 kali putaran). Ketika i bernilai 4, syarat i <= 3 bernilai false dan perulangan segera berakhir.'
    }
  ] as TrueFalseData[]
};
