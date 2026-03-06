// Portfolio Health Calculations

export interface PositionHealth {
  symbol: string;
  percentGain: number;
  daysSinceFed: number;
}

export interface HealthLevel {
  fill: number;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'gold';
  label: string;
}

export interface PortfolioHealthData {
  health: HealthLevel & { value: string };
  hunger: HealthLevel & { value: string };
  happiness: HealthLevel & { value: string };
  summary: {
    total: number;
    greenCount: number;
    redCount: number;
  };
}

// ❤️ HEALTH - Based on total portfolio gain percent
export function getHealthLevel(totalGainPercent: number): HealthLevel {
  if (totalGainPercent <= -15) {
    return { fill: 15, color: 'red', label: 'Critical' };
  }
  if (totalGainPercent <= -5) {
    return { fill: 35, color: 'orange', label: 'Unwell' };
  }
  if (totalGainPercent <= 0) {
    return { fill: 50, color: 'yellow', label: 'Recovering' };
  }
  if (totalGainPercent <= 10) {
    return { fill: 70, color: 'green', label: 'Healthy' };
  }
  if (totalGainPercent <= 25) {
    return { fill: 85, color: 'green', label: 'Great!' };
  }
  return { fill: 100, color: 'gold', label: 'Amazing!' };
}

// 🍎 HUNGER - Based on average days since buying
export function getHungerLevel(avgDaysSinceFed: number): HealthLevel {
  if (avgDaysSinceFed <= 14) {
    return { fill: 100, color: 'green', label: 'Fed' };
  }
  if (avgDaysSinceFed <= 30) {
    return { fill: 70, color: 'green', label: 'OK' };
  }
  if (avgDaysSinceFed <= 60) {
    return { fill: 50, color: 'yellow', label: 'Hungry' };
  }
  if (avgDaysSinceFed <= 90) {
    return { fill: 30, color: 'orange', label: 'Starving' };
  }
  return { fill: 15, color: 'red', label: 'Neglected' };
}

// 😊 HAPPINESS - Based on percentage of profitable positions
export function getHappinessLevel(greenCount: number, totalCount: number): HealthLevel {
  if (totalCount === 0) {
    return { fill: 50, color: 'yellow', label: 'Empty' };
  }

  const ratio = greenCount / totalCount;

  if (ratio === 0) {
    return { fill: 10, color: 'red', label: 'Sad' };
  }
  if (ratio <= 0.25) {
    return { fill: 30, color: 'orange', label: 'Meh' };
  }
  if (ratio <= 0.5) {
    return { fill: 50, color: 'yellow', label: 'OK' };
  }
  if (ratio <= 0.75) {
    return { fill: 75, color: 'green', label: 'Happy' };
  }
  if (ratio < 1) {
    return { fill: 90, color: 'green', label: 'Great!' };
  }
  return { fill: 100, color: 'gold', label: 'Ecstatic!' };
}

export function calculatePortfolioHealth(
  positions: PositionHealth[],
  totalGainPercent: number
): PortfolioHealthData {
  // Calculate average days since fed
  const avgDaysSinceFed =
    positions.length > 0
      ? positions.reduce((sum, p) => sum + p.daysSinceFed, 0) / positions.length
      : 30;

  // Count green (profitable) positions
  const greenCount = positions.filter((p) => p.percentGain > 0).length;
  const redCount = positions.length - greenCount;

  // Get health levels
  const healthLevel = getHealthLevel(totalGainPercent);
  const hungerLevel = getHungerLevel(avgDaysSinceFed);
  const happinessLevel = getHappinessLevel(greenCount, positions.length);

  return {
    health: {
      ...healthLevel,
      value: `${totalGainPercent >= 0 ? '+' : ''}${totalGainPercent.toFixed(1)}%`,
    },
    hunger: {
      ...hungerLevel,
      value: `${Math.round(avgDaysSinceFed)} days`,
    },
    happiness: {
      ...happinessLevel,
      value: `${greenCount} of ${positions.length} green`,
    },
    summary: {
      total: positions.length,
      greenCount,
      redCount,
    },
  };
}
