
import { API_CONFIG } from '../config';

export interface Shop {
  shop_id: string;
  item?: string;
  value?: number;
  created_at?: string;
  updated_at?: string;
}

export async function getShops(key: string, params?: Record<string, any>): Promise<Shop[]> {
  const url = new URL(`${API_CONFIG.baseUrl}/v2/shops/`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, String(v)));
  const res = await fetch(url.toString(), {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function getShop(shop_id: string, key: string): Promise<Shop> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/shops/${shop_id}`, {
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}

export async function createShop(data: Partial<Shop>, key: string): Promise<Shop> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/shops/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateShop(shop_id: string, data: Partial<Shop>, key: string): Promise<Shop> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/shops/${shop_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function patchShop(shop_id: string, data: Partial<Shop>, key: string): Promise<Shop> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/shops/${shop_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': key,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteShop(shop_id: string, key: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_CONFIG.baseUrl}/v2/shops/${shop_id}`, {
    method: 'DELETE',
    headers: { 'X-API-KEY': key },
  });
  return res.json();
}
