import { API_CONFIG } from '../config';

export interface UnionMember {
  union_member_id: number;
  discord_id?: string;
  union_id?: string;
  member_type?: string;
  member_auth?: string;
  land_auth?: string;
  money_auth?: string;
  created_at: string;
  updated_at: string;
}

export async function getUnionMembers(key: string, params?: Record<string, any>): Promise<UnionMember[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/union_members/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getUnionMember(union_member_id: number, key: string): Promise<UnionMember> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/union_members/${union_member_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createUnionMember(data: Partial<UnionMember>, key: string): Promise<UnionMember> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/union_members/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateUnionMember(union_member_id: number, data: Partial<UnionMember>, key: string): Promise<UnionMember> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/union_members/${union_member_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchUnionMember(union_member_id: number, data: Partial<UnionMember>, key: string): Promise<UnionMember> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/union_members/${union_member_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteUnionMember(union_member_id: number, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/union_members/${union_member_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
