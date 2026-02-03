# Components

## Overview

The components module provides React components for authentication and route protection.

## AuthProvider

Context provider that manages authentication state throughout the application.

### Props

```typescript
interface AuthProviderProps {
  api: AxiosInstance        // Axios instance for API calls
  children: React.ReactNode // Child components
  onLogin?: () => void      // Optional callback after successful login
  onLogout?: () => void     // Optional callback after logout
}
```

### Usage

```tsx
import React from 'react'
import { AuthProvider, createApiClient } from '@forgepack/request'
import { App } from './App'

const api = createApiClient({
  baseURL: 'https://api.example.com'
})

function Root() {
  return (
    <AuthProvider 
      api={api}
      onLogin={() => console.log('User logged in')}
      onLogout={() => console.log('User logged out')}
    >
      <App />
    </AuthProvider>
  )
}
```

### Context Value

The AuthProvider provides the following context value:

```typescript
interface AuthContextValue {
  accessToken: string | null
  refreshToken: string | null
  tokenType: string
  role: string[]
  isAuthenticated: boolean
  loginUser: (credentials: LoginCredentials) => Promise<LoginResponse>
  logoutUser: () => void
  updateAuth: (auth: Auth) => void
}
```

---

## ProtectedRoute

Component that protects routes based on authentication and roles.

### Props

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]     // Optional roles required
  fallback?: React.ReactNode   // Component to show when access denied
  redirectTo?: string          // Path to redirect when unauthorized
}
```

### Basic Usage

```tsx
import React from 'react'
import { ProtectedRoute } from '@forgepack/request'
import { AdminDashboard } from './components/AdminDashboard'

function App() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
```

### Role-Based Protection

```tsx
import React from 'react'
import { ProtectedRoute } from '@forgepack/request'
import { AdminPanel } from './components/AdminPanel'

function AdminRoute() {
  return (
    <ProtectedRoute 
      requiredRoles={['ADMIN']}
      fallback={<div>You need admin privileges to access this page.</div>}
    >
      <AdminPanel />
    </ProtectedRoute>
  )
}
```

### Multiple Roles

```tsx
import React from 'react'
import { ProtectedRoute } from '@forgepack/request'
import { ManagementPanel } from './components/ManagementPanel'

function ManagementRoute() {
  return (
    <ProtectedRoute 
      requiredRoles={['ADMIN', 'MANAGER']}
      redirectTo="/access-denied"
    >
      <ManagementPanel />
    </ProtectedRoute>
  )
}
```

---

## LoadingSpinner

Reusable loading spinner component.

### Props

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  message?: string
}
```

### Usage

```tsx
import React from 'react'
import { LoadingSpinner } from '@forgepack/request'

function MyComponent() {
  return (
    <div>
      <LoadingSpinner 
        size="medium" 
        color="#007bff"
        message="Loading data..."
      />
    </div>
  )
}
```

---

## ErrorBoundary

Error boundary component for handling React errors gracefully.

### Props

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}
```

### Usage

```tsx
import React from 'react'
import { ErrorBoundary } from '@forgepack/request'
import { App } from './App'

function Root() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Application error:', error)
        // Send to error tracking service
      }}
    >
      <App />
    </ErrorBoundary>
  )
}
```

### Custom Fallback

```tsx
import React from 'react'
import { ErrorBoundary } from '@forgepack/request'

const ErrorFallback = ({ error, reset }) => (
  <div className="error-fallback">
    <h2>Something went wrong</h2>
    <pre>{error.message}</pre>
    <button onClick={reset}>Try again</button>
  </div>
)

function App() {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

---

## AuthGuard

Higher-order component for protecting components based on authentication.

### Usage

```tsx
import React from 'react'
import { AuthGuard } from '@forgepack/request'

const Dashboard = () => <div>Dashboard Content</div>

// Protect component
const ProtectedDashboard = AuthGuard(Dashboard)

// With options
const AdminDashboard = AuthGuard(Dashboard, {
  requiredRoles: ['ADMIN'],
  fallback: <div>Access denied</div>
})
```

---

## Complete Example: App with All Components

```tsx
// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { 
  AuthProvider, 
  ProtectedRoute, 
  ErrorBoundary,
  createApiClient 
} from '@forgepack/request'

// Pages
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { AdminPage } from './pages/AdminPage'
import { ProfilePage } from './pages/ProfilePage'

// Create API client
const api = createApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com',
  onUnauthorized: () => {
    window.location.href = '/login'
  },
  onForbidden: () => {
    console.warn('Access forbidden')
  }
})

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider api={api}>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin only route */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute 
                  requiredRoles={['ADMIN']}
                  fallback={<div>You need admin privileges</div>}
                >
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
```

## Component Styling

### Default CSS Classes

The package provides default CSS classes that you can customize:

```css
/* Loading Spinner */
.forgepack-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Boundary */
.forgepack-error-boundary {
  padding: 20px;
  border: 1px solid #dc3545;
  border-radius: 4px;
  background-color: #f8d7da;
  color: #721c24;
}

/* Protected Route Fallback */
.forgepack-access-denied {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}
```

### Custom Styling

```tsx
// Custom styled components
import styled from 'styled-components'
import { LoadingSpinner as BaseSpinner } from '@forgepack/request'

const CustomSpinner = styled(BaseSpinner)`
  .forgepack-spinner {
    border-top-color: #28a745;
    width: 60px;
    height: 60px;
  }
`
```