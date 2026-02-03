# User Service Example

## 🛠️ Complete User Service Implementation

A comprehensive user service example demonstrating all CRUD operations, custom methods, and integration patterns.

```typescript
// src/services/UserService.ts
import { 
  CrudService, 
  AuthService, 
  type AxiosInstance, 
  type Search, 
  type Page 
} from '@forgepack/request'

// User interface
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: string[]
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
  metadata?: {
    preferences: Record<string, any>
    settings: Record<string, any>
  }
}

// User creation/update data
export interface CreateUserData {
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  role: string[]
  isActive?: boolean
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  avatar?: string
  metadata?: {
    preferences?: Record<string, any>
    settings?: Record<string, any>
  }
}

// User statistics
export interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  usersByRole: Record<string, number>
  registrationTrend: {
    date: string
    count: number
  }[]
}

// Advanced search parameters
export interface UserSearchParams extends Search {
  role?: string[]
  isActive?: boolean
  createdAfter?: string
  createdBefore?: string
  hasAvatar?: boolean
}

/**
 * Comprehensive User Service
 * Extends CrudService with custom user-specific operations
 */
export class UserService extends CrudService<User> {
  private authService: AuthService

  constructor(api: AxiosInstance) {
    super(api, 'users')
    this.authService = new AuthService(api)
  }

  /**
   * Create a new user with password validation
   */
  async createUser(userData: CreateUserData): Promise<User> {
    // Client-side validation
    this.validateUserData(userData)
    
    try {
      const response = await this.api.post<User>(this.baseEndpoint, userData)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('User with this email or username already exists')
      }
      throw error
    }
  }

  /**
   * Update user with optimistic updates
   */
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const response = await this.api.patch<User>(`${this.baseEndpoint}/${id}`, userData)
      return response.data
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('User not found')
      }
      if (error.response?.status === 409) {
        throw new Error('Email or username already taken')
      }
      throw error
    }
  }

  /**
   * Advanced search with filters
   */
  async searchUsers(params: UserSearchParams): Promise<Page<User>> {
    const queryParams = new URLSearchParams()
    
    // Basic pagination
    if (params.page !== undefined) queryParams.append('page', params.page.toString())
    if (params.size !== undefined) queryParams.append('size', params.size.toString())
    if (params.value) queryParams.append('search', params.value)
    
    // Sorting
    if (params.sort) {
      queryParams.append('sort', `${params.sort.key},${params.sort.order}`)
    }
    
    // Advanced filters
    if (params.role && params.role.length > 0) {
      params.role.forEach(role => queryParams.append('role', role))
    }
    if (params.isActive !== undefined) {
      queryParams.append('active', params.isActive.toString())
    }
    if (params.createdAfter) queryParams.append('createdAfter', params.createdAfter)
    if (params.createdBefore) queryParams.append('createdBefore', params.createdBefore)
    if (params.hasAvatar !== undefined) {
      queryParams.append('hasAvatar', params.hasAvatar.toString())
    }

    const response = await this.api.get<Page<User>>(`${this.baseEndpoint}?${queryParams}`)
    return response.data
  }

  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    const response = await this.api.get<UserStats>(`${this.baseEndpoint}/stats`)
    return response.data
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    const response = await this.api.get<User[]>(`${this.baseEndpoint}/by-role/${role}`)
    return response.data
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(userId: string): Promise<User> {
    const response = await this.api.patch<User>(`${this.baseEndpoint}/${userId}/toggle-status`)
    return response.data
  }

  /**
   * Bulk operations
   */
  async bulkUpdateUsers(userIds: string[], updateData: Partial<UpdateUserData>): Promise<User[]> {
    const response = await this.api.patch<User[]>(`${this.baseEndpoint}/bulk-update`, {
      userIds,
      updateData
    })
    return response.data
  }

  async bulkDeleteUsers(userIds: string[]): Promise<boolean> {
    try {
      await this.api.delete(`${this.baseEndpoint}/bulk-delete`, {
        data: { userIds }
      })
      return true
    } catch (error) {
      console.error('Bulk delete failed:', error)
      return false
    }
  }

  /**
   * Avatar management
   */
  async uploadAvatar(userId: string, file: File): Promise<User> {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await this.api.post<User>(
      `${this.baseEndpoint}/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    return response.data
  }

  async deleteAvatar(userId: string): Promise<User> {
    const response = await this.api.delete<User>(`${this.baseEndpoint}/${userId}/avatar`)
    return response.data
  }

  /**
   * Password management
   */
  async changeUserPassword(userId: string, newPassword: string): Promise<boolean> {
    try {
      await this.api.patch(`${this.baseEndpoint}/${userId}/password`, {
        password: newPassword
      })
      return true
    } catch (error) {
      console.error('Password change failed:', error)
      return false
    }
  }

  async resetUserPassword(userId: string): Promise<{ temporaryPassword: string }> {
    const response = await this.api.post<{ temporaryPassword: string }>(
      `${this.baseEndpoint}/${userId}/reset-password`
    )
    return response.data
  }

  /**
   * User preferences and settings
   */
  async updateUserPreferences(userId: string, preferences: Record<string, any>): Promise<User> {
    const response = await this.api.patch<User>(`${this.baseEndpoint}/${userId}/preferences`, {
      preferences
    })
    return response.data
  }

  async updateUserSettings(userId: string, settings: Record<string, any>): Promise<User> {
    const response = await this.api.patch<User>(`${this.baseEndpoint}/${userId}/settings`, {
      settings
    })
    return response.data
  }

  /**
   * User activity tracking
   */
  async getUserLoginHistory(userId: string, limit: number = 10): Promise<{
    id: string
    loginTime: string
    ipAddress: string
    userAgent: string
    location?: string
  }[]> {
    const response = await this.api.get(
      `${this.baseEndpoint}/${userId}/login-history?limit=${limit}`
    )
    return response.data
  }

  /**
   * User impersonation (admin feature)
   */
  async impersonateUser(userId: string): Promise<{ token: string }> {
    const response = await this.api.post<{ token: string }>(
      `${this.baseEndpoint}/${userId}/impersonate`
    )
    return response.data
  }

  /**
   * Export users data
   */
  async exportUsers(format: 'csv' | 'excel' | 'pdf' = 'csv', filters?: UserSearchParams): Promise<Blob> {
    const queryParams = new URLSearchParams({ format })
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()))
          } else {
            queryParams.append(key, value.toString())
          }
        }
      })
    }

    const response = await this.api.get(`${this.baseEndpoint}/export?${queryParams}`, {
      responseType: 'blob'
    })
    
    return response.data
  }

  /**
   * User validation
   */
  async validateUsername(username: string): Promise<{ available: boolean }> {
    const response = await this.api.get<{ available: boolean }>(
      `${this.baseEndpoint}/validate-username?username=${encodeURIComponent(username)}`
    )
    return response.data
  }

  async validateEmail(email: string): Promise<{ available: boolean }> {
    const response = await this.api.get<{ available: boolean }>(
      `${this.baseEndpoint}/validate-email?email=${encodeURIComponent(email)}`
    )
    return response.data
  }

  /**
   * Private validation method
   */
  private validateUserData(userData: CreateUserData): void {
    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Valid email is required')
    }
    
    if (!userData.username || userData.username.length < 3) {
      throw new Error('Username must be at least 3 characters long')
    }
    
    if (!userData.password || userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }
    
    if (!userData.firstName || !userData.lastName) {
      throw new Error('First name and last name are required')
    }
    
    if (!userData.role || userData.role.length === 0) {
      throw new Error('At least one role is required')
    }
  }

  /**
   * Get current user profile (requires authentication)
   */
  async getCurrentUserProfile(): Promise<User> {
    const response = await this.api.get<User>(`${this.baseEndpoint}/me`)
    return response.data
  }

  /**
   * Update current user profile
   */
  async updateCurrentUserProfile(userData: Partial<UpdateUserData>): Promise<User> {
    const response = await this.api.patch<User>(`${this.baseEndpoint}/me`, userData)
    return response.data
  }
}
```

## 🎯 React Hook Integration

```typescript
// src/hooks/useUserService.ts
import { useState, useEffect, useCallback } from 'react'
import { UserService, User, UserSearchParams, UserStats } from '../services/UserService'
import { createApiClient } from '@forgepack/request'

