# Hooks

## useAuth

Main hook for authentication management.

### Return

| Property | Type | Description |
|----------|------|-------------|
| `accessToken` | `string` | Current JWT token |
| `refreshToken` | `string` | Refresh token |
| `tokenType` | `string` | Token type (Bearer) |
| `role` | `string[]` | User permissions |
| `loginUser` | `(credentials: any) => Promise<any>` | Login function |
| `logoutUser` | `() => void` | Logout function |
| `isAuthenticated` | `boolean` | Authentication status |

### Example

```tsx
import { useAuth } from '@forgepack/request'

const { loginUser, logoutUser, isAuthenticated, role } = useAuth()
```

---

## useRequest

Hook for paginated HTTP requests with automatic state management.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api` | `AxiosInstance` | ✅ | Axios instance |
| `endpoint` | `string` | ✅ | API endpoint |
| `search` | `Search` | ❌ | Search parameters |

### Return

| Property | Type | Description |
|----------|------|-------------|
| `response` | `Page<T>` | Paginated response data |
| `error` | `ErrorMessage[]` | Error array |
| `loading` | `boolean` | Loading state |
| `request` | `() => Promise<void>` | Function to re-execute |

### Example

```tsx
import { useRequest } from '@forgepack/request'
import { api } from '../services/api'

const { response, error, loading, request } = useRequest(api, 'users', {
  page: 0,
  size: 10,
  value: 'search term'
})
```

### Search Interface

```typescript
interface Search {
  value?: string     // Search term
  page?: number      // Page (0-based)
  size?: number      // Items per page
  sort?: {           // Sorting
    key: string
    order: 'ASC' | 'DESC'
  }
}
```

### Page Interface

```typescript
interface Page<T = unknown> {
  content: T[]       // Page data
  page: {
    size: number           // Page size
    number: number         // Current page number
    totalElements: number  // Total elements
    totalPages: number     // Total pages
  }
}
```

---

## Custom Hook - useAuthStatus

Example of custom hook using the package:

```tsx
// src/hooks/useAuthStatus.ts
import { useAuth, isValidToken } from '@forgepack/request'

export const useAuthStatus = () => {
  const auth = useAuth()
  
  return {
    ...auth,
    isTokenValid: isValidToken(),
    hasRole: (role: string) => auth.role.includes(role),
    hasAnyRole: (roles: string[]) => roles.some(role => auth.role.includes(role)),
    isAdmin: auth.role.includes('ADMIN'),
    isUser: auth.role.includes('USER')
  }
}
```