import { API_CONFIG } from '../config';

export interface BuildingVote {
  building_vote_id: number;
  discord_id?: string;
  building_id?: number;
  value?: number;
  created_at: string;
  updated_at: string;
}

export async function getBuildingVotes(key: string, params?: Record<string, any>): Promise<BuildingVote[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/building_votes/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getBuildingVote(building_vote_id: number, key: string): Promise<BuildingVote> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_votes/${building_vote_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createBuildingVote(data: Partial<BuildingVote>, key: string): Promise<BuildingVote> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_votes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateBuildingVote(building_vote_id: number, data: Partial<BuildingVote>, key: string): Promise<BuildingVote> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_votes/${building_vote_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchBuildingVote(building_vote_id: number, data: Partial<BuildingVote>, key: string): Promise<BuildingVote> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_votes/${building_vote_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBuildingVote(building_vote_id: number, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/building_votes/${building_vote_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
