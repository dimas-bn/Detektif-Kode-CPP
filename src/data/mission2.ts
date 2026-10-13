import { TraceTableData, StepTracerData, LineOrderData } from '../types';

export const mission2Data = {
  id: 2,
  title: 'Jejak Memori',
  overview: 'Variabel adalah kotak bernama di memori RAM yang nilainya bisa diganti kapan saja. Komputer mengeksekusi instruksi secara sekuensial (satu per satu dari baris atas ke bawah). Nilai lama akan tertimpa selamanya jika diganti nilai baru.',
  codeSnippet: `int a = 5;
int b = 3;
int c = a + b;
a = c * 2;
b = a - b;
a += 1;
cout << a << " " << b << " " << c;`,

  case2_1_table: {
    id: 'soal-2-1-table',
    title: 'Penelusuran Jejak Variabel (a, b, c)',
    code: `1  int a = 5;
2  int b = 3;
3  int c = a + b;
4  a = c * 2;
5  b = a - b;
6  a += 1;
7  cout << a << " " << b << " " << c;`,
    columns: ['a', 'b', 'c'],
    rows: [
      { label: 'Setelah baris 1', values: { a: '5', b: '', c: '' } },
      { label: 'Setelah baris 2', values: { a: '5', b: '3', c: '' } },
      { label: 'Setelah baris 3', values: { a: '5', b: '3', c: '8' } },
      { label: 'Setelah baris 4', values: { a: '16', b: '3', c: '8' } },
      { label: 'Setelah baris 5', values: { a: '16', b: '13', c: '8' } },
      { label: 'Setelah baris 6', values: { a: '17', b: '13', c: '8' } }
    ],
    explanation: 'Pada baris 4, a berubah menjadi 16 (8 * 2). Pada baris 5, nilai a yang dipakai adalah 16 yang baru, sehingga b menjadi 16 - 3 = 13. Terakhir pada baris 6, a ditambah 1 menjadi 17. Output akhir cout mencetak 17 13 8.'
  } as TraceTableData,

  case2_1_steptracer: {
    id: 'soal-2-1-tracer',
    title: 'Visualisasi Step Tracer Alur RAM',
    code: `int a = 5;
int b = 3;
int c = a + b;
a = c * 2;
b = a - b;
a += 1;
cout << a << " " << b << " " << c;`,
    steps: [
      {
        line: 1,
        explanation: 'Deklarasi a dan isi awal 5 dialokasikan ke memori.',
        variables: { a: 5 },
        changedVars: ['a'],
        output: ''
      },
      {
        line: 2,
        explanation: 'Deklarasi b dan isi awal 3 dialokasikan.',
        variables: { a: 5, b: 3 },
        changedVars: ['b'],
        output: ''
      },
      {
        line: 3,
        explanation: 'c diisi a + b = 5 + 3 = 8.',
        variables: { a: 5, b: 3, c: 8 },
        changedVars: ['c'],
        output: ''
      },
      {
        line: 4,
        explanation: 'Nilai a ditimpa dengan c * 2 = 8 * 2 = 16. Nilai 5 sebelumnya hilang!',
        variables: { a: 16, b: 3, c: 8 },
        changedVars: ['a'],
        output: ''
      },
      {
        line: 5,
        explanation: 'Nilai b ditimpa dengan a - b = 16 - 3 = 13.',
        variables: { a: 16, b: 13, c: 8 },
        changedVars: ['b'],
        output: ''
      },
      {
        line: 6,
        explanation: 'Operator a += 1 menambah nilai a saat ini menjadi 17.',
        variables: { a: 17, b: 13, c: 8 },
        changedVars: ['a'],
        output: ''
      },
      {
        line: 7,
        explanation: 'Mencetak a, spasi, b, spasi, dan c ke layar konsol.',
        variables: { a: 17, b: 13, c: 8 },
        changedVars: [],
        output: '17 13 8'
      }
    ]
  } as StepTracerData,

  case2_2: {
    id: 'soal-2-2',
    title: 'Misteri Penukaran Nilai yang Gagal',
    question: 'Variabel awal: a = 10 dan b = 20. Seorang teman berniat menukar isinya dengan menulis: a = b; lalu b = a; Berapa nilai a dan b sesudah kedua baris itu selesai dieksekusi?',
    code: `int a = 10;
int b = 20;

// Niatnya ingin menukar isi a dan b:
a = b;
b = a;

cout << "a = " << a << ", b = " << b;`,
    actualOutput: 'a = 20, b = 20',
    explanation: 'Isi variabel a tertimpa oleh isi b (menjadi 20) sebelum sempat disimpan di tempat penampungan! Saat baris b = a dijalankan, nilai a sudah bernilai 20, sehingga b tetap 20. Nilai 10 asli milik a lenyap selamanya.',
    contextNote: 'Inilah alasan mengapa penukaran variabel memerlukan gelas/variabel bantuan sementara!'
  },

  case2_3_order: {
    id: 'soal-2-3-order',
    title: 'Menyusun Logika Penukaran Variabel (Swap)',
    instructions: 'Susunlah baris-baris instruksi di bawah ini agar benar-benar sukses menukar isi variabel a dan b (dari a=10, b=20 menjadi a=20, b=10). Perhatian: Singkirkan baris pengecoh yang tidak dibutuhkan!',
    items: [
      { id: 'step-1', text: 'int bantu = a;' },
      { id: 'step-2', text: 'a = b;' },
      { id: 'step-3', text: 'b = bantu;' },
      { id: 'fake-1', text: 'bantu = bantu + 1;', isDistractor: true },
      { id: 'fake-2', text: 'a = a;', isDistractor: true }
    ],
    validSequences: [
      ['step-1', 'step-2', 'step-3']
    ],
    explanation: 'Algoritma penukaran 3 langkah klasik: (1) Simpan isi a ke variabel sementara bantu; (2) Timpa isi a dengan b; (3) Ambil kembali isi asli a dari bantu dan masukkan ke b. Baris pengecoh seperti bantu = bantu + 1 dan a = a tidak memiliki fungsi dan harus disingkirkan.'
  } as LineOrderData
};
