import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../data';
import { loadState, saveState, STORAGE_KEY } from './storage';

afterEach(() => vi.unstubAllGlobals());
describe('local demo storage', () => {
  it('restores a plan, conditions, tasks and sharing preferences', () => {
    const memory = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => memory.set(key, value),
    });
    const state = createInitialState();
    state.tasks[0].status = 'done';
    state.conditions.spouseTransfer = 'possible';
    state.conditions.childcareAvailability = 'high';
    state.recommendedScenarioId = 'A';
    state.sharing.family = true;
    expect(saveState(state)).toBe(true);
    expect(loadState()).toEqual(state);
  });
  it('recovers safely from broken JSON, incomplete data or blocked storage', () => {
    for (const raw of ['{', '{}', JSON.stringify({ ...createInitialState(), tasks: [null] })]) {
      vi.stubGlobal('localStorage', { getItem: () => raw });
      expect(loadState()).toEqual(createInitialState());
    }
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('quota');
      },
    });
    expect(loadState()).toEqual(createInitialState());
    expect(saveState(createInitialState())).toBe(false);
    expect(STORAGE_KEY).toBe('family-move-support-demo-v1');
  });
});
