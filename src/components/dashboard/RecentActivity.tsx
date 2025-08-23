import React from 'react';
import { Clock, User, FileText, Bell, TrendingUp, DollarSign, UserPlus, RefreshCw } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'client' | 'service' | 'notification' | 'payment' | 'renewal';
  message: string;
  time: string;
  value?: number;
  status?: 'success' | 'pending' | 'warning';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'service',
    message: 'Sistema iniciado com sucesso',
    time: 'Agora mesmo',
    status: 'success'
  }
];

export const RecentActivity: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'client':
        return <User size={16} className="text-blue-600" />;
      case 'service':
        return <FileText size={16} className="text-green-600" />;
      case 'notification':
        return <Bell size={16} className="text-orange-600" />;
      case 'payment':
        return <DollarSign size={16} className="text-emerald-600" />;
      case 'renewal':
        return <RefreshCw size={16} className="text-purple-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'border-l-green-400 bg-green-50';
      case 'warning':
        return 'border-l-orange-400 bg-orange-50';
      case 'pending':
        return 'border-l-blue-400 bg-blue-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Atividade Recente</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Ao vivo</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all hover:shadow-sm ${getStatusColor(activity.status)}`}>
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-900 mb-1 flex-1">{activity.message}</p>
                {activity.value && (
                  <span className="text-sm font-semibold text-gray-900 ml-2">
                    {activity.value.toLocaleString()} MT
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          onClick={() => {
            // Trigger navigation to activity history
            const event = new CustomEvent('openActivityHistory');
            window.dispatchEvent(event);
          }}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 group"
        >
          <TrendingUp size={14} className="group-hover:translate-x-1 transition-transform" />
          Ver toda a atividade →
        </button>
      </div>
    </div>
  );
};