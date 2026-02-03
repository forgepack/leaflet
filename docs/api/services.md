# Services

## Overview

The services module provides pre-configured service classes for common operations like authentication, CRUD operations, and token management.

## AuthService

Service class for handling authentication operations.

### Constructor

```typescript
class AuthService {
  constructor(api: AxiosInstance)
}
```

### Methods

#### login

Authenticates a user with credentials.

```typescript
async login(credentials: LoginCredentials): Promise<LoginResponse>
```

**Parameters:**
- `credentials` (LoginCredentials): User login credentials

**Returns:**
- `Promise<LoginResponse>`: Authentication response

**Example:**
```typescript
import { AuthService } from '@forgepack/request'

const authService = new AuthService(api)

const result = await authService.login({
  username: 'john.doe',
  password: 'securePassword123'
})

if (result.success) {
  console.log('Login successful:', result.data)
} else {
  console.error('Login failed:', result.errors)
}
```

#### logout

Logs out the current user.

```typescript
async logout(): Promise<void>
```

**Example:**
```typescript
await authService.logout()
console.log('User logged out successfully')
```

#### refreshToken

Refreshes the authentication token.

```typescript
async refreshToken(refreshToken: string): Promise<Auth | null>
```

**Parameters:**
- `refreshToken` (string): Refresh token

**Returns:**
- `Promise<Auth | null>`: New authentication data or null if failed

**Example:**
```typescript
const newAuth = await authService.refreshToken(currentRefreshToken)
if (newAuth) {
  console.log('Token refreshed:', newAuth.accessToken)
}
```

#### changePassword

Changes user password.

```typescript
async changePassword(data: ChangePasswordData): Promise<boolean>
```

**Parameters:**
- `data` (ChangePasswordData): Password change data

**Returns:**
- `Promise<boolean>`: Success status

**Example:**
```typescript
const success = await authService.changePassword({
  currentPassword: 'oldPassword',
  newPassword: 'newSecurePassword123',
  confirmPassword: 'newSecurePassword123'
})

if (success) {
  console.log('Password changed successfully')
}
```

---

## CrudService

Generic service class for CRUD operations.

### Constructor

```typescript
class CrudService<T = any> {
  constructor(api: AxiosInstance, baseEndpoint: string)
}
```

### Methods

#### findAll

Retrieves paginated list of items.

```typescript
async findAll(search?: Search): Promise<Page<T>>
```

**Parameters:**
- `search` (Search, optional): Search and pagination parameters

**Returns:**
- `Promise<Page<T>>`: Paginated response

**Example:**
```typescript
import { CrudService } from '@forgepack/request'

interface User {
  id: string
  name: string
  email: string
}

const userService = new CrudService<User>(api, 'users')

const users = await userService.findAll({
  page: 0,
  size: 10,
  value: 'john',
  sort: { key: 'name', order: 'ASC' }
})

console.log('Users:', users.content)
console.log('Total pages:', users.page.totalPages)
```

#### findById

Retrieves a single item by ID.

```typescript
async findById(id: string | number): Promise<T | null>
```

**Parameters:**
- `id` (string | number): Item ID

**Returns:**
- `Promise<T | null>`: Item data or null if not found

**Example:**
```typescript
const user = await userService.findById('user-123')
if (user) {
  console.log('User found:', user.name)
} else {
  console.log('User not found')
}
```

#### create

Creates a new item.

```typescript
async create(data: Partial<T>): Promise<T>
```

**Parameters:**
- `data` (Partial<T>): Item data to create

**Returns:**
- `Promise<T>`: Created item

**Example:**
```typescript
const newUser = await userService.create({
  name: 'Jane Doe',
  email: 'jane@example.com'
})

console.log('User created:', newUser.id)
```

#### update

Updates an existing item.

```typescript
async update(id: string | number, data: Partial<T>): Promise<T>
```

**Parameters:**
- `id` (string | number): Item ID
- `data` (Partial<T>): Data to update

**Returns:**
- `Promise<T>`: Updated item

**Example:**
```typescript
const updatedUser = await userService.update('user-123', {
  name: 'Jane Smith',
  email: 'jane.smith@example.com'
})

console.log('User updated:', updatedUser.name)
```

#### delete

Deletes an item by ID.

```typescript
async delete(id: string | number): Promise<boolean>
```

**Parameters:**
- `id` (string | number): Item ID

**Returns:**
- `Promise<boolean>`: Success status

**Example:**
```typescript
const success = await userService.delete('user-123')
if (success) {
  console.log('User deleted successfully')
}
```

#### bulkDelete

Deletes multiple items by IDs.

```typescript
async bulkDelete(ids: (string | number)[]): Promise<boolean>
```

**Parameters:**
- `ids` (Array): Array of item IDs

**Returns:**
- `Promise<boolean>`: Success status

