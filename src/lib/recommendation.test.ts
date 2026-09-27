import { describe, expect, it } from 'vitest';
import { createInitialState } from '../data';
import { calculateRecommendation, getProgress, getUncertainties } from './recommendation';

describe('family recommendation', () => {
  it('recommends B for the initial family and A once work and childcare are ready', () => {
    const state = createInitialState();
    expect(calculateRecommendation(state.conditions, state.priorities).recommended).toBe('B');
    const result = calculateRecommendation(
      { ...state.conditions, spouseTransfer: 'possible', childcareAvailability: 'high' },
      state.priorities,
    );
    expect(result.recommended).toBe('A');
    expect(result.scores.A).toBeGreaterThan(result.scores.B);
  });
  it('clamps all ratings and reacts to family priorities', () => {
    const state = createInitialState();
    for (const spouseTransfer of ['possible', 'unavailable', 'unknown'] as const) {
      for (const childcareAvailability of ['low', 'medium', 'high', 'unknown'] as const) {
        const { scores, ratings } = calculateRecommendation(
          { ...state.conditions, spouseTransfer, childcareAvailability, remoteWork: 'full' },
          state.priorities,
        );
        expect(Object.values(scores).every((score) => score >= 0 && score <= 100)).toBe(true);
        expect(
          Object.values(ratings).every((rating) =>
            Object.values(rating).every((score) => score >= 1 && score <= 5),
          ),
        ).toBe(true);
      }
    }
    const workFirst = {
      liveTogether: 1,
      spouseCareer: 5,
      childStability: 5,
      costSensitivity: 3,
      moveSpeed: 3,
    };
    expect(calculateRecommendation(state.conditions, workFirst).recommended).toBe('C');
  });
  it('increases progress with completed tasks and reserves 100% for completion', () => {
    const state = createInitialState();
    expect(getProgress(state)).toBe(46);
    state.tasks[0].status = 'done';
    expect(getProgress(state)).toBe(54);
    state.tasks.forEach((t) => {
      t.status = 'done';
    });
    expect(getProgress(state)).toBeLessThan(100);
    state.complete = true;
    expect(getProgress(state)).toBe(100);
  });
  it('updates the unresolved condition count', () => {
    const { conditions } = createInitialState();
    expect(getUncertainties(conditions).filter((c) => !c.resolved)).toHaveLength(4);
    expect(
      getUncertainties({
        ...conditions,
        spouseTransfer: 'possible',
        childcareAvailability: 'high',
      }).filter((c) => !c.resolved),
    ).toHaveLength(2);
  });
});
