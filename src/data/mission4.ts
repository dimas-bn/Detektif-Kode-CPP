import { LineOrderData } from '../types';

export const mission4Data = {
  id: 4,
  title: 'Input dan Output',
  overview: 'Program komputer berkomunikasi dengan dunia luar melalui aliran input (cin) dan aliran output (cout). Namun ada perangkap tersembunyi seperti penanganan spasi dan dampak tipe data pada rumus matematika.',

  case4_1_order: {
    id: 'soal-4-1-order',
    title: 'Kasus 4.1: Menyusun Program Penjumlahan Dua Bilangan',
    instructions: 'Susunlah baris-baris acak di bawah ini menjadi program C++ yang meminta dua angka dari pengguna dan menampilkan hasil penjumlahannya.',
    items: [
      { id: 'A', text: 'cout << "Jumlah: " << a + b << endl;' },
      { id: 'B', text: 'int a, b;' },
      { id: 'C', text: 'cin >> a >> b;' },
      { id: 'D', text: '#include <iostream>' },
      { id: 'E', text: 'int main() {' },
      { id: 'F', text: 'using namespace std;' },
      { id: 'G', text: 'return 0;' },
      { id: 'H', text: '}' },
      { id: 'I', text: 'cout << "Masukkan dua bilangan: ";' }
    ],
    // D F E B I C A G H  atau  D F E I B C A G H
    validSequences: [
      ['D', 'F', 'E', 'B', 'I', 'C', 'A', 'G', 'H'],
      ['D', 'F', 'E', 'I', 'B', 'C', 'A', 'G', 'H']
    ],
    explanation: 'Urutan yang valid dimulai dengan pustaka iostream (D), namespace (F), dan fungsi main (E). Perhatikan bahwa baris deklarasi int a, b (B) dan cout prompt (I) boleh bertukar posisi karena keduanya belum saling bergantung, asalkan keduanya ditulis SEBELUM perintah input cin >> a >> b (C). Program ditutup dengan return 0 (G) dan kurung kurawal tutup (H).'
  } as LineOrderData,

  case4_2_predict: {
    id: 'soal-4-2-predict',
    title: 'Prediksi: Input Teks Bernama dengan Spasi pada cin',
    question: 'Jika program di bawah dijalankan dan pengguna mengetikkan nama lengkap "Budi Santoso", apa tepatnya teks output yang akan dicetak oleh perintah cout?',
    code: `string nama;
cout << "Nama: ";
cin >> nama;
cout << "Halo, " << nama << endl;`,
    actualOutput: 'Halo, Budi',
    explanation: 'Operator ekstraksi (>>) pada cin memperlakukan spasi, tab, dan baris baru sebagai pemisah (delimiter). Oleh karena itu, cin hanya menyedot teks sampai sebelum spasi pertama ("Budi"), sedangkan kata "Santoso" masih tertinggal di buffer input!',
    contextNote: 'Coba verifikasi sendiri lewat simulasi interaktif di bawah ini.'
  },

  case4_3_reflection: {
    id: 'soal-4-3-reflection',
    title: 'Refleksi Detektif Kasus Suhu',
    prompt: 'Mengapa hasil perhitungan suhu Celsius 37 ke Fahrenheit berbeda antara int (98°F) dan double (98.6°F), padahal kedua rumus terlihat sama?',
    hint: 'Perhatikan langkah pembagian: pada int, 37 * 9 menghasilkan 333, lalu 333 / 5 menghasilkan 66 (angka 0.6 terpotong habis). 66 + 32 = 98. Sedangkan pada double, 333 / 5.0 menghasilkan 66.6, sehingga 66.6 + 32 = 98.6!'
  }
};
