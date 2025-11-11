
import { API_CONFIG } from '../config';

export interface Union {
  union_id: string;
  name: string;
  area_size?: number;
  money?: number;
  tax?: number;
  power?: number;
  extra?: number;
  union_type?: string;
  npc_population?: number;
  delete_flag?: boolean;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getUnions(key: string, params?: Record<string, any>): Promise<Union[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/unions/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUnion(union_id: string, key: string): Promise<Union> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/unions/${union_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createUnion(data: Partial<Union>, key: string): Promise<Union> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/unions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateUnion(union_id: string, data: Partial<Union>, key: string): Promise<Union> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/unions/${union_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchUnion(union_id: string, data: Partial<Union>, key: string): Promise<Union> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/unions/${union_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteUnion(union_id: string, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/unions/${union_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
