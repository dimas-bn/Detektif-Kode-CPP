import { PredictAnswerData, TraceTableData, StepTracerData } from '../types';

export const mission5Data = {
  id: 5,
  title: 'Operator dan Urutan Pengerjaan',
  overview: 'Di dunia C++, operator tidak dikerjakan begitu saja secara acak. Ada hierarki kasta (operator precedence) dan arah pengerjaan (associativity). Menguasai modulo (%) dan integer division (/) adalah kunci memecahkan teka-teki bilangan.',

  case5_1_predicts: [
    {
      id: 'soal-5-1-1',
      title: 'Kasus 5.1-A: Perkalian vs Penjumlahan',
      question: 'Berapa hasil evaluasi dari ekspresi: 2 + 3 * 4 ?',
      code: 'cout << 2 + 3 * 4;',
      actualOutput: '14',
      explanation: 'Operator perkalian (*) memiliki prioritas lebih tinggi daripada penjumlahan (+). 3 * 4 = 12 dikerjakan lebih dulu, kemudian 2 + 12 = 14.'
    },
    {
      id: 'soal-5-1-2',
      title: 'Kasus 5.1-B: Pengaruh Tanda Kurung',
      question: 'Berapa hasil evaluasi dari ekspresi dengan kurung: (2 + 3) * 4 ?',
      code: 'cout << (2 + 3) * 4;',
      actualOutput: '20',
      explanation: 'Tanda kurung (parentheses) memiliki prioritas kasta tertinggi mutlak di C++. Operasi (2 + 3) = 5 dipaksa selesai lebih dulu, baru dikalikan 4 = 20.'
    },
    {
      id: 'soal-5-1-3',
      title: 'Kasus 5.1-C: Kombinasi Modulo dan Pembagian',
      question: 'Berapa hasil dari ekspresi: 17 % 5 + 17 / 5 ?',
      code: 'cout << 17 % 5 + 17 / 5;',
      actualOutput: '5',
      explanation: 'Operator % dan / memiliki kasta sejajar dan lebih tinggi dari +. 17 % 5 menghasilkan 2 (sisa bagi), dan 17 / 5 menghasilkan 3 (hasil bagi integer). Penjumlahan akhirnya: 2 + 3 = 5.'
    },
    {
      id: 'soal-5-1-4',
      title: 'Kasus 5.1-D: Asosiatif Kiri ke Kanan',
      question: 'Berapa hasil dari ekspresi berurutan: 10 - 4 - 3 ?',
      code: 'cout << 10 - 4 - 3;',
      actualOutput: '3',
      explanation: 'Operator pengurangan bersifat left-to-right associative. Dikerjakan dari kiri: (10 - 4) = 6, lalu 6 - 3 = 3 (bukan 10 - (4 - 3) yang menghasilkan 9).'
    },
    {
      id: 'soal-5-1-5',
      title: 'Kasus 5.1-E: Evaluasi Rantai Logika (&& dan ||)',
      question: 'Berapa hasil evaluasi boolean: 5 > 3 && 2 > 4 || 1 < 2 ?',
      code: 'cout << (5 > 3 && 2 > 4 || 1 < 2);',
      actualOutput: '1 (true)',
      explanation: 'Operator perbandingan dikerjakan dulu: 5>3 (1), 2>4 (0), 1<2 (1). Lalu && lebih kuat dari ||: (1 && 0) menghasilkan 0. Terakhir (0 || 1) menghasilkan 1 (true).'
    },
    {
      id: 'soal-5-1-6',
      title: 'Kasus 5.1-F: Operator Negasi Not (!)',
      question: 'Berapa hasil dari ekspresi ingkar logika: !(7 % 2 == 1) ?',
      code: 'cout << !(7 % 2 == 1);',
      actualOutput: '0 (false)',
      explanation: '7 % 2 adalah 1. Perbandingan (1 == 1) bernilai true (1). Tanda negasi ! membalikkan nilai true menjadi false (0).'
    }
  ] as PredictAnswerData[],

  case5_2_trace: {
    id: 'soal-5-2-trace',
    title: 'Trace Table: Compound Assignment pada x',
    code: `int x = 10;
x += 5;
x -= 3;
x *= 2;
x++;
cout << x;`,
    columns: ['x'],
    rows: [
      { label: 'Setelah baris 1 (int x = 10;)', values: { x: '10' } },
      { label: 'Setelah baris 2 (x += 5;)', values: { x: '15' } },
      { label: 'Setelah baris 3 (x -= 3;)', values: { x: '12' } },
      { label: 'Setelah baris 4 (x *= 2;)', values: { x: '24' } },
      { label: 'Setelah baris 5 (x++;)', values: { x: '25' } }
    ],
    explanation: 'Operator gabungan (compound assignment) mempersingkat operasi aritmatika terhadap variabel itu sendiri. x += 5 berarti x = x + 5 (15). x -= 3 menjadi 12. x *= 2 menjadi 24. x++ menambah 1 menjadi 25. Nilai akhir x yang tercetak adalah 25.'
  } as TraceTableData,

  case5_2_steptracer: {
    id: 'soal-5-2-steptracer',
    title: 'Visualisasi Step Tracer Operasi Akumulasi',
    code: `int x = 10;
x += 5;
x -= 3;
x *= 2;
x++;
cout << x;`,
    steps: [
      {
        line: 1,
        explanation: 'x dideklarasikan dan diberi nilai awal 10.',
        variables: { x: 10 },
        changedVars: ['x'],
        output: ''
      },
      {
        line: 2,
        explanation: 'x += 5 ekuivalen dengan x = x + 5. Nilai x sekarang menjadi 15.',
        variables: { x: 15 },
        changedVars: ['x'],
        output: ''
      },
      {
        line: 3,
        explanation: 'x -= 3 ekuivalen dengan x = x - 3. Nilai x sekarang menjadi 12.',
        variables: { x: 12 },
        changedVars: ['x'],
        output: ''
      },
      {
        line: 4,
        explanation: 'x *= 2 ekuivalen dengan x = x * 2. Nilai x sekarang berlipat menjadi 24.',
        variables: { x: 24 },
        changedVars: ['x'],
        output: ''
      },
      {
        line: 5,
        explanation: 'Operator inkremen x++ menambahkan nilai x sebesar 1 menjadi 25.',
        variables: { x: 25 },
        changedVars: ['x'],
        output: ''
      },
      {
        line: 6,
        explanation: 'Perintah cout mencetak nilai 25 ke terminal.',
        variables: { x: 25 },
        changedVars: [],
        output: '25'
      }
    ]
  } as StepTracerData
};
