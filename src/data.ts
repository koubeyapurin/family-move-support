export type ScenarioId = 'A' | 'B' | 'C';
export type View = 'dashboard' | 'check' | 'scenarios' | 'plan' | 'tasks';
export type PriorityKey =
  'liveTogether' | 'spouseCareer' | 'childStability' | 'costSensitivity' | 'moveSpeed';
export type Priorities = Record<PriorityKey, number>;
export interface Conditions {
  spouseTransfer: 'unknown' | 'possible' | 'unavailable';
  remoteWork: 'unavailable' | 'partial' | 'full';
  childcareAvailability: 'unknown' | 'low' | 'medium' | 'high';
  caregiving: boolean;
  ownedHome: boolean;
  housing: 'unknown' | 'researching' | 'decided';
  reunion: 'unknown' | 'discussing' | 'decided';
}
export interface Family {
  destination: string;
  transferDate: string;
  currentLocation: string;
  count: number;
  employment: string;
  continueWorking: string;
  childAge: number;
  childcare: string;
}
export interface Task {
  id: number;
  title: string;
  owner: string;
  due: string;
  status: 'todo' | 'in_progress' | 'done';
  category: string;
}
export interface HistoryEntry {
  version: number;
  date: string;
  from: ScenarioId;
  to: ScenarioId;
  reason: string;
}
export interface DemoState {
  family: Family;
  conditions: Conditions;
  priorities: Priorities;
  tasks: Task[];
  planVersion: number;
  recommendedScenarioId: ScenarioId;
  history: HistoryEntry[];
  complete: boolean;
  agreed: boolean;
  sharing: { progress: boolean; schedule: boolean; family: boolean };
}
export const priorityLabels: Record<PriorityKey, string> = {
  liveTogether: '家族みんなで暮らす',
  spouseCareer: '妻が仕事を続ける',
  childStability: '子どもの生活を安定させる',
  costSensitivity: '費用を抑える',
  moveSpeed: 'できるだけ早く転居を完了する',
};
export const scenarioData = {
  A: {
    short: '家族全員で早期転居',
    title: '家族全員で、\n新しい暮らしを一緒に。',
    description: '家族全員で早期に西宮へ転居',
    reason: '家族の早期同居を大切にしながら、新しい地域での生活を一緒に始められるためです。',
    benefits: [
      '家族が離れて暮らす期間を最小限に',
      '仕事と保育の条件を整えて、一緒に転居',
      '新しい地域での生活を家族でスタート',
    ],
    risk: '転居までに勤務先の調整と保育園の受入確認が必要です。',
    burden: '転居前に手続きが集中',
    cost: '一度の転居・住居費',
    timing: '着任に合わせて家族で転居',
  },
  B: {
    short: '夫先行 → 後日合流',
    title: '夫が先に大阪へ。\n妻子は、準備が整ってから。',
    description: '夫が先に大阪へ着任し、妻子は条件が整い次第合流',
    reason: '着任期限を守りながら、妻の仕事と子どもの生活を急激に変えずに済むためです。',
    benefits: [
      '夫の着任期限をしっかり守れる',
      '妻の仕事を続けるための確認時間が取れる',
      '子どもの保育環境を、焦らず選べる',
    ],
    risk: '一時的な二重生活の費用と、合流までの育児負担に配慮が必要です。',
    burden: '一時的な別居・育児負担',
    cost: '一時的な二重生活費',
    timing: '夫が先行着任、条件が整い次第合流',
  },
  C: {
    short: '一定期間の単身赴任',
    title: '今の暮らしを大切に。\n一定期間は単身赴任。',
    description: '妻子の生活を維持し、夫は一定期間の単身赴任',
    reason: '妻の仕事と子どもの現在の生活を、最も維持しやすいためです。',
    benefits: [
      '妻の現在のキャリアを継続できる',
      '子どもの保育園と生活環境を維持',
      '家族の合流時期をじっくり検討できる',
    ],
    risk: '離れて暮らす期間が長くなるため、定期的な帰省と家族の話し合いが必要です。',
    burden: '長期的な別居・帰省負担',
    cost: '継続的な二重生活費・帰省費',
    timing: '夫が着任、家族は現在の住まいを継続',
  },
};
export const initialTasks: Task[] = [
  {
    id: 1,
    title: '妻の勤務先に関西異動可否を確認',
    owner: '妻',
    due: '10/12',
    status: 'in_progress',
    category: '仕事',
  },
  {
    id: 2,
    title: '西宮周辺の住居候補を比較',
    owner: 'JTBコンシェルジュ',
    due: '10/13',
    status: 'in_progress',
    category: '住まい',
  },
  {
    id: 3,
    title: '保育園の申請条件を整理',
    owner: 'JTBコンシェルジュ',
    due: '10/14',
    status: 'todo',
    category: '保育',
  },
  {
    id: 4,
    title: '夫の一時住居候補を確認',
    owner: 'JTBコンシェルジュ',
    due: '10/15',
    status: 'todo',
    category: '住まい',
  },
  {
    id: 5,
    title: '次回家族面談',
    owner: 'ご家族＋JTB',
    due: '10/16',
    status: 'todo',
    category: '家族合意',
  },
];
export function createInitialState(): DemoState {
  return {
    family: {
      destination: '大阪・梅田',
      transferDate: '2026-10-26',
      currentLocation: '東京都',
      count: 3,
      employment: '正社員',
      continueWorking: '強い',
      childAge: 3,
      childcare: '認可保育園',
    },
    conditions: {
      spouseTransfer: 'unknown',
      remoteWork: 'unavailable',
      childcareAvailability: 'unknown',
      caregiving: false,
      ownedHome: false,
      housing: 'unknown',
      reunion: 'unknown',
    },
    priorities: {
      liveTogether: 5,
      spouseCareer: 5,
      childStability: 5,
      costSensitivity: 3,
      moveSpeed: 3,
    },
    tasks: initialTasks.map((task) => ({ ...task })),
    planVersion: 1,
    recommendedScenarioId: 'B',
    history: [
      {
        version: 1,
        date: '2026/10/08',
        from: 'B',
        to: 'B',
        reason: '初回面談をもとに、ご家族の生活移行プランを作成しました。',
      },
    ],
    complete: false,
    agreed: false,
    sharing: { progress: true, schedule: true, family: false },
  };
}
