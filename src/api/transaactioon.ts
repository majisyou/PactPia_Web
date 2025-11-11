import { API_CONFIG } from '../config';

export interface TransactionResponse {
    id: number;
    purpose: string;
    from_id: string;
    to_id: string;
    amount: number;
    memo?: string | null;
    created_at: string;
    status: string;
}

export type GetTransactionsParams = {
    start_date?: string; // ISO 8601
    end_date?: string; // ISO 8601
    user_id?: string;
    union_id?: string;
};

export async function getTransactions(key: string, params?: GetTransactionsParams): Promise<TransactionResponse[]> {
    const url = new URL(`${API_CONFIG.baseUrl}/v2/transactions/`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
        });
    }
    const res = await fetch(url.toString(), {
        headers: { 'X-API-KEY': key },
    });
    if (!res.ok) throw new Error(`getTransactions failed: ${res.status} ${res.statusText}`);
    return res.json();
}