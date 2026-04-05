/**
 * Schools API Service
 * Handles all HTTP requests to the schools backend API (/api/schools)
 */

import type { StaffMember } from '../../pages/teacher/StaffManagement/types';

export interface Branch {
  id: string;
  school_id: string;
  name: string;
  code: string;
  physical_address: string;
  phone_number: string;
  email: string;
  is_main_campus: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

// API URL - same pattern as other APIs
const getApiUrl = (): string => {
  if (import.meta.env.PROD) return '';
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return '';
};

const API_URL = getApiUrl();
console.log('[schoolsApi] API_URL:', API_URL);

// Auth token from localStorage (same as other APIs)
const getAuthToken = (): string | null => {
  return localStorage.getItem('cbe_access_token');
};

const getFetchOptions = (method: string, body?: unknown): RequestInit => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

/**
 * GET /api/schools/:schoolId/branches
 */
export const getBranches = async (schoolId: string): Promise<Branch[]> => {
  const url = `${API_URL}/api/schools/${schoolId}/branches`;

  const response = await fetch(url, getFetchOptions('GET'));
  const result = await handleResponse<{data: Branch[]}>(response);

  return result.data;
};

/**
 * GET /api/schools
 */
export const getSchools = async (): Promise<School[]> => {
  const url = `${API_URL}/api/schools`;

  const response = await fetch(url, getFetchOptions('GET'));
  const result = await handleResponse<{data: School[]}>(response);

  return result.data;
};