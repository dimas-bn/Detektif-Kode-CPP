import { MissionMeta } from '../types';

export const MISSIONS: MissionMeta[] = [
  {
    id: 1,
    title: 'Membedah Anatomi Program',
    subtitle: 'Struktur Dasar & Kompilasi',
    description: 'Menyelidiki bagian-bagian inti kode C++, peran include, main, cin, cout, serta konsekuensi saat ada bagian yang hilang.',
    badge: 'Anatomi',
    caseCount: 4,
    isAvailable: true
  },
  {
    id: 2,
    title: 'Jejak Memori',
    subtitle: 'Variabel & Perubahan Nilai',
    description: 'Menelusuri jalannya eksekusi program baris demi baris, perubahan nilai variabel di memori, dan teknik menukar dua nilai variabel.',
    badge: 'Memori',
    caseCount: 3,
    isAvailable: true
  },
  {
    id: 3,
    title: 'Laboratorium Tipe Data',
    subtitle: 'Integer, Double, Char & Bool',
    description: 'Bereksperimen dengan pembagian integer (truncation), konversi tipe, karakter ASCII, dan representasi nilai logika.',
    badge: 'Tipe Data',
    caseCount: 8,
    isAvailable: true
  },
  {
    id: 4,
    title: 'Input dan Output',
    subtitle: 'cin, getline & Format Data',
    description: 'Menganalisis urutan penulisan kode, perbedaan pembacaan spasi antara cin dan getline, serta dampak tipe data pada rumus konversi suhu.',
    badge: 'I/O',
    caseCount: 3,
    isAvailable: true
  },
  {
    id: 5,
    title: 'Operator dan Urutan Pengerjaan',
    subtitle: 'Precedence & Pemecah Digit',
    description: 'Membedah prioritas operator matematika & logika C++, compound assignment, dan rahasia memecah digit bilangan tiga angka.',
    badge: 'Operator',
    caseCount: 3,
    isAvailable: true
  },
  {
    id: 6,
    title: 'Peta Keputusan (Percabangan)',
    subtitle: 'if, else if, else & Tahun Kabisat',
    description: 'Menganalisis alur eksekusi percabangan bertingkat, jebakan urutan syarat longgar vs ketat, dan logika gabungan tahun kabisat.',
    badge: 'Cabang',
    caseCount: 3,
    isAvailable: true
  },
  {
    id: 7,
    title: 'Mesin Pengulang (Perulangan)',
    subtitle: 'for, while, Segitiga Bintang & Faktorial',
    description: 'Menelusuri perulangan for akumulator, pola visual segitiga bintang nested loop, perbaikan infinite loop, dan perhitungan faktorial.',
    badge: 'Loop',
    caseCount: 4,
    isAvailable: true
  },
  {
    id: 8,
    title: 'Pemburu Error',
    subtitle: 'Sintaks vs Logika',
    description: 'Mendiagnosa perbedaan mendasar antara error sintaks (yang ditolak compiler) dan error logika (yang menghasilkan jawaban keliru tanpa pesan error).',
    badge: 'Error Hunt',
    caseCount: 5,
    isAvailable: true
  },
  {
    id: 9,
    title: 'Benar atau Salah, dan Buktikan',
    subtitle: '7 Mitos vs Fakta C++',
    description: 'Menguji ketajaman fondasi logika C++ lewat tujuh pernyataan benar/salah, disertai pencatatan alasan pribadi siswa.',
    badge: 'Uji Logika',
    caseCount: 7,
    isAvailable: true
  },
  {
    id: 10,
    title: 'Misi Final: Proyek Mini Mandiri',
    subtitle: 'Kalkulator, Rapor, atau Pencari Genap',
    description: 'Menuntaskan satu dari tiga proyek koding mandiri, memverifikasi hasil uji di compiler online, dan melakukan refleksi akhir detektif.',
    badge: 'Proyek Final',
    caseCount: 4,
    isAvailable: true
  }
];
