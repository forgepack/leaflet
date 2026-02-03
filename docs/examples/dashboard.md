# Complete Dashboard Example

## 🏠 Dashboard Overview

A comprehensive dashboard example showcasing authentication, data fetching, charts, and real-time updates.

```tsx
// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react'
import { useAuth, useRequest, ProtectedRoute, createApiClient } from '@forgepack/request'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalOrders: number
  revenue: number
  growthRate: number
}

interface RecentActivity {
  id: string
  type: 'user_login' | 'new_order' | 'user_register' | 'payment'
  user: string
  message: string
  timestamp: string
}

interface ChartData {
  date: string
  users: number
  orders: number
  revenue: number
}

// Create API client
const api = createApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com'
})

export const Dashboard: React.FC = () => {
  const { role, isAuthenticated, logoutUser } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  // Fetch dashboard statistics
  const {
    response: stats,
    error: statsError,
    loading: statsLoading,
    request: requestStats
  } = useRequest<DashboardStats>(api, 'dashboard/stats')

  // Fetch recent activities
  const {
    response: activities,
    error: activitiesError,
    loading: activitiesLoading,
    request: requestActivities
  } = useRequest<{ content: RecentActivity[] }>(api, 'dashboard/activities', {
    size: 10,
    page: 0
  })

  // Fetch chart data
  const {
    response: chartData,
    error: chartError,
    loading: chartLoading,
    request: requestChart
  } = useRequest<ChartData[]>(api, `dashboard/chart/${selectedPeriod}`)

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      requestStats()
      requestActivities()
      requestChart()
    }, 30000)

    return () => clearInterval(interval)
  }, [selectedPeriod])

  // Refresh chart data when period changes
  useEffect(() => {
    requestChart()
  }, [selectedPeriod])

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
  }

  if (!isAuthenticated) {
    return <div>Please log in to access the dashboard</div>
  }

  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Dashboard</h1>
            <div className="user-info">
              <span>Welcome back!</span>
              <div className="user-roles">
                {role.map((r, index) => (
                  <span key={index} className={`role-badge role-${r.toLowerCase()}`}>
                    {r}
                  </span>
                ))}
              </div>
              <button onClick={logoutUser} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <h2>Overview</h2>
          {statsLoading ? (
            <div className="stats-loading">
              <div className="loading-spinner">Loading statistics...</div>
            </div>
          ) : statsError && statsError.length > 0 ? (
            <div className="stats-error">
              <p>Error loading statistics</p>
              <button onClick={requestStats}>Retry</button>
            </div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon users-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
                  <small className="stat-subtitle">
                    {stats.activeUsers} active now
                  </small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orders-icon">📦</div>
                <div className="stat-content">
                  <h3>Total Orders</h3>
                  <p className="stat-number">{stats.totalOrders.toLocaleString()}</p>
                  <small className="stat-subtitle">
                    +{stats.growthRate}% from last month
                  </small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon revenue-icon">💰</div>
                <div className="stat-content">
                  <h3>Revenue</h3>
                  <p className="stat-number">
                    ${stats.revenue.toLocaleString()}
                  </p>
                  <small className="stat-subtitle">
                    Monthly total
                  </small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon growth-icon">📈</div>
                <div className="stat-content">
                  <h3>Growth Rate</h3>
                  <p className="stat-number">+{stats.growthRate}%</p>
                  <small className="stat-subtitle">
                    Compared to last month
                  </small>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-header">
            <h2>Analytics</h2>
            <div className="period-selector">
              {['7d', '30d', '90d', '1y'].map(period => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`period-button ${selectedPeriod === period ? 'active' : ''}`}
                >
                  {period === '7d' ? '7 Days' : 
                   period === '30d' ? '30 Days' : 
                   period === '90d' ? '90 Days' : '1 Year'}
                </button>
              ))}
            </div>
          </div>

          {chartLoading ? (
            <div className="chart-loading">
              <div className="loading-spinner">Loading chart data...</div>
            </div>
          ) : chartError && chartError.length > 0 ? (
            <div className="chart-error">
              <p>Error loading chart data</p>
              <button onClick={requestChart}>Retry</button>
            </div>
          ) : chartData && chartData.length > 0 ? (
            <div className="chart-container">
              <SimpleLineChart data={chartData} />
            </div>
          ) : (
            <div className="no-chart-data">
              <p>No data available for the selected period</p>
            </div>
          )}
        </div>

        <div className="dashboard-content">
          {/* Recent Activities */}
          <div className="activities-section">
            <h2>Recent Activity</h2>
            {activitiesLoading ? (
              <div className="activities-loading">
                <div className="loading-spinner">Loading activities...</div>
              </div>
            ) : activitiesError && activitiesError.length > 0 ? (
              <div className="activities-error">
                <p>Error loading activities</p>
                <button onClick={requestActivities}>Retry</button>
              </div>
            ) : activities?.content && activities.content.length > 0 ? (
              <div className="activities-list">
                {activities.content.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon ${activity.type}`}>
                      {activity.type === 'user_login' && '🔐'}
                      {activity.type === 'new_order' && '🛒'}
                      {activity.type === 'user_register' && '👤'}
                      {activity.type === 'payment' && '💳'}
                    </div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <small className="activity-time">
                        {formatTimeAgo(activity.timestamp)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-activities">
                <p>No recent activities</p>
              </div>
            )}
          </div>

          {/* Quick Actions - Only for Admins */}
          {role.includes('ADMIN') && (
            <div className="quick-actions-section">
              <h2>Quick Actions</h2>
              <div className="action-buttons">
                <button 
                  onClick={() => window.location.href = '/users'}
                  className="action-button users-action"
                >
                  <span>👥</span>
                  Manage Users
                </button>
                <button 
                  onClick={() => window.location.href = '/orders'}
                  className="action-button orders-action"
                >
                  <span>📦</span>
                  View Orders
                </button>
                <button 
                  onClick={() => window.location.href = '/settings'}
                  className="action-button settings-action"
                >
                  <span>⚙️</span>
                  Settings
                </button>
                <button 
                  onClick={() => window.location.href = '/reports'}
                  className="action-button reports-action"
                >
                  <span>📊</span>
                  Reports
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Simple Line Chart Component
const SimpleLineChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.users, d.orders, d.revenue)))
  const chartHeight = 200

  return (
    <div className="simple-chart">
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color users"></div>
          <span>Users</span>
        </div>
        <div className="legend-item">
          <div className="legend-color orders"></div>
          <span>Orders</span>
        </div>
        <div className="legend-item">
          <div className="legend-color revenue"></div>
          <span>Revenue</span>
        </div>
      </div>
      
      <svg width="100%" height={chartHeight} className="chart-svg">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(percent => (
          <line
            key={percent}
            x1="0"
            y1={chartHeight * percent}
            x2="100%"
            y2={chartHeight * percent}
            stroke="#f0f0f0"
            strokeWidth="1"
          />
        ))}
        
        {/* Data lines */}
        {data.length > 1 && (
          <>
            {/* Users line */}
            <polyline
              fill="none"
              stroke="#007bff"
              strokeWidth="2"
              points={data.map((d, i) => 
                `${(i / (data.length - 1)) * 100}%,${chartHeight - (d.users / maxValue) * chartHeight}`
              ).join(' ')}
            />
            
            {/* Orders line */}
            <polyline
              fill="none"
              stroke="#28a745"
              strokeWidth="2"
              points={data.map((d, i) => 
                `${(i / (data.length - 1)) * 100}%,${chartHeight - (d.orders / maxValue) * chartHeight}`
              ).join(' ')}
            />
            
            {/* Revenue line */}
            <polyline
              fill="none"
              stroke="#ffc107"
              strokeWidth="2"
              points={data.map((d, i) => 
                `${(i / (data.length - 1)) * 100}%,${chartHeight - (d.revenue / maxValue) * chartHeight}`
              ).join(' ')}
            />
          </>
        )}
        
        {/* Data points */}
        {data.map((d, i) => (
          <g key={i}>
            <circle
              cx={`${(i / Math.max(data.length - 1, 1)) * 100}%`}
              cy={chartHeight - (d.users / maxValue) * chartHeight}
              r="3"
              fill="#007bff"
            />
            <circle
              cx={`${(i / Math.max(data.length - 1, 1)) * 100}%`}
              cy={chartHeight - (d.orders / maxValue) * chartHeight}
              r="3"
              fill="#28a745"
            />
            <circle
              cx={`${(i / Math.max(data.length - 1, 1)) * 100}%`}
              cy={chartHeight - (d.revenue / maxValue) * chartHeight}
              r="3"
              fill="#ffc107"
            />
          </g>
        ))}
      </svg>
      
      {/* X-axis labels */}
      <div className="chart-x-axis">
        {data.map((d, i) => (
          <span key={i} style={{ left: `${(i / Math.max(data.length - 1, 1)) * 100}%` }}>
            {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        ))}
      </div>
    </div>
  )
}

