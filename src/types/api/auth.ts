export interface User {
  username: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface DashboardData {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalProjects: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: string;
    user: string;
  }>;
}
