import { API_CONFIG } from '../config';

export interface Skin {
  skin_id: number;
  discord_id: string;
  skin_type?: string;
  created_at: string;
  updated_at: string;
}

export async function getSkins(key: string, params?: Record<string, any>): Promise<Skin[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/skins/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getSkin(skin_id: string, key: string): Promise<Skin> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/skins/${skin_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createSkin(data: Partial<Skin>, key: string): Promise<Skin> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/skins/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateSkin(skin_id: string, data: Partial<Skin>, key: string): Promise<Skin> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/skins/${skin_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchSkin(skin_id: string, data: Partial<Skin>, key: string): Promise<Skin> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/skins/${skin_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSkin(skin_id: string, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/skins/${skin_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
