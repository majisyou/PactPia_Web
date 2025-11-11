import { API_CONFIG } from '../config';

export interface LoginResponse {
  value: string;
}

// ログインAPI（POST）
export async function requestLogin(passphrase :string): Promise<LoginResponse[]> {
  const url = `${API_CONFIG.baseUrl}/v2/login/`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ value: passphrase }),
  });

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const data = await res.json();

  // API が { value: string } または [{ value: string }] を返す両方に対応
  if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0]?.value === 'string') {
      return data[0].value;
    }
  } else if (data && typeof data.value === 'string') {
    return data.value;
  }

  throw new Error('Unexpected response format from login API');
}
