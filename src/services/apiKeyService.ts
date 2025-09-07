import axios from 'axios';
import { API_URL } from './envService';

export interface APIKey {
  id: number;
  name: string;
  key_prefix: string;
  clerk_user_id: string;
  is_active: boolean;
  rate_limit: number;
  last_used_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface APIKeyCreateResponse extends APIKey {
  raw_key: string; // Only returned on creation
}

export interface APIKeyCreateRequest {
  name: string;
  expires_at?: string;
}

export interface APIKeyUpdateRequest {
  is_active: boolean;
}

export async function createAPIKey(
  request: APIKeyCreateRequest,
  token: string
): Promise<APIKeyCreateResponse> {
  const response = await axios.post(`${API_URL}/api-keys`, request, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function getAPIKeys(token: string): Promise<APIKey[]> {
  const response = await axios.get(`${API_URL}/api-keys`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function getAPIKey(id: number, token: string): Promise<APIKey> {
  const response = await axios.get(`${API_URL}/api-keys/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function updateAPIKey(
  id: number,
  request: APIKeyUpdateRequest,
  token: string
): Promise<APIKey> {
  const response = await axios.patch(`${API_URL}/api-keys/${id}`, request, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deleteAPIKey(id: number, token: string): Promise<void> {
  await axios.delete(`${API_URL}/api-keys/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