// Utility function to format time ago
const formatTimeAgo = (timestamp: string): string => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}
```

## 🎨 Dashboard Styles

```css
/* src/pages/Dashboard.css */
.dashboard-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.dashboard-header {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-roles {
  display: flex;
  gap: 4px;
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

.logout-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-button:hover {
  background-color: #c82333;
}

.stats-section,
.charts-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats-section h2,
.charts-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.stat-icon {
  font-size: 48px;
  margin-right: 20px;
  opacity: 0.7;
}

.stat-content h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
}

.stat-number {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stat-subtitle {
  color: #6c757d;
  font-size: 12px;
}

.charts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.period-selector {
  display: flex;
  gap: 8px;
}

.period-button {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  background: white;
  color: #007bff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.period-button:hover {
  background-color: #e9ecef;
}

.period-button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.chart-container {
  height: 300px;
  position: relative;
}

.simple-chart {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-legend {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.users {
  background-color: #007bff;
}

.legend-color.orders {
  background-color: #28a745;
}

.legend-color.revenue {
  background-color: #ffc107;
}

.chart-svg {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.chart-x-axis {
  position: relative;
  height: 20px;
  margin-top: 5px;
}

.chart-x-axis span {
  position: absolute;
  transform: translateX(-50%);
  font-size: 12px;
  color: #6c757d;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

.activities-section,
.quick-actions-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.activities-section h2,
.quick-actions-section h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.activities-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-message {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.activity-time {
  color: #6c757d;
  font-size: 12px;
}

.action-buttons {
  display: grid;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid #dee2e6;
  background: white;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.action-button span {
  font-size: 18px;
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

.stats-loading,
.activities-loading,
.chart-loading {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.stats-error,
.activities-error,
.chart-error {
  text-align: center;
  padding: 20px;
  color: #dc3545;
}

.no-activities,
.no-chart-data {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .dashboard-header h1 {
    font-size: 24px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 15px;
  }
  
  .stat-icon {
    font-size: 36px;
    margin-right: 15px;
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .charts-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .period-selector {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .user-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}
```

## 🚀 Usage

```tsx
// src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, createApiClient } from '@forgepack/request'
import { Dashboard } from './pages/Dashboard'
import { LoginPage } from './pages/LoginPage'

const api = createApiClient({
  baseURL: process.env.REACT_APP_API_URL || 'https://api.example.com'
})

function App() {
  return (
    <BrowserRouter>
      <AuthProvider api={api}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
```