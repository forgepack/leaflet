# TypeScript Types

## Overview

Complete TypeScript type definitions for @forgepack/leaflet components and utilities.

## Core Types

### UseMapReturn

Return interface for the useMap hook:

```typescript
interface Auth {
  readonly accessToken: string  // JWT access token
  refreshToken: string         // Token for renewal
  tokenType: string           // Token type (Bearer)
  role: string[]             // User permissions
}
```

**Example:**
```typescript
const auth: Auth = {
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "refresh_token_here",
  tokenType: "Bearer",
  role: ["USER", "ADMIN"]
}
```

### LoginCredentials

Interface for login credentials.

```typescript
interface LoginCredentials {
  username: string  // Username or email
  password: string  // User password
}
```

### LoginResponse

Interface for typed login response.

```typescript
interface LoginResponse {
  success: boolean                              // Indicates success
  data?: Auth                                  // Auth data (if success)
  errors?: Array<{ field: string; message: string }> // Errors (if failure)
}
```

**Example:**
```typescript
const result: LoginResponse = await loginUser({ 
  username: "user", 
  password: "pass" 
})

if (result.success && result.data) {
  console.log('Token:', result.data.accessToken)
} else if (result.errors) {
  console.error('Errors:', result.errors)
}
```

### ChangePasswordData

Interface for password change.

```typescript
interface ChangePasswordData {
  currentPassword: string      // Current password
  newPassword: string         // New password
  confirmPassword?: string    // Confirmation (optional)
}
```

---

### ErrorMessage

Interface for validation error messages.

```typescript
interface ErrorMessage {
  field: string    // Field containing the error
  message: string  // Descriptive message
}
```

**Example:**
```typescript
const errors: ErrorMessage[] = [
  { field: "username", message: "Username is required" },
  { field: "password", message: "Password must have at least 6 characters" }
]
```

---

### Search

Interface para parâmetros de busca e paginação.

```typescript
interface Search {
  value?: string    // Termo de busca
  page?: number     // Número da página (base 0)
  size?: number     // Quantidade de itens por página
  sort?: Sort       // Configuração de ordenação
}

interface Sort {
  key: string                // Campo para ordenação
  order: 'ASC' | 'DESC'     // Direção da ordenação
}
```

**Exemplo:**
```typescript
const searchParams: Search = {
  value: "João",
  page: 0,
  size: 20,
  sort: {
    key: "name",
    order: "ASC"
  }
}
```

---

### Page

Interface genérica para respostas paginadas.

```typescript
interface Page<T = unknown> {
  content: T[]     // Array com os dados da página
  page: PageInfo   // Informações de paginação
}

interface PageInfo {
  size: number           // Tamanho da página
  number: number         // Número da página atual
  totalElements: number  // Total de elementos
  totalPages: number     // Total de páginas
}
```

**Exemplo:**
```typescript
const usersPage: Page<User> = {
  content: [
    { id: 1, name: "João", email: "joao@email.com" },
    { id: 2, name: "Maria", email: "maria@email.com" }
  ],
  page: {
    size: 10,
    number: 0,
    totalElements: 50,
    totalPages: 5
  }
}
```

---

### Token

Interfaces para estrutura de tokens JWT.

```typescript
interface Token {
  header: Header      // Cabeçalho do token
  payload: Payload    // Dados do token
  signature: string   // Assinatura
}

interface Header {
  alg: string  // Algoritmo (ex: "HS256")
  typ: string  // Tipo (ex: "JWT")
}

interface Payload {
  jti: string   // ID único do token
  iss: string   // Emissor
  iat: number   // Data de emissão (timestamp Unix)
  nbf: number   // Não válido antes de (timestamp Unix)
  exp: number   // Data de expiração (timestamp Unix)
  sub: string   // Subject (ID do usuário)
  aud: string   // Audiência
}
```

**Exemplo:**
```typescript
const payload: Payload = {
  jti: "unique-token-id",
  iss: "https://auth.exemplo.com",
  iat: 1674567890,  // Timestamp Unix
  nbf: 1674567890,
  exp: 1674654290,  // 24h depois
  sub: "user123",
  aud: "https://api.exemplo.com"
}

// Verificar se token está expirado
const isExpired = payload.exp * 1000 < Date.now()
```

---

### AuthContextType

Interface do contexto de autenticação que estende `Auth`.

```typescript
interface AuthContextType extends Auth {
  loginUser: (credentials: any) => Promise<any>  // Função de login
  logoutUser: () => void                        // Função de logout
  isAuthenticated: boolean                      // Status de autenticação
}
```

---

### ApiClientOptions

Opções para configuração do cliente da API.

```typescript
type ApiClientOptions = {
  baseURL: string                    // URL base da API
  onUnauthorized?: () => void        // Callback para erro 401
  onForbidden?: () => void          // Callback para erro 403
}
```

---

## Utilitários de Tipo

### Exemplos de Uso em Componentes

```typescript
import type { 
  Auth, 
  ErrorMessage, 
  Search, 
  Page,
  AuthContextType 
} from '@forgepack/request'

// Propriedades de componente
interface UserListProps {
  searchParams: Search
  onError: (errors: ErrorMessage[]) => void
}

// Estado de componente
interface LoginState {
  user: Auth | null
  errors: ErrorMessage[]
  loading: boolean
}

// Hook personalizado
const useUserData = (): {
  users: Page<User>
  loading: boolean
  search: (params: Search) => void
} => {
  // implementação
}

// Contexto tipado
const useTypedAuth = (): AuthContextType => {
  return useAuth()
}
```

### Generic Types

```typescript
// Função genérica para CRUD
const createEntity = async <T>(
  api: AxiosInstance, 
  endpoint: string, 
  data: T
): Promise<T | ErrorMessage[]> => {
  // implementação
}

// Hook genérico para listagem
const useEntityList = <T>(
  endpoint: string, 
  search?: Search
): {
  data: Page<T>
  loading: boolean
  error: ErrorMessage[]
} => {
  // implementação
}
```

### Type Guards

```typescript
// Verificar se é erro
const isErrorArray = (result: any): result is ErrorMessage[] => {
  return Array.isArray(result) && 
         result.length > 0 && 
         'field' in result[0] && 
         'message' in result[0]
}

// Verificar se tem dados
const hasContent = <T>(page: Page<T>): boolean => {
  return page.content.length > 0
}

// Uso
const result = await createUser(userData)

if (isErrorArray(result)) {
  // Tratar erros
  console.error(result)
} else {
  // Usuário criado com sucesso
  console.log(result)
}
```