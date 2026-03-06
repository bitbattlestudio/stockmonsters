// lib/sigils/states.ts

export type PerformanceState = 1 | 2 | 3 | 4 | 5;

export interface StateConfig {
  name: string;
  description: string;
  arrowColor: string | null;
  arrowDirection: 'up' | 'down' | null;
  arrowCount: number;
  colorMod: string;
  expression: string;
  extras: string;
}

export const STATE_CONFIGS: Record<PerformanceState, StateConfig> = {
  // CRASHING: -10% or worse
  1: {
    name: 'crashing',
    description: 'Asset is crashing badly',
    arrowColor: '#EF4444', // Red
    arrowDirection: 'down',
    arrowCount: 5,
    colorMod: 'desaturated, add subtle red tint, dimmer overall',
    expression:
      'worried/sad eyes (slight downward curve), concerned expression',
    extras:
      'small crack or bandage visible, broken/dimmed prop nearby, dark reddish atmosphere',
  },

  // DOWN: -2% to -10%
  2: {
    name: 'down',
    description: 'Asset is down moderately',
    arrowColor: '#F97316', // Orange
    arrowDirection: 'down',
    arrowCount: 4,
    colorMod: 'slightly muted colors, less shine',
    expression: 'slightly concerned eyes, neutral-to-worried expression',
    extras: 'prop looks slightly worn, muted atmosphere',
  },

  // NEUTRAL: -2% to +2%
  3: {
    name: 'neutral',
    description: 'Asset is flat/unchanged',
    arrowColor: null,
    arrowDirection: null,
    arrowCount: 0,
    colorMod: 'normal, balanced colors',
    expression: 'calm neutral eyes (simple dots), peaceful expression',
    extras: 'stable, balanced atmosphere, subtle ambient glow',
  },

  // UP: +2% to +10%
  4: {
    name: 'up',
    description: 'Asset is up nicely',
    arrowColor: '#10B981', // Green
    arrowDirection: 'up',
    arrowCount: 4,
    colorMod: 'vibrant, bright colors, good shine',
    expression: 'happy eyes (slight upward curve), cheerful expression',
    extras: 'small sparkles, prop looks pristine, optimistic atmosphere',
  },

  // MOONING: +10% or better
  5: {
    name: 'mooning',
    description: 'Asset is mooning!',
    arrowColor: '#10B981', // Bright green
    arrowDirection: 'up',
    arrowCount: 6,
    colorMod: 'maximum vibrant, golden highlights, glowing',
    expression:
      'very happy eyes, tiny sparkle in eyes, triumphant expression',
    extras:
      'golden sparkles everywhere, prop looks premium, celebratory atmosphere, maybe tiny rocket or stars',
  },
};

export function getStateFromPerformance(percentChange: number): PerformanceState {
  if (percentChange <= -10) return 1; // Crashing
  if (percentChange <= -2) return 2; // Down
  if (percentChange <= 2) return 3; // Neutral
  if (percentChange <= 10) return 4; // Up
  return 5; // Mooning
}

export function getStateName(state: PerformanceState): string {
  return STATE_CONFIGS[state].name;
}

export function getStateColor(state: PerformanceState): string {
  const config = STATE_CONFIGS[state];
  if (config.arrowColor) return config.arrowColor;
  return '#6B7280'; // Neutral gray
}