const api = createApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com'
})

const userService = new UserService(api)

export const useUserService = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((error: any) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    setError(message)
    console.error('UserService error:', error)
  }, [])

  const loadUsers = useCallback(async (searchParams?: UserSearchParams) => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.searchUsers(searchParams || {})
      setUsers(response.content)
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const createUser = useCallback(async (userData: any) => {
    try {
      setLoading(true)
      setError(null)
      const newUser = await userService.createUser(userData)
      setUsers(prev => [newUser, ...prev])
      return newUser
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const updateUser = useCallback(async (id: string, userData: any) => {
    try {
      setLoading(true)
      setError(null)
      const updatedUser = await userService.updateUser(id, userData)
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user))
      return updatedUser
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await userService.delete(id)
      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (error) {
      handleError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const toggleUserStatus = useCallback(async (id: string) => {
    try {
      setError(null)
      const updatedUser = await userService.toggleUserStatus(id)
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user))
      return updatedUser
    } catch (error) {
      handleError(error)
      throw error
    }
  }, [handleError])

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    userService // Direct access to service for advanced operations
  }
}

// Hook for user statistics
export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const userStats = await userService.getUserStats()
      setStats(userStats)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  return { stats, loading, error, refresh: loadStats }
}
```

## 📋 Component Usage Example

```tsx
// src/components/UserManagement.tsx
import React, { useState, useEffect } from 'react'
import { useUserService, useUserStats } from '../hooks/useUserService'
import { UserSearchParams } from '../services/UserService'

export const UserManagement: React.FC = () => {
  const { users, loading, error, loadUsers, createUser, updateUser, deleteUser, toggleUserStatus } = useUserService()
  const { stats, loading: statsLoading } = useUserStats()
  
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    page: 0,
    size: 10,
    value: '',
    sort: { key: 'createdAt', order: 'DESC' }
  })

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  useEffect(() => {
    loadUsers(searchParams)
  }, [loadUsers, searchParams])

  const handleSearch = (searchTerm: string) => {
    setSearchParams(prev => ({
      ...prev,
      value: searchTerm,
      page: 0
    }))
  }

  const handleRoleFilter = (roles: string[]) => {
    setSearchParams(prev => ({
      ...prev,
      role: roles.length > 0 ? roles : undefined,
      page: 0
    }))
  }

  const handleStatusFilter = (isActive?: boolean) => {
    setSearchParams(prev => ({
      ...prev,
      isActive,
      page: 0
    }))
  }

  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData)
      alert('User created successfully')
    } catch (error) {
      alert('Failed to create user')
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedUsers.length === 0) return
    
    if (window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
      try {
        // Delete users one by one (could be optimized with bulk delete)
        await Promise.all(selectedUsers.map(id => deleteUser(id)))
        setSelectedUsers([])
        alert('Users deleted successfully')
      } catch (error) {
        alert('Failed to delete some users')
      }
    }
  }

  return (
    <div className="user-management">
      {/* Statistics Section */}
      {stats && !statsLoading && (
        <div className="stats-overview">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
          </div>
          <div className="stat-card">
            <h3>New This Month</h3>
            <p>{stats.newUsersThisMonth}</p>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="filters-section">
        <input
          type="text"
          placeholder="Search users..."
          value={searchParams.value || ''}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        
        <select onChange={(e) => handleStatusFilter(
          e.target.value === '' ? undefined : e.target.value === 'true'
        )}>
          <option value="">All Users</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>

        <select multiple onChange={(e) => {
          const selectedRoles = Array.from(e.target.selectedOptions, option => option.value)
          handleRoleFilter(selectedRoles)
        }}>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* Actions Section */}
      <div className="actions-section">
        <button onClick={() => {/* Open create user modal */}}>
          Create User
        </button>
        
        {selectedUsers.length > 0 && (
          <button onClick={handleDeleteSelected} className="danger">
            Delete Selected ({selectedUsers.length})
          </button>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="loading">Loading users...</div>
      ) : error ? (
        <div className="error">
          Error: {error}
          <button onClick={() => loadUsers(searchParams)}>Retry</button>
        </div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(users.map(u => u.id))
                      } else {
                        setSelectedUsers([])
                      }
                    }}
                    checked={selectedUsers.length === users.length && users.length > 0}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(prev => [...prev, user.id])
                        } else {
                          setSelectedUsers(prev => prev.filter(id => id !== user.id))
                        }
                      }}
                    />
                  </td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.role.join(', ')}</td>
                  <td>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={user.isActive ? 'active' : 'inactive'}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => {/* Edit user */}}>Edit</button>
                    <button 
                      onClick={() => deleteUser(user.id)}
                      className="danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
