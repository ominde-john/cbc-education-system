import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing. Please check your .env file.');
}

// Create the Supabase client with optimized settings for faster performance
// Note: autoRefreshToken is disabled to prevent CORS errors when using backend authentication
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  db: {
    schema: 'public',
  },
  global: {
    // Enable request timeout for faster error handling
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Client-Info': 'cbc-education-system/1.0.0',
    },
  },
});

// User types based on the database schema
export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  role: 'Administrator' | 'Editor' | 'Author' | 'Contributor' | 'Subscriber';
  status: 'active' | 'inactive' | 'pending';
  posts_count: number;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  last_active: string;
}

// Helper function to format user data for the UI
export const formatUserForUI = (dbUser: DatabaseUser) => {
  return {
    id: dbUser.id,
    username: dbUser.username,
    name: dbUser.full_name || dbUser.username,
    email: dbUser.email,
    role: dbUser.role,
    posts: dbUser.posts_count,
    status: dbUser.status,
    joinedDate: new Date(dbUser.created_at).toISOString().split('T')[0],
    lastActive: formatLastActive(dbUser.last_active)
  };
};

// Helper to format last active time
const formatLastActive = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};
