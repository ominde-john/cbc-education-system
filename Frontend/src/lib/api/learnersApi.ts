/**
 * Learners API Service
 * /api/v1/learners - List learners by school_id from auth user
 * Pattern matches teacherApi.ts and curriculumApi.ts
 */

// Learner interface matches Learners.tsx exactly - defined inline

const getApiUrl = (): string => {
  if (import.meta.env.PROD) return '';
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  return '';
};

const API_URL = getApiUrl();
console.log('[learnersApi] API_URL:', API_URL);

const getAuthToken = (): string | null => localStorage.getItem('cbe_access_token');

const getFetchOptions = (method: string, body?: unknown): RequestInit => {
  const token = getAuthToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return { method, headers, body: body ? JSON.stringify(body) : undefined };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};

// Backend response type (match Learners.tsx interface)
interface LearnerBackend {
  id: string;
  admission_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth?: string;
  grade_level: string;
  stream_name?: string;
  gender: string;
  special_needs?: boolean;
  is_active: boolean;
  created_at: string;
  learner_parents?: Array<{
    parents: {
      users?: {
        first_name?: string;
        last_name?: string;
        phone_number?: string;
      };
    } | null;
  }> | null;
}

interface LearnersListResponse {
  success: boolean;
  data: {
    learners: LearnerBackend[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}


// Map backend to frontend Learner type
const mapBackendToLearner = (backend: LearnerBackend): any => ({
  id: backend.id,
  admission_number: backend.admission_number,
  first_name: backend.first_name,
  last_name: backend.last_name,
  middle_name: backend.middle_name || null,
  date_of_birth: backend.date_of_birth || null,
  grade_level: backend.grade_level,
  stream_name: backend.stream_name || null,
  gender: backend.gender,
  special_needs: backend.special_needs || null,
  is_active: backend.is_active,
  created_at: backend.created_at,
  learner_parents: backend.learner_parents || null,
});

/**
 * GET /api/v1/learners
 * List learners for current authenticated school_admin
 * Uses req.user.school_id from JWT - no school_id param needed
 * Supports query params from Learners.tsx: search, grade_level, is_active etc.
 */
export const getLearners = async (params: {
  search?: string;
  grade_level?: string;
  gender?: string;
  is_active?: string;
  page?: number;
  pageSize?: number; // map to limit
} = {}): Promise<{
students: any[];
  totalStudents: number;
  totalPages: number;
}> => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.append('search', params.search);
  if (params.grade_level) searchParams.append('grade_level', params.grade_level);
  if (params.gender) searchParams.append('gender', params.gender);
  if (params.is_active !== undefined) searchParams.append('is_active', params.is_active);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.pageSize) searchParams.append('limit', params.pageSize.toString());

  const query = searchParams.toString();
  const url = `${API_URL}/api/v1/learners${query ? `?${query}` : ''}`;

  const response = await fetch(url, getFetchOptions('GET'));
  const result = await handleResponse<LearnersListResponse>(response);

  const students = result.data.learners.map(mapBackendToLearner);
  const totalStudents = result.data.pagination?.total || students.length;

  return {
    students,
    totalStudents,
    totalPages: Math.ceil(totalStudents / (params.pageSize || 10)),
  };

};

export default { getLearners };
