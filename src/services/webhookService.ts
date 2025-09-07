import axios from 'axios';
import { API_URL } from './envService';

export type WebhookEventType = 'job.completed' | 'job.failed';

export interface Webhook {
  id: number;
  url: string;
  events: WebhookEventType[];
  is_active: boolean;
  clerk_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface WebhookCreateRequest {
  url: string;
  events: WebhookEventType[];
  secret?: string;
}

export interface WebhookUpdateRequest {
  url?: string;
  events?: WebhookEventType[];
  is_active?: boolean;
  secret?: string;
}

export interface WebhookEvent {
  id: number;
  webhook_id: number;
  event_type: WebhookEventType;
  job_id: string;
  delivered: boolean;
  status_code?: number;
  attempt_count: number;
  next_retry_at?: string;
  created_at: string;
  updated_at: string;
}

export const WEBHOOK_EVENT_TYPES: WebhookEventType[] = [
  'job.completed',
  'job.failed',
];

export async function createWebhook(
  request: WebhookCreateRequest,
  token: string
): Promise<Webhook> {
  const response = await axios.post(`${API_URL}/webhooks`, request, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function getWebhooks(token: string): Promise<Webhook[]> {
  const response = await axios.get(`${API_URL}/webhooks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function getWebhook(id: number, token: string): Promise<Webhook> {
  const response = await axios.get(`${API_URL}/webhooks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function updateWebhook(
  id: number,
  request: WebhookUpdateRequest,
  token: string
): Promise<Webhook> {
  const response = await axios.patch(`${API_URL}/webhooks/${id}`, request, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

export async function deleteWebhook(id: number, token: string): Promise<void> {
  await axios.delete(`${API_URL}/webhooks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getWebhookEvents(
  webhookId: number,
  token: string,
  limit = 50,
  offset = 0
): Promise<WebhookEvent[]> {
  const response = await axios.get(
    `${API_URL}/webhooks/${webhookId}/events?limit=${limit}&offset=${offset}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data.data;
}
