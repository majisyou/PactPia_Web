import { API_CONFIG } from '../config';
// 建物メンバー一覧取得API
export async function getBuildingMembers(key: string, params?: Record<string, any>): Promise<BuildingMember[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/building-members/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export interface BuildingMember {
  building_member_id: number;
  discord_id?: string;
  building_id?: number;
  home_flag?: boolean;
  member_type?: string;
  member_auth?: string;
  homed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getBuildingMember(building_member_id: number, key: string): Promise<BuildingMember> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_members/${building_member_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createBuildingMember(data: Partial<BuildingMember>, key: string): Promise<BuildingMember> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_members/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBuildingMember(building_member_id: number, data: Partial<BuildingMember>, key: string): Promise<BuildingMember> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_members/${building_member_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchBuildingMember(building_member_id: number, data: Partial<BuildingMember>, key: string): Promise<BuildingMember> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_members/${building_member_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBuildingMember(building_member_id: number, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_members/${building_member_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
