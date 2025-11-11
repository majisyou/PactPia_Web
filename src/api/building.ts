
import { API_CONFIG } from '../config';

export interface Building {
  building_id: number;
  building_type?: string;
  creater_id?: string;
  x?: number;
  y?: number;
  z?: number;
  approve_flag?: boolean;
  approved_at?: string;
  state?: string;
  score?: number;
  created_at?: string;
  updated_at?: string;
  stated_at?: string;
}

export async function getBuildings(key: string, params?: Record<string, any>): Promise<Building[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/buildings/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getBuilding(building_id: string, key: string): Promise<Building> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/buildings/${building_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createBuilding(data: Partial<Building>, key: string): Promise<Building> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/buildings/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBuilding(building_id: string, data: Partial<Building>, key: string): Promise<Building> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/buildings/${building_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchBuilding(building_id: string, data: Partial<Building>, key: string): Promise<Building> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/buildings/${building_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBuilding(building_id: string, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/buildings/${building_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
