export interface MissionMeta {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  caseCount: number;
  isAvailable: boolean; // Misi 1-5 available, 6-10 pending part B
}

export type StorageKey = string;

export interface PredictAnswerData {
  id: string;
  title: string;
  question: string;
  code?: string;
  actualOutput: string;
  explanation: string;
  contextNote?: string;
}

export interface TraceTableStep {
  label: string; // e.g. "Setelah baris 1"
  values: Record<string, string>; // { a: "5", b: "", c: "" }
}

export interface TraceTableData {
  id: string;
  title: string;
  code: string;
  columns: string[]; // ["a", "b", "c"]
  rows: TraceTableStep[];
  explanation: string;
}

export interface StepTracerStep {
  line: number;
  explanation: string;
  variables: Record<string, string | number>;
  changedVars?: string[];
  output?: string;
}

export interface StepTracerData {
  id: string;
  title: string;
  code: string;
  steps: StepTracerStep[];
}

export interface LineOrderItem {
  id: string;
  text: string;
  isDistractor?: boolean; // Pengecoh yang harus disisihkan
}

export interface LineOrderData {
  id: string;
  title: string;
  instructions: string;
  items: LineOrderItem[];
  validSequences: string[][]; // array of item id sequences
  explanation: string;
}

export interface ErrorHuntOption {
  id: string;
  label: string;
}

export interface ErrorHuntData {
  id: string;
  title: string;
  code: string;
  correctErrorLine: number;
  options: ErrorHuntOption[];
  correctOptionId: string;
  explanation: string;
  fixedCode: string;
}

export interface TrueFalseData {
  id: string;
  title: string;
  statement: string;
  code?: string;
  isTrue: boolean;
  explanation: string;
}

export interface NotebookEntry {
  type: 'prediction' | 'reflection' | 'note';
  missionId: number;
  caseId: string;
  title: string;
  userGuess?: string;
  actualValue?: string;
  matchStatus?: 'same' | 'missed';
  userText?: string;
  timestamp: number;
}
