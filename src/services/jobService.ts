// import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

export interface Job {
  id: number;
  job_id: string;
  language: string;
  code: string;
  status: string;
  user_id: number;
  message?: string;
  stdout?: string;
  stderr?:string;
  exec_duration?: number;
  mem_usage?: number;
}

export async function createJob(
  language: string,
  code: string,
  token: string
): Promise<Job> {
  const response = await axios.post(
    `${API_URL}/jobs`,
    {
      language,
      code,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.data.data.job_id) {
    throw new Error('Could not create job or retrieve job ID from response.');
  }

  return response.data.data;
}

export const getJob = async (jobId: string, token: string): Promise<Job> => {
  const response = await axios.get(`${API_URL}/jobs/job_id/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

export const getJobsByUser = async (userId: number): Promise<Job[]> => {
  const response = await axios.get(`${API_URL}/users/${userId}/jobs`);
  return response.data.data;
};

export const getJobsByStatus = async (status: string): Promise<Job[]> => {
  const response = await axios.get(`${API_URL}/jobs/status/${status}`);
  return response.data.data;
};
