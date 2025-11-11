import { API_CONFIG } from '../config';

export interface Job {
  job_id: number;
  discord_id: string;
  job_type?: string;
  is_leave?: boolean;
  is_ban?: boolean;
  member_auth?: string;
  leaved_at?: string;
  baned_at?: string;
  created_at: string;
  updated_at: string;
}

export async function getJobs(key: string, params?: Record<string, any>): Promise<Job[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/jobs/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getJob(job_id: string, key: string): Promise<Job> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/jobs/${job_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createJob(data: Partial<Job>, key: string): Promise<Job> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/jobs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateJob(job_id: string, data: Partial<Job>, key: string): Promise<Job> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/jobs/${job_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchJob(job_id: string, data: Partial<Job>, key: string): Promise<Job> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/jobs/${job_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteJob(job_id: string, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/jobs/${job_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
