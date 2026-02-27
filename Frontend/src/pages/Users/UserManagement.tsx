import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, UserPlus, Mail, Trash2, Shield, 
  User, ChevronDown, Download, RefreshCw, Check, X, Loader2, 
  Lock, Unlock, AlertTriangle, ShieldCheck, Eye, EyeOff, Key
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// API URL - use environment variable, empty for development (uses Vite proxy)
const API_URL = import.meta.env.VITE_API_URL || '';

// User type from API
interface UserFromAPI {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role: string;
  status: string;
  is_active: boolean;
  email_verified: boolean;
  two_factor_enabled: boolean;
  last_login: string | null;
  login_attempts: number;
  locked_until: string | null;
  active_sessions: number;
  max_sessions: number;
  school_id: string | null;
  school_name?: string;
  created_at: string;
  updated_at: string;
}

// UI display type
interface UserForUI {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: string;
  status: string;
  displayStatus: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin: string | null;
  loginAttempts: number;
  lockedUntil: string | null;
  isLocked: boolean;
  activeSessions: number;
  maxSessions: number;
  schoolId: string | null;
  isActive: boolean;
  joinedDate: string;
  avatarUrl: string | null;
  schoolName?: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

// Role display labels
const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  school_admin: 'School Admin',
  teacher: 'Teacher',
  parent: 'Parent',
  student: 'Student'
};

// Role filter options
const roleFilters = [
  { value: 'all', label: 'All Roles' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'school_admin', label: 'School Admin' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' }
];

// Status filter options
const statusFilters = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'locked', label: 'Locked' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'not_verified', label: 'Not Verified' }
];

