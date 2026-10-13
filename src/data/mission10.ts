import { ProjectData } from '../components/ProjectWorkspace';

export const mission10Data = {
  id: 10,
  title: 'Misi Final: Proyek Mini Mandiri',
  overview: 'Selamat telah tiba di puncak investigasi! Sekarang saatnya kamu membuktikan kemampuanmu dengan merancang program utuh. Pilih SATU dari tiga proyek di bawah ini, rancang logikanya di editor, uji langsung di compiler online, lalu bandingkan dengan contoh solusi detektif.',

  projects: [
    {
      id: 'A',
      title: 'Proyek A: Kalkulator Mini Serbaguna',
      badge: 'Kalkulator',
      description: 'Buatlah program yang meminta dua buah bilangan dan satu karakter operator aritmatika (+, -, *, /). Program harus menampilkan hasil hitung yang akurat (termasuk pecahan desimal pada pembagian), serta mampu menangani kasus khusus pembagian dengan nol dan memberi peringatan jika operator tidak dikenali.',
      testCases: [
        {
          input: '8 dan 2 dengan operator +',
          expectedOutput: '10'
        },
        {
          input: '7 dan 2 dengan operator /',
          expectedOutput: '3.5 (harus desimal, bukan 3)'
        },
        {
          input: '5 dan 0 dengan operator /',
          expectedOutput: 'Tidak bisa dibagi nol'
        }
      ],
      sampleSolution: `#include <iostream>
using namespace std;

int main() {
    double a, b;
    char op;

    cout << "Bilangan 1: "; 
    cin >> a;
    cout << "Operator (+ - * /): "; 
    cin >> op;
    cout << "Bilangan 2: "; 
    cin >> b;

    if (op == '+') {
        cout << a + b << endl;
    } else if (op == '-') {
        cout << a - b << endl;
    } else if (op == '*') {
        cout << a * b << endl;
    } else if (op == '/') {
        if (b != 0) {
            cout << a / b << endl;
        } else {
            cout << "Tidak bisa dibagi nol" << endl;
        }
    } else {
        cout << "Operator tidak dikenal" << endl;
    }

    return 0;
}`
    },
    {
      id: 'B',
      title: 'Proyek B: Sistem Penilai Rapor Siswa',
      badge: 'Penilai Rapor',
      description: 'Buatlah program yang menerima tiga nilai ujian siswa, menghitung nilai rata-rata (harus bertipe desimal double), menentukan predikat huruf (A jika >= 90, B jika 80-89, C jika 70-79, atau D jika < 70), serta mencetak status kelulusan: "Tuntas" jika rata-rata >= 75 dan "Belum tuntas" jika di bawah 75.',
      testCases: [
        {
          input: '80 90 70',
          expectedOutput: 'Rata-rata: 80\nPredikat B\nTuntas'
        },
        {
          input: '60 70 65',
          expectedOutput: 'Rata-rata: 65\nPredikat D\nBelum tuntas'
        },
        {
          input: '90 95 100',
          expectedOutput: 'Rata-rata: 95\nPredikat A\nTuntas'
        }
      ],
      sampleSolution: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cout << "Masukkan 3 nilai: ";
    cin >> a >> b >> c;

    double rata = (a + b + c) / 3.0; // Menggunakan 3.0 agar hasil desimal
    cout << "Rata-rata: " << rata << endl;

    if (rata >= 90) cout << "Predikat A" << endl;
    else if (rata >= 80) cout << "Predikat B" << endl;
    else if (rata >= 70) cout << "Predikat C" << endl;
    else cout << "Predikat D" << endl;

    if (rata >= 75) cout << "Tuntas" << endl;
    else cout << "Belum tuntas" << endl;

    return 0;
}`
    },
    {
      id: 'C',
      title: 'Proyek C: Pencari Bilangan Genap & Akumulator',
      badge: 'Pencari Genap',
      description: 'Buatlah program yang meminta sebuah bilangan bulat positif n dari pengguna, lalu mencetak semua bilangan genap dari 1 hingga n secara berurutan, dan di baris berikutnya mencetak jumlah total dari seluruh bilangan genap tersebut.',
      testCases: [
        {
          input: 'n = 10',
          expectedOutput: '2 4 6 8 10 \nJumlah: 30'
        },
        {
          input: 'n = 7',
          expectedOutput: '2 4 6 \nJumlah: 12'
        },
        {
          input: 'n = 1',
          expectedOutput: '(tidak ada bilangan) \nJumlah: 0'
        }
      ],
      sampleSolution: `#include <iostream>
using namespace std;

int main() {
    int n, jumlah = 0;
    cout << "Masukkan n: ";
    cin >> n;

    for (int i = 1; i <= n; i++) {
        if (i % 2 == 0) {
            cout << i << " ";
            jumlah += i;
        }
    }
    cout << endl << "Jumlah: " << jumlah << endl;

    return 0;
}`
    }
  ] as ProjectData[],

  finalReflections: [
    {
      id: 'final-ref-1',
      title: 'Refleksi Akhir 1: Pergeseran Paradigma',
      prompt: 'Konsep mana yang pemahamanmu berubah setelah mencobanya sendiri, padahal sebelumnya kamu mengira sudah paham?',
      placeholder: 'Ceritakan konsep mana yang paling mengejutkanmu (misalnya pembagian integer, prioritas operator, atau urutan if-else)...'
    },
    {
      id: 'final-ref-2',
      title: 'Refleksi Akhir 2: Pelajaran dari Tebakan Meleset',
      prompt: 'Tebakan mana yang paling meleset dari hasil asli selama mengerjakan misi? Apa pelajaran penting yang kamu petik dari sana?',
      placeholder: 'Tebakan yang meleset itu wajar. Jelaskan apa yang terjadi dan bagaimana kamu menyadarinya...'
    },
    {
      id: 'final-ref-3',
      title: 'Refleksi Akhir 3: SOP Detektif Masa Depan',
      prompt: 'Tuliskan tiga kebiasaan yang akan kamu lakukan setiap kali kodemu mengalami error atau memberikan hasil yang aneh di masa depan.',
      placeholder: '1. Cek baris sebelum titik error...\n2. Gunakan cout untuk melacak nilai variabel...\n3. Pastikan tipe data...'
    }
  ]
};
