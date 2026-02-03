# Documentation - @forgepack/request

Complete documentation for the React package for HTTP request management with JWT authentication.

## 📚 Table of Contents

### Usage Guides
- [Installation and Setup](./getting-started.md)
- [Authentication](./authentication.md)  
- [Route Protection](./route-protection.md)
- [Requests and Pagination](./requests.md)
- [CRUD Operations](./crud-operations.md)
- [Token Management](./token-management.md)

### Practical Examples
- [Login Form](./examples/login-form.md)
- [Users List](./examples/users-list.md)
- [Complete Dashboard](./examples/dashboard.md)
- [User Service](./examples/user-service.md)

### API Reference
- [Hooks](./api/hooks.md)
- [Components](./api/components.md)
- [Services](./api/services.md)
- [TypeScript Types](./api/types.md)
- [Utilities](./api/utilities.md)

## 🚀 Main Features

- **🔐 JWT Authentication** - Complete system with automatic interceptors
- **🛡️ Route Protection** - Role-based access control
- **📊 Reactive Requests** - Hooks with automatic state
- **⚡ Simplified CRUD** - Standardized operations
- **🔑 Secure Tokens** - Automatic validation and management
- **📱 Responsive Interface** - Loading and error states

## 💡 Package Philosophy

This package was developed to eliminate common boilerplate in React applications that need:

1. **Secure JWT authentication** with automatic renewal
2. **HTTP interceptors** to add tokens automatically  
3. **State management** for requests
4. **Route protection** based on permissions
5. **CRUD operations** standardized and reusable

## 🎯 Ideal Use Cases

- SPA Applications (React, Next.js, Vite)
- Administrative dashboards
- User portals
- REST APIs with JWT authentication
- Systems with multiple permission levels

## 📋 Prerequisites

- React 18+
- React Router DOM 6+
- TypeScript (recommended)
- Native Fetch API (built into modern browsers)