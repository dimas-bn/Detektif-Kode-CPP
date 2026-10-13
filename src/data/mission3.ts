import { PredictAnswerData } from '../types';

export const mission3Data = {
  id: 3,
  title: 'Laboratorium Tipe Data',
  overview: 'Tipe data menentukan jenis informasi yang boleh disimpan di dalam variabel dan aturan operasi matematikanya di level prosesor. C++ adalah bahasa statically-typed yang memiliki aturan konversi ketat.',
  
  predictCases: [
    {
      id: 'soal-3-1',
      title: 'Prediksi 1: Pembagian Dua Integer',
      question: 'Berapa angka yang akan tercetak ke layar saat baris kode ini dijalankan?',
      code: 'cout << 7 / 2;',
      actualOutput: '3',
      explanation: 'Bilangan bulat (7) dibagi bilangan bulat (2) menghasilkan bilangan bulat. Hasil aslinya 3.5 langsung dipotong (truncation) bagian pecahan desimalnya menjadi 3.'
    },
    {
      id: 'soal-3-2',
      title: 'Prediksi 2: Menyimpan Hasil Bagi ke Tipe double',
      question: 'Variabel y bertipe double (desimal). Berapa nilai y yang tercetak ke layar?',
      code: `double y = 7 / 2;
cout << y;`,
      actualOutput: '3',
      explanation: 'Perhitungan di sebelah kanan (7 / 2) dikerjakan LEBIH DULU oleh prosesor sebagai operasi integer division menghasilkan 3. Nilai 3 tersebut baru kemudian disimpan ke variabel double y sebagai 3 (atau 3.0).'
    },
    {
      id: 'soal-3-3',
      title: 'Prediksi 3: Salah Satu Operand Berupa Desimal (2.0)',
      question: 'Kali ini pembaginya ditulis 2.0 (bukan 2). Berapa nilai z yang tercetak ke layar?',
      code: `double z = 7 / 2.0;
cout << z;`,
      actualOutput: '3.5',
      explanation: 'Karena salah satu operand adalah desimal bertipe double (2.0), compiler C++ secara otomatis menaikkan derajat operand 7 menjadi double (type promotion), sehingga menghasilkan 3.5.'
    },
    {
      id: 'soal-3-4',
      title: 'Prediksi 4: Memasukkan Desimal ke Tipe int',
      question: 'Nilai desimal 3.99 disimpan ke variabel k bertipe int. Berapa nilai k yang tercetak?',
      code: `int k = 3.99;
cout << k;`,
      actualOutput: '3',
      explanation: 'Dalam C++, memasukkan desimal ke variabel integer TIDAK membulatkan ke atas (bukan 4), melainkan MEMOTONG habis semua angka di belakang koma (truncation ke arah nol), sehingga tersisa 3.'
    },
    {
      id: 'soal-3-5',
      title: 'Prediksi 5: Menambah Karakter Char dengan Operator ++',
      question: 'Variabel huruf c berisi karakter \'A\', lalu ditambah 1 dengan c++. Apa yang tercetak?',
      code: `char c = 'A';
c++;
cout << c;`,
      actualOutput: 'B',
      explanation: 'Karakter disimpan dalam komputer sebagai kode angka ASCII (kode huruf \'A\' adalah 65). Saat c++ dijalankan, kodenya bertambah menjadi 66, yang merupakan representasi kode untuk huruf \'B\'.'
    },
    {
      id: 'soal-3-6',
      title: 'Prediksi 6: Mencetak Variabel Boolean',
      question: 'Ekspresi (5 > 3) bernilai benar (true). Apa yang tercetak ke konsol saat variabel bool dicetak?',
      code: `bool b = (5 > 3);
cout << b;`,
      actualOutput: '1',
      explanation: 'Di C++, nilai boolean true secara standar tercetak ke layar sebagai angka 1, dan false tercetak sebagai angka 0.'
    }
  ] as PredictAnswerData[],

  midReflection: {
    id: 'soal-3-mid-reflection',
    title: 'Refleksi Tengah Kasus',
    prompt: 'Jelaskan dengan kata-katamu sendiri: Mengapa double y = 7 / 2; menghasilkan 3, bukan 3.5, padahal variabel penampungnya (y) sudah bertipe double?',
    hint: 'Ingat urutan kerja: komputer menghitung ekspresi di sisi kanan tanda sama dengan terlebih dahulu (7 / 2 = 3 integer) sebelum tahu kemana hasil itu akan disimpan!'
  },

  finalReflection: {
    id: 'soal-3-final-reflection',
    title: 'Kesimpulan Detektif Tipe Data',
    prompt: 'Tuliskan dua aturan penting tentang tipe data di C++ yang berhasil kamu temukan dari seluruh investigasi di laboratorium ini.',
    hint: 'Tiga aturan utama yang diharapkan:\n1. Bilangan bulat dibagi bilangan bulat menghasilkan bilangan bulat, dan tipe variabel penampung tidak mengubah proses hitung awalnya.\n2. Menyimpan desimal ke int memotong (truncate), bukan membulatkan.\n3. Salah satu operand harus desimal (misal 2.0 atau perkalian 1.0) agar hasil bagi menghasilkan desimal utuh.',
    hintButtonLabel: 'Lihat Aturan yang Diharapkan'
  }
};
