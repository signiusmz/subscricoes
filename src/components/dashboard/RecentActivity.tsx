import React from 'react';
import { Clock, User, FileText, Bell } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'client' | 'service' | 'notification';
  message: string;
  time: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'client',
    message: 'Novo cliente registado: Maria João',
    time: '2 horas atrás'
  },
  {
    id: '2',
    type: 'service',
    message: 'Serviço de contabilidade renovado automaticamente',
    time: '4 horas atrás'
  },
  {
    id: '3',
    type: 'notification',
    message: 'Lembrete de renovação enviado para 5 clientes',
    time: '6 horas atrás'
  },
  {
    id: '4',
    type: 'client',
    message: 'Cliente António Silva atualizou dados',
    time: '1 dia atrás'
  },
  {
    id: '5',
    type: 'service',
    message: 'Novo serviço criado: Auditoria Fiscal',
    time: '1 dia atrás'
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
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
      
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">{activity.message}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Ver toda a atividade →
        </button>
      </div>
    </div>
  );
};