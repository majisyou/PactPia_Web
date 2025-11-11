// src/utils/api_key.ts
export function saveApiKey(value: string): void {
    try {
        localStorage.setItem('apiKey', value);
    } catch (e) {
        console.error('Failed to save api key to localStorage', e);
    }
}

export function getApiKey(): string | null {
    try {
        return localStorage.getItem('apiKey');
    } catch (e) {
        console.error('Failed to read api key from localStorage', e);
        return null;
    }
}

export function hasApiKey(): boolean {
    try {
        return localStorage.getItem('apiKey') !== null;
    } catch (e) {
        console.error('Failed to access localStorage', e);
        return false;
    }
}


