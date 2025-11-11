import { API_CONFIG } from '../config';

export interface JobScore {
  job_score_id: number;
  job_id: number;
  score?: number;
  score_date?: string;
  created_at: string;
  updated_at: string;
}

export async function getJobScores(key: string, params?: Record<string, any>): Promise<JobScore[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/job_scores/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getJobScore(job_score_id: number, key: string): Promise<JobScore> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/job_scores/${job_score_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createJobScore(data: Partial<JobScore>, key: string): Promise<JobScore> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/job_scores/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateJobScore(job_score_id: number, data: Partial<JobScore>, key: string): Promise<JobScore> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/job_scores/${job_score_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchJobScore(job_score_id: number, data: Partial<JobScore>, key: string): Promise<JobScore> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/job_scores/${job_score_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteJobScore(job_score_id: number, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/job_scores/${job_score_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
