// ...existing code...
import { API_CONFIG } from '../config';

export interface Region {
  region_id: string;
  union_id: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

export async function getRegions(key: string, params?: Record<string, any>): Promise<Region[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/regions/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getRegion(region_id: string, key: string): Promise<Region> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/regions/${region_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createRegion(data: Partial<Region>, key: string): Promise<Region> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/regions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRegion(region_id: string, data: Partial<Region>, key: string): Promise<Region> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/regions/${region_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchRegion(region_id: string, data: Partial<Region>, key: string): Promise<Region> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/regions/${region_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteRegion(region_id: string, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/regions/${region_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
