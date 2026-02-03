# Users List Example

## 📋 Basic Users List

Complete example of a users list component with pagination, search, and CRUD operations.

```tsx
// src/components/UsersList.tsx
import React, { useState, useEffect } from 'react'
import { useRequest, CrudService, createApiClient } from '@forgepack/request'

interface User {
  id: string
  name: string
  email: string
  role: string[]
  isActive: boolean
  createdAt: string
}

// Create API client and service
const api = createApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com'
})

const userService = new CrudService<User>(api, 'users')

export const UsersList: React.FC = () => {
  const [search, setSearch] = useState({
    page: 0,
    size: 10,
    value: '',
    sort: { key: 'name', order: 'ASC' as const }
  })

  const { response, error, loading, request } = useRequest(api, 'users', search)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Load users when component mounts or search changes
  useEffect(() => {
    request()
  }, [search])

  const handleSearch = (searchTerm: string) => {
    setSearch(prev => ({
      ...prev,
      value: searchTerm,
      page: 0 // Reset to first page
    }))
  }

  const handlePageChange = (newPage: number) => {
    setSearch(prev => ({ ...prev, page: newPage }))
  }

  const handleSortChange = (key: string) => {
    setSearch(prev => ({
      ...prev,
      sort: {
        key,
        order: prev.sort?.key === key && prev.sort.order === 'ASC' ? 'DESC' : 'ASC'
      }
    }))
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === response?.content.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(response?.content.map(user => user.id) || [])
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.delete(userId)
        request() // Refresh the list
        setSelectedUsers(prev => prev.filter(id => id !== userId))
      } catch (error) {
        console.error('Failed to delete user:', error)
        alert('Failed to delete user')
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return
    
    if (window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
      try {
        await userService.bulkDelete(selectedUsers)
        request() // Refresh the list
        setSelectedUsers([])
      } catch (error) {
        console.error('Failed to delete users:', error)
        alert('Failed to delete selected users')
      }
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = response?.content.find(u => u.id === userId)
      if (user) {
        await userService.update(userId, { isActive: !user.isActive })
        request() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error)
      alert('Failed to update user status')
    }
  }

  if (loading && !response) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading users...</div>
      </div>
    )
  }

  if (error && error.length > 0) {
    return (
      <div className="error-container">
        <h3>Error loading users:</h3>
        <ul>
          {error.map((err, index) => (
            <li key={index}>{err.message}</li>
          ))}
        </ul>
        <button onClick={request} className="retry-button">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h2>Users Management</h2>
        <div className="users-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={search.value}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {selectedUsers.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bulk-delete-button"
            >
              Delete Selected ({selectedUsers.length})
            </button>
          )}
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === response?.content.length && response.content.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th 
                className="sortable"
                onClick={() => handleSortChange('name')}
              >
                Name {search.sort?.key === 'name' && (
                  <span className={`sort-arrow ${search.sort.order.toLowerCase()}`}>
                    {search.sort.order === 'ASC' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th 
                className="sortable"
                onClick={() => handleSortChange('email')}
              >
                Email {search.sort?.key === 'email' && (
                  <span className={`sort-arrow ${search.sort.order.toLowerCase()}`}>
                    {search.sort.order === 'ASC' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Roles</th>
              <th>Status</th>
              <th 
                className="sortable"
                onClick={() => handleSortChange('createdAt')}
              >
                Created {search.sort?.key === 'createdAt' && (
                  <span className={`sort-arrow ${search.sort.order.toLowerCase()}`}>
                    {search.sort.order === 'ASC' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {response?.content.map((user) => (
              <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td className="user-name">{user.name}</td>
                <td className="user-email">{user.email}</td>
                <td>
                  <div className="user-roles">
                    {user.role.map((role, index) => (
                      <span key={index} className={`role-badge role-${role.toLowerCase()}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleUserStatus(user.id)}
                    className={`status-button ${user.isActive ? 'active' : 'inactive'}`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="user-created">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="user-actions">
                  <button 
                    onClick={() => console.log('Edit user:', user.id)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {response && (
        <div className="pagination-container">
          <div className="pagination-info">
            Showing {response.content.length} of {response.page.totalElements} users
            (Page {response.page.number + 1} of {response.page.totalPages})
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(0)}
              disabled={response.page.number === 0}
              className="pagination-button"
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(response.page.number - 1)}
              disabled={response.page.number === 0}
              className="pagination-button"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, response.page.totalPages) }, (_, i) => {
              const pageNum = Math.max(0, response.page.number - 2) + i
              if (pageNum < response.page.totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`pagination-button ${pageNum === response.page.number ? 'active' : ''}`}
                  >
                    {pageNum + 1}
                  </button>
                )
              }
              return null
            })}
            
            <button
              onClick={() => handlePageChange(response.page.number + 1)}
              disabled={response.page.number >= response.page.totalPages - 1}
              className="pagination-button"
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(response.page.totalPages - 1)}
              disabled={response.page.number >= response.page.totalPages - 1}
              className="pagination-button"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Updating...</div>
        </div>
      )}
    </div>
  )
}
```

## 🎨 CSS Styles

```css
/* src/components/UsersList.css */
.users-list-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.users-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.users-header h2 {
  margin: 0;
  color: #333;
}

