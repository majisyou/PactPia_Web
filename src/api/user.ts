import { API_CONFIG } from '../config';

export interface User {
  discord_id: string;
  mcid?: string;
  name?: string;
  money?: number;
  delete_flag: boolean;
  deleted_at?: string;
  ip_addr?: string;
  x_id?: string;
  created_at: string;
  updated_at: string;
}

export async function getUsers(key: string, params?: Record<string, any>): Promise<User[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/users/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUser(discord_id: string, key: string): Promise<User> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createUser(data: Partial<User>, key: string): Promise<User> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key  ,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateUser(discord_id: string, data: Partial<User>, key: string): Promise<User> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchUser(discord_id: string, data: Partial<User>, key: string): Promise<User> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteUser(discord_id: string, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}


export async function getUserBuildings(discord_id: string, key: string): Promise<any[]> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}/buildings/`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUserBuildingMemberships(discord_id: string, key: string): Promise<any[]> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}/building_memberships/`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUserBuildingVotes(discord_id: string, key: string): Promise<any[]> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}/building_votes/`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUserJobs(discord_id: string, key: string): Promise<any[]> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}/jobs/`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUserUnionMembers(discord_id: string, key: string): Promise<any[]> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}/union_memberships/`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUserSkins(discord_id: string, key: string): Promise<any[]> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}/skins/`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUserHome(discord_id: string, key: string): Promise<any> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/users/${discord_id}/home/`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}


