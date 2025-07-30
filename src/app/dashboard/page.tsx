'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/services/auth';
import ProtectedRoute from '@/components/auth/protected-route';
import { ModeToggle } from '@/components/theme/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getInitials } from '@/lib/utils';
import { 
  Home, 
  Settings, 
  LogOut, 
  User, 
  Activity,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Bell
} from 'lucide-react';

function DashboardContent() {
  const router = useRouter();
  const { user, userData, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Example data - in a real app, this would come from your API
  const stats = {
    totalUsers: 1234,
    activeProjects: 12,
    completedTasks: 89,
    uptime: 99.9
  };

  const recentActivity = [
    { id: 1, action: 'Project created', timestamp: '2 hours ago', type: 'create' },
    { id: 2, action: 'User invited', timestamp: '4 hours ago', type: 'user' },
    { id: 3, action: 'Task completed', timestamp: '1 day ago', type: 'complete' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <ModeToggle />
            <Avatar>
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback>
                {userData ? getInitials(`${userData.firstName} ${userData.lastName}`) : '?'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Welcome back, {userData?.firstName || 'User'}!
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+23</span> this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uptime}%</div>
              <Badge variant="outline" className="mt-1">Operational</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="text-2xl">
                    {userData ? getInitials(`${userData.firstName} ${userData.lastName}`) : '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    {userData?.role || 'user'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last login</span>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {activity.type === 'create' && <FileText className="h-4 w-4" />}
                      {activity.type === 'user' && <User className="h-4 w-4" />}
                      {activity.type === 'complete' && <Activity className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View all activity
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and navigation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Home
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
                <Button variant="outline" className="justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start text-red-600 hover:text-red-700 dark:text-red-400"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Next steps to customize your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Template Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Authentication with Firebase (or mock service)</li>
                  <li>✓ Protected routes and user management</li>
                  <li>✓ Dark mode support with theme switching</li>
                  <li>✓ Responsive design with Tailwind CSS</li>
                  <li>✓ TypeScript for type safety</li>
                  <li>✓ AI-ready with Claude Code integration</li>
                </ul>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  This dashboard is a starting point. Customize it with your own data and features.
                </p>
                <Button asChild>
                  <Link href="/docs">
                    Read Documentation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}