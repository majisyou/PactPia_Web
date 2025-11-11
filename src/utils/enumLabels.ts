export const UNION_TYPE_MAP: Record<number, string> = {
  1: 'CITY',
  2: 'DOMINION',
  3: 'CROWN',
};

export const BUILDING_STATE_MAP: Record<number, string> = {
  [-1]: 'REJECT',
  0: 'APPROVE',
  1: 'VOTING',
  2: 'FINISH',
};

function labelFromMap(value: any, map: Record<number, string>): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number') return map[value] ?? String(value);
  if (typeof value === 'string') {
    // numeric string
    const n = Number(value);
    if (!Number.isNaN(n)) return map[n] ?? value;
    // try uppercase named value
    return value.toUpperCase();
  }
  return String(value);
}

export function getUnionTypeLabel(value: any): string {
  return labelFromMap(value, UNION_TYPE_MAP);
}

export function getBuildingStateLabel(value: any): string {
  return labelFromMap(value, BUILDING_STATE_MAP);
}
