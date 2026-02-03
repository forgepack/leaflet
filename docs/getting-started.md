# Installation and Setup

## 📦 Installation

```bash
# npm
npm install @forgepack/request

# yarn
yarn add @forgepack/request

# pnpm
pnpm add @forgepack/request
```

## ⚙️ Initial Setup

### 1. API Client

First, configure the Axios client with automatic interceptors:

```typescript
// src/api.ts
import { createApiClient } from "@forgepack/request"

export const api = createApiClient({
  baseURL: "https://api.service.com",
  /** Called on 401 errors (expired token) */
  onUnauthorized: () => window.location.href = "/login",
  /** Called on 403 errors (without permission) */
  onForbidden: () => window.location.href = "/notAllowed"
})
```

### 2. Authentication Provider

Configure the `AuthProvider` at the root of your application:

```tsx
// src/App.tsx
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@forgepack/request'
import { api } from './api'
import { AppRoutes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider api={api}>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
```

### 3. Configuration for Next.js

```tsx
// pages/_app.tsx
import type { AppProps } from 'next/app'
import { AuthProvider, createApiClient } from '@forgepack/request'

const api = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  onUnauthorized: () => {
    window.location.href = "/login"
  }
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider api={api}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
```

### 4. Configuration for Vite

```tsx
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, createApiClient } from '@forgepack/request'
import App from './App.tsx'

const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  onUnauthorized: () => window.location.href = "/login"
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider api={api}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```
