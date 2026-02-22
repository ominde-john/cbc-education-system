
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Target,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DashboardWidgetsProps {
  onNavigate: (page: string) => void;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ onNavigate }) => {
  const widgets = [
    {
      title: 'Total Students',
      value: '1,247',
      change: '+15 this week',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500',
      page: 'students'
    },
    {
      title: 'Present Today',
      value: '1,156',
      change: '92.7% attendance',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'bg-green-500',
      page: 'attendance'
    },
    {
      title: 'Active Staff',
      value: '87',
      change: '3 new this month',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'bg-purple-500',
      page: 'teachers'
    },
    {
      title: 'Pending Assessments',
      value: '24',
      change: '8 due this week',
      changeType: 'warning' as const,
      icon: Target,
      color: 'bg-orange-500',
      page: 'cbc-assessment'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New Student Enrolled',
      details: 'Sarah Mwangi joined Grade 5A',
      time: '5 minutes ago',
      type: 'enrollment'
    },
    {
      id: 2,
      action: 'Assessment Completed',
      details: 'Grade 4 Mathematics assessment results available',
      time: '1 hour ago',
      type: 'assessment'
    },
    {
      id: 3,
      action: 'Fee Payment Received',
      details: 'Term 2 fees - John Kamau (Form 1B)',
      time: '2 hours ago',
      type: 'payment'
    },
    {
      id: 4,
      action: 'Staff Update',
      details: 'Mary Wanjiku updated attendance records',
      time: '3 hours ago',
      type: 'staff'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((widget, index) => (
          <Card 
            key={index}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onNavigate(widget.page)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{widget.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{widget.value}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className={`w-3 h-3 ${
                      widget.changeType === 'positive' ? 'text-green-600' : 
                      widget.changeType === 'warning' ? 'text-orange-600' : 'text-red-600'
                    }`} />
                    <span className={`text-xs ${
                      widget.changeType === 'positive' ? 'text-green-600' : 
                      widget.changeType === 'warning' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {widget.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${widget.color} rounded-lg flex items-center justify-center`}>
                  <widget.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'enrollment' ? 'bg-blue-500' :
                  activity.type === 'assessment' ? 'bg-green-500' :
                  activity.type === 'payment' ? 'bg-purple-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => onNavigate('new-student')}
              className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Add New Student</p>
                  <p className="text-sm text-gray-600">Register a new student</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => onNavigate('cbc-assessment')}
              className="w-full p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Create Assessment</p>
                  <p className="text-sm text-gray-600">Set up new assessment</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => onNavigate('reports')}
              className="w-full p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Generate Report</p>
                  <p className="text-sm text-gray-600">Create performance reports</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>System Status</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              All Systems Operational
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-gray-600">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Authentication</p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Backup</p>
                <p className="text-xs text-gray-600">Last: 2 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