// Helper function to format user data for the UI
const formatUserForUI = (apiUser: UserFromAPI): UserForUI => {
  const firstName = apiUser.first_name || '';
  const lastName = apiUser.last_name || '';
  const name = `${firstName} ${lastName}`.trim() || apiUser.email;
  
  // Smart status logic
  let displayStatus = 'Active';
  const now = new Date();
  
  if (apiUser.locked_until && new Date(apiUser.locked_until) > now) {
    displayStatus = 'Locked';
  } else if (!apiUser.is_active) {
    displayStatus = 'Inactive';
  } else if (!apiUser.email_verified) {
    displayStatus = 'Not Verified';
  }
  
  return {
    id: apiUser.id,
    firstName,
    lastName,
    name,
    email: apiUser.email,
    role: apiUser.role,
    status: apiUser.status,
    displayStatus,
    emailVerified: apiUser.email_verified,
    twoFactorEnabled: apiUser.two_factor_enabled,
    lastLogin: apiUser.last_login,
    loginAttempts: apiUser.login_attempts,
    lockedUntil: apiUser.locked_until,
    isLocked: apiUser.locked_until ? new Date(apiUser.locked_until) > now : false,
    activeSessions: apiUser.active_sessions,
    maxSessions: apiUser.max_sessions,
    schoolId: apiUser.school_id,
    isActive: apiUser.is_active,
    joinedDate: new Date(apiUser.created_at).toISOString().split('T')[0],
    avatarUrl: null,
    schoolName: apiUser.school_name
  };
};

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserForUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserForUI | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  // Get auth token
  const getAuthToken = (): string | null => {
    return localStorage.getItem('cbc_access_token');
  };

  // Fetch users from backend API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Build query params
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
        search: searchTerm,
        role: filterRole,
        status: filterStatus
      });

      console.log('Fetching users from API...');
      
      const response = await fetch(`${API_URL}/api/users?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }

      console.log('API response:', data);

      if (data.success && data.data) {
        console.log('Users fetched successfully:', data.data.length);
        
        // Format users from API
        const formattedUsers = data.data.map((user: UserFromAPI) => formatUserForUI(user));
        setUsers(formattedUsers);
        
        // Update pagination
        if (data.pagination) {
          setTotalPages(data.pagination.pages || 1);
        }
      } else {
        console.log('No users found');
        setUsers([]);
      }
    } catch (err: unknown) {
      console.error('Error fetching users:', err);
      setError(getErrorMessage(err, 'Failed to fetch users. Please check your connection.'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterRole, filterStatus]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Add new user via API
  const addUser = async (userData: { firstName: string; lastName: string; email: string; role: string; schoolId?: string }) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          role: userData.role,
          school_id: userData.schoolId || null
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create user');
      }

      // Refresh users
      await fetchUsers();
    } catch (err: unknown) {
      console.error('Error adding user:', err);
      alert(getErrorMessage(err, 'Failed to add user'));
    }
  };

  // Update user via API
  const updateUser = async (userId: string, userData: Partial<UserForUI>) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          role: userData.role,
          is_active: userData.isActive
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update user');
      }

      await fetchUsers();
    } catch (err: unknown) {
      console.error('Error updating user:', err);
      alert(getErrorMessage(err, 'Failed to update user'));
    }
  };

  // Toggle user active status
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update user status');
      }

      await fetchUsers();
    } catch (err: unknown) {
      console.error('Error toggling user status:', err);
      alert(getErrorMessage(err, 'Failed to update user status'));
    }
  };

  // Unlock user account
  const unlockUser = async (userId: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/users/${userId}/unlock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to unlock user');
      }

      await fetchUsers();
    } catch (err: unknown) {
      console.error('Error unlocking user:', err);
      alert(getErrorMessage(err, 'Failed to unlock user'));
    }
  };

  // Delete user via API
  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete user');
      }

      setUsers(users.filter(u => u.id !== userId));
      const newSelected = new Set(selectedUsers);
      newSelected.delete(userId);
      setSelectedUsers(newSelected);
    } catch (err: unknown) {
      console.error('Error deleting user:', err);
      alert(getErrorMessage(err, 'Failed to delete user'));
    }
  };

  // Calculate stats from current users
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const superAdmins = users.filter(u => u.role === 'super_admin').length;
    const schoolAdmins = users.filter(u => u.role === 'school_admin').length;
    const activeUsers = users.filter(u => u.isActive && !u.isLocked).length;
    const lockedUsers = users.filter(u => u.isLocked).length;
    
    return { totalUsers, superAdmins, schoolAdmins, activeUsers, lockedUsers };
  }, [users]);

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
      
      // Role filter (handled by API, but keep for local filtering)
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      
      // Status filter (handled by API, but keep for local filtering)
      let matchesStatus = true;
      if (filterStatus === 'active') {
        matchesStatus = user.displayStatus === 'Active';
      } else if (filterStatus === 'locked') {
        matchesStatus = user.displayStatus === 'Locked';
      } else if (filterStatus === 'inactive') {
        matchesStatus = user.displayStatus === 'Inactive';
      } else if (filterStatus === 'not_verified') {
        matchesStatus = user.displayStatus === 'Not Verified';
      }
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'email':
          aVal = a.email.toLowerCase();
          bVal = b.email.toLowerCase();
          break;
        case 'role':
          aVal = a.role;
          bVal = b.role;
          break;
        case 'status':
          aVal = a.displayStatus;
          bVal = b.displayStatus;
          break;
        case 'lastLogin':
          aVal = a.lastLogin || '';
          bVal = b.lastLogin || '';
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return filtered;
  }, [users, searchTerm, filterRole, filterStatus, sortBy, sortOrder]);

  const toggleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-700';
      case 'Locked': return 'bg-red-100 text-red-700';
      case 'Inactive': return 'bg-slate-100 text-slate-700';
      case 'Not Verified': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'super_admin': return 'bg-purple-100 text-purple-700';
      case 'school_admin': return 'bg-blue-100 text-blue-700';
      case 'teacher': return 'bg-green-100 text-green-700';
      case 'parent': return 'bg-orange-100 text-orange-700';
      case 'student': return 'bg-teal-100 text-teal-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'U';
  };

  const formatLastLogin = (dateString: string | null) => {
    if (!dateString) return 'Never Logged In';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'School', 'Status', 'Last Login', 'Sessions'];
    const csvData = filteredUsers.map(user => [
      user.name,
      user.email,
      user.role,
      user.schoolName || 'Platform Level',
      user.displayStatus,
      formatLastLogin(user.lastLogin),
      `${user.activeSessions}/${user.maxSessions}`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">User Management</h1>
            <p className="text-slate-600 text-base">Manage your team members and their permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-slate-600 mb-2">Total Users</div>
                <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-600">
                <User className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-slate-600 mb-2">Super Admins</div>
                <div className="text-3xl font-bold text-slate-900">{stats.superAdmins}</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-600">
                <Shield className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-slate-600 mb-2">School Admins</div>
                <div className="text-3xl font-bold text-slate-900">{stats.schoolAdmins}</div>
              </div>
              <div className="p-3 rounded-lg bg-indigo-600">
                <ShieldCheck className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-slate-600 mb-2">Active Users</div>
                <div className="text-3xl font-bold text-slate-900">{stats.activeUsers}</div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-600">
                <Check className="text-white" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm text-slate-600 mb-2">Locked Users</div>
                <div className="text-3xl font-bold text-slate-900">{stats.lockedUsers}</div>
              </div>
              <div className="p-3 rounded-lg bg-red-600">
                <Lock className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
            <button onClick={fetchUsers} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[180px] text-sm font-medium text-slate-700"
              >
                {roleFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[180px] text-sm font-medium text-slate-700"
              >
                {statusFilters.map(filter => (
                  <option key={filter.value} value={filter.value}>{filter.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>

            {/* Export Button */}
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download size={18} className="text-slate-600" />
              <span className="text-slate-700 font-medium text-sm">Export</span>
            </button>
            
            {/* Refresh Button */}
            <button 
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={18} className="text-slate-600" />
              <span className="text-slate-700 font-medium text-sm">Refresh</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      User
                      {sortBy === 'name' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-2">
                      Email
                      {sortBy === 'email' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-2">
                      Role
                      {sortBy === 'role' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    School
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortBy === 'status' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-semibold text-slate-700 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSort('lastLogin')}
                  >
                    <div className="flex items-center gap-2">
                      Last Login
                      {sortBy === 'lastLogin' && (
                        <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Sessions
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getRoleColor(user.role)}`}>
                            {getInitials(user.firstName, user.lastName)}
                          </div>
                          {user.isLocked && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <Lock size={10} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                            {user.name}
                            {user.loginAttempts > 3 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700" title={`${user.loginAttempts} failed login attempts`}>
                                <AlertTriangle size={10} className="mr-1" />
                                {user.loginAttempts}
                              </span>
                            )}
                            {user.emailVerified && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700" title="Email Verified">
                                <ShieldCheck size={10} className="mr-1" />
                                Verified
                              </span>
                            )}
                            {user.twoFactorEnabled && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700" title="2FA Enabled">
                                <Key size={10} className="mr-1" />
                                2FA
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Mail size={14} className="text-slate-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getRoleColor(user.role)}`}>
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-700 text-sm">
                        {user.schoolId ? user.schoolName || 'Unknown School' : 'Platform Level'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(user.displayStatus)}`}>
                        {user.displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{formatLastLogin(user.lastLogin)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-medium ${user.activeSessions > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {user.activeSessions}
                        </span>
                        <span className="text-slate-400">/</span>
                        <span className="text-sm text-slate-500">{user.maxSessions}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setEditingUser(user)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Edit user"
                        >
                          <Eye size={16} className="text-blue-600" />
                        </button>
                        <button 
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                          className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${user.isActive ? 'hover:bg-amber-100' : 'hover:bg-green-100'}`}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? (
                            <EyeOff size={16} className="text-amber-600" />
                          ) : (
                            <Check size={16} className="text-green-600" />
                          )}
                        </button>
                        {user.isLocked && (
                          <button 
                            onClick={() => unlockUser(user.id)}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Unlock user"
                          >
                            <Unlock size={16} className="text-green-600" />
                          </button>
                        )}
                        <button 
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Reset password"
                        >
                          <Key size={16} className="text-slate-600" />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete user"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto text-blue-600 mb-2" size={32} />
              <div className="text-slate-500 text-sm">Loading users...</div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 text-base mb-2">No users found</div>
              <div className="text-slate-500 text-sm">Try adjusting your search or filters</div>
            </div>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * usersPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> users
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-slate-600" />
                </button>
              </div>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const userData = {
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  email: formData.get('email') as string,
                  role: formData.get('role') as string,
                };
                
                await addUser(userData);
                setShowAddModal(false);
                (e.target as HTMLFormElement).reset();
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {currentUser?.role === 'super_admin' ? (
                    <>
                      <option value="school_admin">School Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                    </>
                  ) : (
                    <>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">User Details</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} className="text-slate-600" />
                </button>
              </div>
            </div>
            
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const userData = {
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  email: formData.get('email') as string,
                  role: formData.get('role') as string,
                  isActive: editingUser.isActive,
                };
                
                await updateUser(editingUser.id, userData);
                setEditingUser(null);
              }}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    defaultValue={editingUser.firstName}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    defaultValue={editingUser.lastName}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {roleFilters.filter(f => f.value !== 'all').map(filter => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
              </div>

              {/* User Info Display */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Status:</span>
                  <span className={`font-medium ${getStatusColor(editingUser.displayStatus)}`}>
                    {editingUser.displayStatus}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">School:</span>
                  <span className="text-slate-900">{editingUser.schoolId ? editingUser.schoolName || 'Unknown' : 'Platform Level'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Sessions:</span>
                  <span className="text-slate-900">{editingUser.activeSessions} / {editingUser.maxSessions}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Login Attempts:</span>
                  <span className={`font-medium ${editingUser.loginAttempts > 3 ? 'text-red-600' : 'text-slate-900'}`}>
                    {editingUser.loginAttempts}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Email Verified:</span>
                  <span className="text-slate-900">{editingUser.emailVerified ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">2FA Enabled:</span>
                  <span className="text-slate-900">{editingUser.twoFactorEnabled ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
