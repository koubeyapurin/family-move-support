import { createInitialState, type DemoState } from '../data';
import { calculateRecommendation } from './recommendation';

export const STORAGE_KEY = 'family-move-support-demo-v1';
export function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const value: unknown = JSON.parse(raw);
    if (!isValidState(value)) return createInitialState();
    return {
      ...value,
      recommendedScenarioId: calculateRecommendation(value.conditions, value.priorities)
        .recommended,
    };
  } catch {
    return createInitialState();
  }
}
function isValidState(value: unknown): value is DemoState {
  if (!value || typeof value !== 'object') return false;
  const state = value as DemoState;
  const initial = createInitialState();
  if (!state.family || !state.conditions || !state.priorities || !state.sharing) return false;
  if (
    !Object.entries(initial.family).every(
      ([key, val]) => typeof state.family[key as keyof typeof state.family] === typeof val,
    )
  )
    return false;
  if (
    !Object.values(state.priorities).every((v) => Number.isInteger(v) && v >= 1 && v <= 5) ||
    Object.keys(state.priorities).length !== 5
  )
    return false;
  if (!Object.keys(initial.priorities).every((key) => key in state.priorities)) return false;
  const c = state.conditions;
  if (
    !['unknown', 'possible', 'unavailable'].includes(c.spouseTransfer) ||
    !['unavailable', 'partial', 'full'].includes(c.remoteWork) ||
    !['unknown', 'low', 'medium', 'high'].includes(c.childcareAvailability)
  )
    return false;
  if (
    !['unknown', 'researching', 'decided'].includes(c.housing) ||
    !['unknown', 'discussing', 'decided'].includes(c.reunion)
  )
    return false;
  if (typeof c.caregiving !== 'boolean' || typeof c.ownedHome !== 'boolean') return false;
  if (
    !Array.isArray(state.tasks) ||
    state.tasks.length !== 5 ||
    !state.tasks.every(
      (t, i) =>
        t.id === i + 1 &&
        typeof t.title === 'string' &&
        typeof t.owner === 'string' &&
        typeof t.due === 'string' &&
        typeof t.category === 'string' &&
        ['todo', 'in_progress', 'done'].includes(t.status),
    )
  )
    return false;
  if (
    !Number.isInteger(state.planVersion) ||
    state.planVersion < 1 ||
    !Array.isArray(state.history) ||
    state.history.length !== state.planVersion
  )
    return false;
  if (
    !state.history.every(
      (h) =>
        typeof h.reason === 'string' &&
        typeof h.date === 'string' &&
        typeof h.version === 'number' &&
        ['A', 'B', 'C'].includes(h.from) &&
        ['A', 'B', 'C'].includes(h.to),
    )
  )
    return false;
  return (
    typeof state.complete === 'boolean' &&
    typeof state.agreed === 'boolean' &&
    ['progress', 'schedule', 'family'].every(
      (key) => typeof state.sharing[key as keyof DemoState['sharing']] === 'boolean',
    )
  );
}
export function saveState(state: DemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
