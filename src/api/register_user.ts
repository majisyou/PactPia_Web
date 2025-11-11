import { API_CONFIG } from '../config';

export interface RegisterUser {
  discord_id: string;
  mcid?: string;
  name?: string;
  approved_flag?: boolean;
  approved_at?: string;
  rejected_flag?: boolean;
  rejected_at?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getRegisterUsers(key: string, params?: Record<string, any>): Promise<RegisterUser[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/register_users/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getRegisterUser(discord_id: string, key: string): Promise<RegisterUser> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/register_users/${discord_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createRegisterUser(data: Partial<RegisterUser>, key: string): Promise<RegisterUser> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/register_users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRegisterUser(discord_id: string, data: Partial<RegisterUser>, key: string): Promise<RegisterUser> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/register_users/${discord_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchRegisterUser(discord_id: string, data: Partial<RegisterUser>, key: string): Promise<RegisterUser> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/register_users/${discord_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteRegisterUser(discord_id: string, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/register_users/${discord_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
