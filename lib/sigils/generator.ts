// lib/sigils/generator.ts

import { getObjectConfig, ObjectConfig } from './mappings';
import { BASE_TEMPLATES } from './prompts';
import { STATE_CONFIGS, PerformanceState } from './states';

export function assemblePrompt(
  config: ObjectConfig,
  state: PerformanceState
): string {
  const baseTemplate = BASE_TEMPLATES[config.type];
  const stateConfig = STATE_CONFIGS[state];

  if (!baseTemplate) {
    throw new Error(`No template found for object type: ${config.type}`);
  }

  // Build arrow instructions
  let arrowInstructions = '';
  if (stateConfig.arrowDirection && stateConfig.arrowCount > 0) {
    const arrowSymbol = stateConfig.arrowDirection === 'up' ? '▲' : '▼';
    arrowInstructions = `
    - ${stateConfig.arrowCount} ${stateConfig.arrowColor} ${stateConfig.arrowDirection.toUpperCase()} ARROWS (${arrowSymbol}) floating ${stateConfig.arrowDirection === 'up' ? 'upward' : 'downward'} around the character
    - Arrows scattered at different heights, ${stateConfig.arrowDirection === 'up' ? 'rising like the asset is going up' : 'falling like the asset is going down'}`;
  } else {
    arrowInstructions = `
    - NO arrows (neutral state)`;
  }

  return `
Create a 64x64 pixel art sprite scene.

=== CHARACTER ===
${baseTemplate}

=== PERFORMANCE STATE: ${stateConfig.name.toUpperCase()} ===
Expression: ${stateConfig.expression}
${stateConfig.extras}

=== ENVIRONMENT ===
- Small dark platform underneath
- ${config.props || 'Tiny related icon nearby'}
${arrowInstructions}

=== STYLE ===
- Clean pixel art, cute but sophisticated
- "Fintech mascot" energy - not childish
- 12-15 colors maximum
- Transparent background

=== COLOR PALETTE ===
- Primary: ${config.colors.primary}
- Secondary: ${config.colors.secondary}
- Accent: ${config.colors.accent}
- Color mood: ${stateConfig.colorMod}
${stateConfig.arrowColor ? `- Arrow color: ${stateConfig.arrowColor}` : ''}

=== ANIMATION ===
4-frame idle animation:
- Gentle float/bob
${stateConfig.arrowDirection ? `- Arrows drift ${stateConfig.arrowDirection}ward smoothly` : '- Subtle ambient movement'}
- Smooth, not bouncy

The overall feeling should be "${stateConfig.description}".
  `.trim();
}

// Main generation function
export function generateSigilPrompt(
  identifier: string,
  state: PerformanceState,
  type: 'stock' | 'market' = 'stock',
  marketTitle?: string
): string {
  const config = getObjectConfig(identifier, type, marketTitle);
  return assemblePrompt(config, state);
}

// Generate a simple prompt for testing
export function generateSimplePrompt(
  identifier: string,
  state: PerformanceState,
  type: 'stock' | 'market' = 'stock',
  marketTitle?: string
): string {
  const config = getObjectConfig(identifier, type, marketTitle);
  const stateConfig = STATE_CONFIGS[state];

  // Build arrow description
  let arrowDesc = '';
  if (stateConfig.arrowDirection && stateConfig.arrowCount > 0) {
    const arrowSymbol = stateConfig.arrowDirection === 'up' ? '▲' : '▼';
    arrowDesc = `, ${stateConfig.arrowCount} ${stateConfig.arrowColor} ${stateConfig.arrowDirection} arrows (${arrowSymbol}) floating ${stateConfig.arrowDirection}ward`;
  }

  return `64x64 pixel art of a cute ${config.type} character (${config.colors.primary} primary color), ${stateConfig.expression}${arrowDesc}, ${config.props || ''}, small platform underneath, transparent background, ${stateConfig.colorMod}`;
}