.users-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;
}

.bulk-delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.bulk-delete-button:hover {
  background-color: #c82333;
}

.users-table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.users-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.users-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.users-table th.sortable:hover {
  background-color: #e9ecef;
}

.sort-arrow {
  margin-left: 5px;
  font-size: 12px;
}

.users-table tr:hover {
  background-color: #f8f9fa;
}

.users-table tr.selected {
  background-color: #e3f2fd;
}

.user-roles {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.role-badge {
  background-color: #6c757d;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.role-badge.role-admin {
  background-color: #dc3545;
}

.role-badge.role-manager {
  background-color: #fd7e14;
}

.role-badge.role-user {
  background-color: #28a745;
}

.status-button {
  border: none;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.status-button.active {
  background-color: #d4edda;
  color: #155724;
}

.status-button.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.edit-button,
.delete-button {
  padding: 4px 8px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.edit-button {
  background-color: #007bff;
  color: white;
}

.edit-button:hover {
  background-color: #0056b3;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.pagination-info {
  color: #6c757d;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.pagination-button {
  padding: 6px 12px;
  border: 1px solid #dee2e6;
  background-color: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e9ecef;
}

.pagination-button:disabled {
  color: #6c757d;
  cursor: not-allowed;
}

.pagination-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.loading-container,
.error-container {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.retry-button:hover {
  background-color: #0056b3;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-overlay .loading-spinner {
  width: 40px;
  height: 40px;
  border-width: 4px;
}
```

## 📱 Responsive Version

```tsx
// src/components/UsersListMobile.tsx
import React from 'react'
import { UsersList } from './UsersList'

export const UsersListMobile: React.FC = () => {
  // ... same logic as UsersList

  return (
    <div className="users-list-mobile">
      <div className="mobile-header">
        <h2>Users</h2>
        <button className="add-user-button">Add User</button>
      </div>

      <div className="mobile-search">
        <input
          type="text"
          placeholder="Search users..."
          value={search.value}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="mobile-users-list">
        {response?.content.map((user) => (
          <div key={user.id} className="mobile-user-card">
            <div className="user-card-header">
              <h3>{user.name}</h3>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleSelectUser(user.id)}
              />
            </div>
            <div className="user-card-content">
              <p className="user-email">{user.email}</p>
              <div className="user-roles-mobile">
                {user.role.map((role, index) => (
                  <span key={index} className={`role-badge role-${role.toLowerCase()}`}>
                    {role}
                  </span>
                ))}
              </div>
              <div className="user-card-actions">
                <button 
                  className={`status-toggle ${user.isActive ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleUserStatus(user.id)}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile pagination */}
      <div className="mobile-pagination">
        <button
          onClick={() => handlePageChange(search.page - 1)}
          disabled={search.page === 0}
        >
          Previous
        </button>
        <span>Page {search.page + 1} of {response?.page.totalPages || 1}</span>
        <button
          onClick={() => handlePageChange(search.page + 1)}
          disabled={search.page >= (response?.page.totalPages || 1) - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

## 🚀 Usage in App

```tsx
// src/pages/UsersPage.tsx
import React from 'react'
import { ProtectedRoute } from '@forgepack/request'
import { UsersList } from '../components/UsersList'

export const UsersPage: React.FC = () => {
  return (
    <ProtectedRoute requiredRoles={['ADMIN', 'MANAGER']}>
      <div className="page-container">
        <UsersList />
      </div>
    </ProtectedRoute>
  )
}
```