import { TraceTableData, StepTracerData, ErrorHuntData } from '../types';

export const mission7Data = {
  id: 7,
  title: 'Mesin Pengulang (Perulangan)',
  overview: 'Komputer tidak pernah lelah melakukan tugas berulang-ulang miliaran kali dalam sedetik. Struktur loop (for dan while) mengendalikan berapa kali blok instruksi dieksekusi. Namun jika salah menetapkan kondisi henti, komputer akan terjebak dalam perulangan tanpa henti (infinite loop)!',

  case7_1_trace: {
    id: 'soal-7-1-trace',
    title: 'Penelusuran Loop Akumulator: Penjumlahan 1 sampai 5',
    code: `int jumlah = 0;
for (int i = 1; i <= 5; i++) {
    jumlah += i;
}
cout << jumlah;`,
    columns: ['i', 'jumlah'],
    rows: [
      { label: 'Putaran 1 (i = 1)', values: { i: '1', jumlah: '1' } },
      { label: 'Putaran 2 (i = 2)', values: { i: '2', jumlah: '3' } },
      { label: 'Putaran 3 (i = 3)', values: { i: '3', jumlah: '6' } },
      { label: 'Putaran 4 (i = 4)', values: { i: '4', jumlah: '10' } },
      { label: 'Putaran 5 (i = 5)', values: { i: '5', jumlah: '15' } }
    ],
    explanation: 'Pada setiap putaran, nilai i bertambah 1 dan diakumulasikan ke variabel jumlah. Putaran 1: 0+1=1. Putaran 2: 1+2=3. Putaran 3: 3+3=6. Putaran 4: 6+4=10. Putaran 5: 10+5=15. Ketika i bernilai 6, kondisi i <= 5 menjadi false dan loop berhenti. Output yang dicetak adalah 15.'
  } as TraceTableData,

  case7_1_steptracer: {
    id: 'soal-7-1-tracer',
    title: 'Step Tracer Akumulasi Penjumlahan',
    code: `int jumlah = 0;
for (int i = 1; i <= 5; i++) {
    jumlah += i;
}
cout << jumlah;`,
    steps: [
      {
        line: 1,
        explanation: 'Variabel penampung jumlah disiapkan dengan nilai awal 0.',
        variables: { jumlah: 0 },
        changedVars: ['jumlah'],
        output: ''
      },
      {
        line: 2,
        explanation: 'Loop dimulai: i = 1, cek 1 <= 5 (benar).',
        variables: { jumlah: 0, i: 1 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'jumlah += i -> 0 + 1 = 1.',
        variables: { jumlah: 1, i: 1 },
        changedVars: ['jumlah'],
        output: ''
      },
      {
        line: 2,
        explanation: 'i++ -> i = 2, cek 2 <= 5 (benar).',
        variables: { jumlah: 1, i: 2 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'jumlah += i -> 1 + 2 = 3.',
        variables: { jumlah: 3, i: 2 },
        changedVars: ['jumlah'],
        output: ''
      },
      {
        line: 2,
        explanation: 'i++ -> i = 3, cek 3 <= 5 (benar).',
        variables: { jumlah: 3, i: 3 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'jumlah += i -> 3 + 3 = 6.',
        variables: { jumlah: 6, i: 3 },
        changedVars: ['jumlah'],
        output: ''
      },
      {
        line: 2,
        explanation: 'i++ -> i = 4, cek 4 <= 5 (benar).',
        variables: { jumlah: 6, i: 4 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'jumlah += i -> 6 + 4 = 10.',
        variables: { jumlah: 10, i: 4 },
        changedVars: ['jumlah'],
        output: ''
      },
      {
        line: 2,
        explanation: 'i++ -> i = 5, cek 5 <= 5 (benar).',
        variables: { jumlah: 10, i: 5 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'jumlah += i -> 10 + 5 = 15.',
        variables: { jumlah: 15, i: 5 },
        changedVars: ['jumlah'],
        output: ''
      },
      {
        line: 2,
        explanation: 'i++ -> i = 6, cek 6 <= 5 (salah!). Loop selesai.',
        variables: { jumlah: 15, i: 6 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 5,
        explanation: 'cout mencetak nilai akhir jumlah ke layar.',
        variables: { jumlah: 15, i: 6 },
        changedVars: [],
        output: '15'
      }
    ]
  } as StepTracerData,

  case7_3_errorhunt: {
    id: 'soal-7-3-errorhunt',
    title: 'Misteri Perulangan Tanpa Henti (Infinite Loop)',
    code: `1  int i = 1;
2  while (i <= 5) {
3      cout << i << " ";
4  }`,
    correctErrorLine: 3,
    options: [
      { id: 'opt-a', label: 'Tambahkan i++; di dalam blok while' },
      { id: 'opt-b', label: 'Ubah kondisi i <= 5 menjadi i >= 5' },
      { id: 'opt-c', label: 'Hapus baris cout << i << " ";' }
    ],
    correctOptionId: 'opt-a',
    explanation: 'Variabel pencacah i selalu bernilai 1 karena nilainya tidak pernah dinaikkan di dalam tubuh perulangan. Akibatnya, kondisi (i <= 5) selalu bernilai benar (1 <= 5 selamanya), sehingga program terus-menerus mencetak angka 1 tanpa pernah berhenti. Solusinya: tambahkan perintah i++; di dalam while.',
    fixedCode: `int i = 1;
while (i <= 5) {
    cout << i << " ";
    i++; // Nilai i bertambah setiap putaran
}`
  } as ErrorHuntData,

  case7_4_steptracer: {
    id: 'soal-7-4-factorial',
    title: 'Step Tracer: Perhitungan Faktorial 5! (120)',
    code: `int n = 5, hasil = 1;
for (int i = 1; i <= n; i++) {
    hasil *= i;
}
cout << n << "! = " << hasil << endl;`,
    steps: [
      {
        line: 1,
        explanation: 'Variabel n diisi 5 dan hasil diisi 1 sebagai identitas perkalian.',
        variables: { n: 5, hasil: 1 },
        changedVars: ['n', 'hasil'],
        output: ''
      },
      {
        line: 2,
        explanation: 'Putaran 1: i = 1, cek 1 <= 5 (benar).',
        variables: { n: 5, hasil: 1, i: 1 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'hasil *= 1 -> hasil = 1 * 1 = 1.',
        variables: { n: 5, hasil: 1, i: 1 },
        changedVars: ['hasil'],
        output: ''
      },
      {
        line: 2,
        explanation: 'Putaran 2: i = 2, cek 2 <= 5 (benar).',
        variables: { n: 5, hasil: 1, i: 2 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'hasil *= 2 -> hasil = 1 * 2 = 2.',
        variables: { n: 5, hasil: 2, i: 2 },
        changedVars: ['hasil'],
        output: ''
      },
      {
        line: 2,
        explanation: 'Putaran 3: i = 3, cek 3 <= 5 (benar).',
        variables: { n: 5, hasil: 2, i: 3 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'hasil *= 3 -> hasil = 2 * 3 = 6.',
        variables: { n: 5, hasil: 6, i: 3 },
        changedVars: ['hasil'],
        output: ''
      },
      {
        line: 2,
        explanation: 'Putaran 4: i = 4, cek 4 <= 5 (benar).',
        variables: { n: 5, hasil: 6, i: 4 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'hasil *= 4 -> hasil = 6 * 4 = 24.',
        variables: { n: 5, hasil: 24, i: 4 },
        changedVars: ['hasil'],
        output: ''
      },
      {
        line: 2,
        explanation: 'Putaran 5: i = 5, cek 5 <= 5 (benar).',
        variables: { n: 5, hasil: 24, i: 5 },
        changedVars: ['i'],
        output: ''
      },
      {
        line: 3,
        explanation: 'hasil *= 5 -> hasil = 24 * 5 = 120.',
        variables: { n: 5, hasil: 120, i: 5 },
        changedVars: ['hasil'],
        output: ''
      },
      {
        line: 5,
        explanation: 'Cetak hasil perkalian faktorial ke layar.',
        variables: { n: 5, hasil: 120, i: 6 },
        changedVars: [],
        output: '5! = 120'
      }
    ]
  } as StepTracerData,

  case7_4_reflection: {
    id: 'soal-7-4-overflow-challenge',
    title: 'Tantangan Detektif: Integer Overflow pada Faktorial',
    prompt: 'Tipe data int 32-bit di C++ hanya mampu menampung bilangan hingga sekitar 2.147.483.647. Jika kita menghitung 13! (yang nilainya 6.227.020.800), apa yang kira-kira akan terjadi pada nilai variabel hasil? Mengapa angkanya bisa menjadi negatif?',
    hint: 'Fenomena ini disebut Integer Overflow. Saat angka melampaui batas maksimum memori bit positif, bit penanda tanda (sign bit) terbalik sehingga komputer menafsirkannya sebagai bilangan negatif aneh!'
  }
};
