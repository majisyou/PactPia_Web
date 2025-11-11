import { API_CONFIG } from '../config';

export async function sendUser(discord_id: string, data: any, key: string) {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/redis/send_user/${discord_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function sendUnion(union_id: string, data: any, key: string) {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/redis/send_union/${union_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function sendAdmin(data: any, key: string) {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/redis/send_admin/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}