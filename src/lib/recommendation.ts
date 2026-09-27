import {
  priorityLabels,
  type Conditions,
  type Priorities,
  type ScenarioId,
  type DemoState,
} from '../data';

const baseScores: Record<ScenarioId, Priorities> = {
  A: { liveTogether: 5, spouseCareer: 3, childStability: 3, costSensitivity: 3, moveSpeed: 3 },
  B: { liveTogether: 3, spouseCareer: 4, childStability: 5, costSensitivity: 2, moveSpeed: 5 },
  C: { liveTogether: 1, spouseCareer: 5, childStability: 5, costSensitivity: 3, moveSpeed: 5 },
};
export function calculateRecommendation(conditions: Conditions, priorities: Priorities) {
  const ratings = structuredClone(baseScores);
  if (conditions.spouseTransfer === 'possible') {
    ratings.A.spouseCareer += 1.5;
    ratings.A.moveSpeed += 1;
  }
  if (conditions.spouseTransfer === 'unavailable') ratings.A.spouseCareer -= 2;
  if (conditions.remoteWork === 'full') ratings.A.spouseCareer += 1;
  if (conditions.childcareAvailability === 'high') ratings.A.childStability += 1.5;
  if (conditions.childcareAvailability === 'low') ratings.A.childStability -= 1.5;
  const keys = Object.keys(priorityLabels) as (keyof Priorities)[];
  const ids: ScenarioId[] = ['A', 'B', 'C'];
  const scores = {} as Record<ScenarioId, number>;
  for (const id of ids) {
    for (const key of keys) ratings[id][key] = Math.min(5, Math.max(1, ratings[id][key]));
    const weighted = keys.reduce((sum, key) => sum + ratings[id][key] * priorities[key], 0);
    const max = 5 * keys.reduce((sum, key) => sum + priorities[key], 0);
    scores[id] = Math.round((weighted / max) * 100);
  }
  const recommended = ids.reduce((best, id) => (scores[id] > scores[best] ? id : best), 'B');
  return { scores, ratings, recommended };
}
export function getProgress(state: DemoState) {
  return state.complete
    ? 100
    : Math.min(90, 46 + state.tasks.filter((t) => t.status === 'done').length * 8);
}
export function getUncertainties(conditions: Conditions) {
  return [
    {
      label: '妻の関西異動',
      value: { unknown: '確認中', possible: '異動可能', unavailable: '異動不可' }[
        conditions.spouseTransfer
      ],
      resolved: conditions.spouseTransfer !== 'unknown',
    },
    {
      label: '保育園の受入',
      value: { unknown: '情報収集中', low: '見込み：低', medium: '見込み：中', high: '見込み：高' }[
        conditions.childcareAvailability
      ],
      resolved: conditions.childcareAvailability === 'high',
    },
    {
      label: '新しい住まい',
      value: { unknown: '候補検討前', researching: '候補を比較中', decided: '決定済み' }[
        conditions.housing
      ],
      resolved: conditions.housing === 'decided',
    },
    {
      label: '家族の合流時期',
      value: { unknown: '未定', discussing: '家族で相談中', decided: '決定済み' }[
        conditions.reunion
      ],
      resolved: conditions.reunion === 'decided',
    },
  ];
}
export function changeReason(
  before: Conditions,
  after: Conditions,
  from: ScenarioId,
  to: ScenarioId,
) {
  const changes: string[] = [];
  if (before.spouseTransfer !== after.spouseTransfer)
    changes.push(
      `妻の関西異動が「${{ unknown: '確認中', possible: '可能', unavailable: '不可' }[after.spouseTransfer]}」`,
    );
  if (before.childcareAvailability !== after.childcareAvailability)
    changes.push(
      `保育園受入見込みが「${{ unknown: '不明', low: '低', medium: '中', high: '高' }[after.childcareAvailability]}」`,
    );
  if (before.remoteWork !== after.remoteWork)
    changes.push(
      `リモート勤務が「${{ unavailable: '不可', partial: '一部可能', full: '完全可能' }[after.remoteWork]}」`,
    );
  return `${changes.length ? changes.join('、') + 'になりました。' : 'ご家族の希望と最新の条件を反映しました。'}${from !== to ? `推奨を${from}案から${to}案へ更新しました。` : `${to}案が引き続き、ご家族に合った選択肢です。`}`;
}
