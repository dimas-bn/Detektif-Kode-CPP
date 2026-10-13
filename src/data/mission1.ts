export const mission1Data = {
  id: 1,
  title: 'Membedah Anatomi Program',
  overview: 'Selamat datang di kasus investigasi pertama Anda, Detektif! Sebelum kita memburu bug yang rumit, kita harus mengenali susunan anatomi tubuh dari sebuah program C++ yang sehat.',
  mainCode: `#include <iostream>
using namespace std;

int main() {
    int panjang, lebar;
    cout << "Panjang: ";
    cin >> panjang;
    cout << "Lebar: ";
    cin >> lebar;
    int luas = panjang * lebar;
    cout << "Luas = " << luas << endl;
    return 0;
}`,
  case1_2: {
    id: 'soal-1-2',
    title: 'Eksperimen 1: Hapus Baris 1 (#include <iostream>)',
    question: 'Jika baris 1 (#include <iostream>) sengaja dihapus dari program, apa yang kira-kira akan terjadi saat program dikompilasi?',
    code: `// #include <iostream>  <-- BARIS 1 DIHAPUS
using namespace std;

int main() {
    int panjang = 10, lebar = 5;
    cout << panjang * lebar; // Apa yang dikatakan compiler?
    return 0;
}`,
    actualOutput: "Compiler menolak (Error: 'cout' was not declared in this scope)",
    explanation: "Tanpa #include <iostream>, compiler tidak tahu apa itu 'cout' dan 'cin'. Header iostream bagaikan buku kamus yang mengajarkan compiler cara berkomunikasi dengan keyboard dan layar.",
    contextNote: "Coba salin ke OnlineGDB atau compiler online dan buktikan pesan penolakannya!"
  },
  case1_3: {
    id: 'soal-1-3',
    title: 'Eksperimen 2: Hapus Titik Koma di Akhir Baris 10',
    question: 'Seorang programmer lupa menuliskan titik koma (;) pada baris 10 (int luas = panjang * lebar). Menurut prediksimu, di baris mana pesan error compiler akan menunjuk?',
    code: ` 9      cin >> lebar;
10      int luas = panjang * lebar   // lupa tanda titik koma (;)
11      cout << "Luas = " << luas << endl;
12      return 0;`,
    actualOutput: "Compiler menolak, dan pesan error biasanya menunjuk baris 11 (baris SESUDAHNYA)!",
    explanation: "Pelajarannya: Lokasi yang ditunjuk compiler tidak selalu merupakan lokasi kesalahan sebenarnya! Compiler membaca terus hingga baris 11 mencari penutup instruksi, baru ia menyadari ada titik koma yang hilang sebelum kata 'cout'. Maka selalu periksa satu baris di atas titik yang ditunjuk compiler.",
    contextNote: "Pesan khas compiler GCC: 'error: expected ';' before 'cout'' pada baris 11."
  },
  case1_4: {
    id: 'soal-1-4',
    title: 'Modifikasi Kasus: Penghitung Luas Segitiga',
    prompt: 'Ubah program ini menjadi penghitung luas segitiga (Rumus: alas * tinggi / 2). Apa yang harus kamu perhatikan agar hasil perhitungannya tidak terpotong atau hilang bagian desimalnya?',
    hint: 'Gunakan tipe data pecahan (double atau float) untuk variabel alas, tinggi, atau luas, dan pastikan membagi dengan angka desimal 2.0 (bukan 2 bulat). Jika membagi dengan integer 2, pecahan seperti 0.5 akan terpotong habis!',
    hintButtonLabel: 'Buka Petunjuk Detektif'
  }
};