**Example:**
```typescript
const success = await userService.bulkDelete(['user-1', 'user-2', 'user-3'])
if (success) {
  console.log('Users deleted successfully')
}
```

---

## TokenService

Service class for token management operations.

### Constructor

```typescript
class TokenService {
  constructor(api: AxiosInstance)
}
```

### Methods

#### validateToken

Validates if a token is still valid on the server.

```typescript
async validateToken(token: string): Promise<boolean>
```

**Parameters:**
- `token` (string): Token to validate

**Returns:**
- `Promise<boolean>`: Validation result

**Example:**
```typescript
import { TokenService } from '@forgepack/request'

const tokenService = new TokenService(api)
const isValid = await tokenService.validateToken(currentToken)

if (isValid) {
  console.log('Token is valid')
} else {
  console.log('Token is invalid or expired')
}
```

#### refreshToken

Refreshes an authentication token.

```typescript
async refreshToken(refreshToken: string): Promise<Auth | null>
```

**Parameters:**
- `refreshToken` (string): Refresh token

**Returns:**
- `Promise<Auth | null>`: New authentication data

**Example:**
```typescript
const newAuth = await tokenService.refreshToken(refreshToken)
if (newAuth) {
  console.log('Token refreshed successfully')
}
```

#### revokeToken

Revokes a token on the server.

```typescript
async revokeToken(token: string): Promise<boolean>
```

**Parameters:**
- `token` (string): Token to revoke

**Returns:**
- `Promise<boolean>`: Success status

**Example:**
```typescript
const success = await tokenService.revokeToken(token)
if (success) {
  console.log('Token revoked successfully')
}
```

---

## Service Factory

Factory function to create configured services.

### createServices

Creates all services with a shared API client.

```typescript
function createServices(api: AxiosInstance): Services
```

**Returns:**
```typescript
interface Services {
  auth: AuthService
  token: TokenService
  crud: <T = any>(endpoint: string) => CrudService<T>
}
```

**Example:**
```typescript
import { createServices, createApiClient } from '@forgepack/request'

const api = createApiClient({
  baseURL: 'https://api.example.com'
})

const services = createServices(api)

// Use auth service
const loginResult = await services.auth.login(credentials)

// Use token service
const isValid = await services.token.validateToken(token)

// Create CRUD service
const userService = services.crud<User>('users')
const users = await userService.findAll()
```

---

## Custom Service Example

Creating a custom service extending the base functionality:

```typescript
// src/services/UserService.ts
import { CrudService, type AxiosInstance } from '@forgepack/request'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isActive: boolean
  lastLogin?: string
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
}

class UserService extends CrudService<User> {
  constructor(api: AxiosInstance) {
    super(api, 'users')
  }

  // Custom method: Get user statistics
  async getStats(): Promise<UserStats> {
    const response = await this.api.get(`${this.baseEndpoint}/stats`)
    return response.data
  }

  // Custom method: Activate/deactivate user
  async toggleUserStatus(userId: string): Promise<User> {
    const response = await this.api.patch(`${this.baseEndpoint}/${userId}/toggle-status`)
    return response.data
  }

  // Custom method: Get users by role
  async findByRole(role: string): Promise<User[]> {
    const response = await this.api.get(`${this.baseEndpoint}/by-role/${role}`)
    return response.data
  }

  // Custom method: Upload user avatar
  async uploadAvatar(userId: string, file: File): Promise<User> {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await this.api.post(
      `${this.baseEndpoint}/${userId}/avatar`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
    
    return response.data
  }

  // Override create to add custom validation
  async create(data: Partial<User>): Promise<User> {
    // Custom validation
    if (!data.email?.includes('@')) {
      throw new Error('Invalid email format')
    }
    
    // Call parent create method
    return super.create(data)
  }
}

// Usage
const userService = new UserService(api)

// Use inherited methods
const users = await userService.findAll({ page: 0, size: 10 })

// Use custom methods
const stats = await userService.getStats()
const adminUsers = await userService.findByRole('ADMIN')
const updatedUser = await userService.toggleUserStatus('user-123')

console.log('User stats:', stats)
console.log('Admin users:', adminUsers.length)
```

## Service Composition Example

Using multiple services together in a React component:

```typescript
// src/hooks/useUserManagement.ts
import { useState, useEffect } from 'react'
import { createServices, createApiClient } from '@forgepack/request'

const api = createApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com'
})

const services = createServices(api)
const userService = services.crud<User>('users')

export const useUserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadUsers = async (search = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await userService.findAll(search)
      setUsers(response.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData) => {
    try {
      setLoading(true)
      const newUser = await userService.create(userData)
      setUsers(prev => [...prev, newUser])
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id, userData) => {
    try {
      setLoading(true)
      const updatedUser = await userService.update(id, userData)
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ))
      return updatedUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id) => {
    try {
      setLoading(true)
      await userService.delete(id)
      setUsers(prev => prev.filter(user => user.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    users,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
```