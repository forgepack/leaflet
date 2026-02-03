# Utilities

## Overview

Utility functions and helpers for working with @forgepack/leaflet components.

## File Processing

## Functions

### isValidToken

Validates if a JWT token is valid and not expired.

```typescript
function isValidToken(token: string): boolean
```

**Parameters:**
- `token` (string): JWT token to validate

**Returns:**
- `boolean`: `true` if token is valid and not expired, `false` otherwise

**Example:**
```typescript
import { isValidToken } from '@forgepack/request'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const valid = isValidToken(token)

if (valid) {
  console.log('Token is valid')
} else {
  console.log('Token is expired or invalid')
}
```

---

### decodeToken

Decodes a JWT token and returns its payload.

```typescript
function decodeToken<T = any>(token: string): T | null
```

**Parameters:**
- `token` (string): JWT token to decode

**Returns:**
- `T | null`: Decoded payload or null if invalid

**Example:**
```typescript
import { decodeToken } from '@forgepack/request'

interface TokenPayload {
  sub: string
  roles: string[]
  exp: number
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const payload = decodeToken<TokenPayload>(token)

if (payload) {
  console.log('User ID:', payload.sub)
  console.log('Roles:', payload.roles)
  console.log('Expires at:', new Date(payload.exp * 1000))
}
```

---

### formatTokenExpiration

Formats token expiration time to a human-readable string.

```typescript
function formatTokenExpiration(token: string): string | null
```

**Parameters:**
- `token` (string): JWT token

**Returns:**
- `string | null`: Formatted expiration time or null if invalid

**Example:**
```typescript
import { formatTokenExpiration } from '@forgepack/request'

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
const expiration = formatTokenExpiration(token)

console.log('Token expires:', expiration) // "2024-12-31 23:59:59"
```

---

### createApiClient

Factory function to create a configured Axios instance with interceptors.

```typescript
function createApiClient(config: ApiClientConfig): AxiosInstance
```

**Parameters:**
- `config` (ApiClientConfig): Configuration object

**ApiClientConfig Interface:**
```typescript
interface ApiClientConfig {
  baseURL: string
  timeout?: number
  onUnauthorized?: () => void
  onForbidden?: () => void
  onError?: (error: any) => void
}
```

**Returns:**
- `AxiosInstance`: Configured Axios instance

**Example:**
```typescript
import { createApiClient } from '@forgepack/request'

const api = createApiClient({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  onUnauthorized: () => {
    // Redirect to login
    window.location.href = '/login'
  },
  onForbidden: () => {
    // Show access denied message
    alert('Access denied')
  },
  onError: (error) => {
    // Log error
    console.error('API Error:', error)
  }
})
```

---

### getTokenFromStorage

Retrieves authentication token from localStorage.

```typescript
function getTokenFromStorage(): string | null
```

**Returns:**
- `string | null`: Token from storage or null if not found

**Example:**
```typescript
import { getTokenFromStorage } from '@forgepack/request'

const token = getTokenFromStorage()
if (token) {
  console.log('Token found:', token)
} else {
  console.log('No token in storage')
}
```

---

### setTokenToStorage

Stores authentication token in localStorage.

```typescript
function setTokenToStorage(token: string): void
```

**Parameters:**
- `token` (string): Token to store

**Example:**
```typescript
import { setTokenToStorage } from '@forgepack/request'

const newToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
setTokenToStorage(newToken)
console.log('Token stored successfully')
```

---

### clearTokenFromStorage

Removes authentication token from localStorage.

```typescript
function clearTokenFromStorage(): void
```

**Example:**
```typescript
import { clearTokenFromStorage } from '@forgepack/request'

clearTokenFromStorage()
console.log('Token cleared from storage')
```

---

### hasRole

Checks if user has a specific role.

```typescript
function hasRole(userRoles: string[], requiredRole: string): boolean
```

**Parameters:**
- `userRoles` (string[]): Array of user roles
- `requiredRole` (string): Role to check

**Returns:**
- `boolean`: `true` if user has the role, `false` otherwise

**Example:**
```typescript
import { hasRole } from '@forgepack/request'

const userRoles = ['USER', 'ADMIN']
const isAdmin = hasRole(userRoles, 'ADMIN') // true
const isManager = hasRole(userRoles, 'MANAGER') // false

if (isAdmin) {
  console.log('User is admin')
}
```

---

### hasAnyRole

Checks if user has any of the specified roles.

```typescript
function hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean
```

**Parameters:**
- `userRoles` (string[]): Array of user roles
- `requiredRoles` (string[]): Array of roles to check

**Returns:**
- `boolean`: `true` if user has any of the roles, `false` otherwise

**Example:**
```typescript
import { hasAnyRole } from '@forgepack/request'

const userRoles = ['USER']
const canAccess = hasAnyRole(userRoles, ['ADMIN', 'MANAGER']) // false
const canView = hasAnyRole(userRoles, ['USER', 'GUEST']) // true

if (canView) {
  console.log('User can view content')
}
```

## Constants

### DEFAULT_PAGE_SIZE

Default page size for pagination.

```typescript
const DEFAULT_PAGE_SIZE = 10
```

### TOKEN_STORAGE_KEY

Key used to store tokens in localStorage.

```typescript
const TOKEN_STORAGE_KEY = '@forgepack/request:token'
```

### REFRESH_TOKEN_STORAGE_KEY

Key used to store refresh tokens in localStorage.

```typescript
const REFRESH_TOKEN_STORAGE_KEY = '@forgepack/request:refresh-token'
```

## Usage Examples

### Custom Hook with Utilities

```typescript
// src/hooks/useTokenValidation.ts
import { useState, useEffect } from 'react'
import { isValidToken, getTokenFromStorage } from '@forgepack/request'

export const useTokenValidation = () => {
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const token = getTokenFromStorage()
    const valid = token ? isValidToken(token) : false
    setIsValid(valid)
  }, [])

  return isValid
}
```

### Role-Based Component

```typescript
// src/components/RoleGuard.tsx
import React from 'react'
import { useAuth, hasRole } from '@forgepack/request'

interface RoleGuardProps {
  requiredRole: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  requiredRole,
  children,
  fallback = <div>Access denied</div>
}) => {
  const { role } = useAuth()
  
  if (!hasRole(role, requiredRole)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Usage
<RoleGuard requiredRole="ADMIN">
  <AdminPanel />
</RoleGuard>
```