```

## 🧪 Testing Example

```typescript
// src/services/__tests__/UserService.test.ts
import { UserService } from '../UserService'
import { createApiClient } from '@forgepack/request'

describe('UserService', () => {
  let userService: UserService
  let mockApi: any

  beforeEach(() => {
    mockApi = {
      get: jest.fn(),
      post: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn()
    }
    userService = new UserService(mockApi)
  })

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        username: 'john_doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'securePassword123',
        role: ['USER']
      }

      const expectedUser = { ...userData, id: '123', createdAt: new Date().toISOString() }
      mockApi.post.mockResolvedValue({ data: expectedUser })

      const result = await userService.createUser(userData)

      expect(mockApi.post).toHaveBeenCalledWith('users', userData)
      expect(result).toEqual(expectedUser)
    })

    it('should validate user data', async () => {
      const invalidUserData = {
        username: 'jo', // too short
        email: 'invalid-email',
        firstName: '',
        lastName: 'Doe',
        password: '123', // too short
        role: []
      }

      await expect(userService.createUser(invalidUserData)).rejects.toThrow()
    })
  })

  describe('searchUsers', () => {
    it('should search users with filters', async () => {
      const searchParams = {
        value: 'john',
        role: ['USER'],
        isActive: true,
        page: 0,
        size: 10
      }

      const expectedResponse = {
        content: [],
        page: {
          size: 10,
          number: 0,
          totalElements: 0,
          totalPages: 0
        }
      }

      mockApi.get.mockResolvedValue({ data: expectedResponse })

      const result = await userService.searchUsers(searchParams)

      expect(mockApi.get).toHaveBeenCalled()
      expect(result).toEqual(expectedResponse)
    })
  })
})
```

This comprehensive UserService example demonstrates:

1. **Complete CRUD operations** with validation
2. **Advanced search and filtering** capabilities
3. **Bulk operations** for efficiency
4. **File upload** handling for avatars
5. **Password management** features
6. **User preferences** and settings
7. **Activity tracking** and history
8. **Data export** functionality
9. **Real-time validation** for usernames/emails
10. **React hooks integration** for easy component usage
11. **Error handling** throughout
12. **Unit testing** examples
13. **TypeScript types** for better development experience