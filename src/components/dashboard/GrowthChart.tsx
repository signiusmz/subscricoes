import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Calendar, DollarSign, Users, Activity, Eye } from 'lucide-react';

interface ChartData {
  month: string;
  revenue: number;
  clients: number;
  services: number;
  growth: number;
}

const mockChartData: ChartData[] = [
  { month: 'Jan', revenue: 180000, clients: 35, services: 65, growth: 0 },
  { month: 'Fev', revenue: 195000, clients: 38, services: 70, growth: 8.3 },
  { month: 'Mar', revenue: 210000, clients: 42, services: 75, growth: 7.7 },
  { month: 'Abr', revenue: 225000, clients: 45, services: 78, growth: 7.1 },
  { month: 'Mai', revenue: 240000, clients: 48, services: 82, growth: 6.7 },
  { month: 'Jun', revenue: 255000, clients: 52, services: 85, growth: 6.3 }
];

type ChartType = 'revenue' | 'clients' | 'services';

export const GrowthChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState<ChartType>('revenue');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Animate chart on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeChart]);

  const getChartData = () => {
    switch (activeChart) {
      case 'revenue':
        return mockChartData.map(d => ({ ...d, value: d.revenue }));
      case 'clients':
        return mockChartData.map(d => ({ ...d, value: d.clients }));
      case 'services':
        return mockChartData.map(d => ({ ...d, value: d.services }));
      default:
        return mockChartData.map(d => ({ ...d, value: d.revenue }));
    }
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));

  const getBarHeight = (value: number) => {
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    return Math.max(percentage * 0.8, 10); // Minimum 10% height
  };

  const getChartColor = () => {
    switch (activeChart) {
      case 'revenue':
        return 'bg-blue-500';
      case 'clients':
        return 'bg-green-500';
      case 'services':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getChartGradient = () => {
    switch (activeChart) {
      case 'revenue':
        return 'from-blue-500 to-blue-600';
      case 'clients':
        return 'from-green-500 to-green-600';
      case 'services':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const formatValue = (value: number) => {
    switch (activeChart) {
      case 'revenue':
        return `${(value / 1000).toFixed(0)}K MT`;
      case 'clients':
        return `${value} clientes`;
      case 'services':
        return `${value} serviços`;
      default:
        return value.toString();
    }
  };

  const getIcon = () => {
    switch (activeChart) {
      case 'revenue':
        return <DollarSign size={16} />;
      case 'clients':
        return <Users size={16} />;
      case 'services':
        return <Activity size={16} />;
      default:
        return <BarChart3 size={16} />;
    }
  };

  const getTitle = () => {
    switch (activeChart) {
      case 'revenue':
        return 'Receita Mensal';
      case 'clients':
        return 'Crescimento de Clientes';
      case 'services':
        return 'Crescimento de Serviços';
      default:
        return 'Gráfico de Crescimento';
    }
  };

  const currentGrowth = chartData[chartData.length - 1]?.growth || 0;
  const isPositiveGrowth = currentGrowth >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getChartGradient()} flex items-center justify-center text-white`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{getTitle()}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Últimos 6 meses</span>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                isPositiveGrowth ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositiveGrowth ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(currentGrowth).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Type Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          {[
            { type: 'revenue' as ChartType, label: 'Receita', icon: DollarSign },
            { type: 'clients' as ChartType, label: 'Clientes', icon: Users },
            { type: 'services' as ChartType, label: 'Serviços', icon: Activity }
          ].map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                onClick={() => {
                  setActiveChart(option.type);
                  setAnimationProgress(0);
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  activeChart === option.type
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={14} />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        {/* Chart Container */}
        <div className="h-64 bg-gradient-to-t from-gray-50 to-transparent rounded-lg p-4 relative overflow-hidden">
          {/* Grid Lines */}
          <div className="absolute inset-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-gray-200 border-dashed"
                style={{ top: `${i * 25}%` }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="relative h-full flex items-end justify-between gap-2">
            {chartData.map((data, index) => {
              const barHeight = getBarHeight(data.value);
              const isHovered = hoveredIndex === index;
              
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 flex-1 relative group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap z-10">
                      <div className="font-medium">{data.month} 2024</div>
                      <div>{formatValue(data.value)}</div>
                      {data.growth !== 0 && (
                        <div className={`flex items-center gap-1 ${
                          data.growth >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {data.growth >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {Math.abs(data.growth).toFixed(1)}%
                        </div>
                      )}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                  
                  {/* Bar */}
                  <div
                    className={`w-full max-w-12 bg-gradient-to-t ${getChartGradient()} rounded-t-md transition-all duration-1000 ease-out cursor-pointer ${
                      isHovered ? 'shadow-lg scale-105' : 'hover:shadow-md'
                    }`}
                    style={{ 
                      height: `${(barHeight * animationProgress) / 100}%`,
                      minHeight: '8px'
                    }}
                  />
                  
                  {/* Month Label */}
                  <span className="text-xs text-gray-600 font-medium">
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Y-axis Labels */}
          <div className="absolute left-0 top-4 bottom-8 flex flex-col justify-between text-xs text-gray-500">
            {[...Array(5)].map((_, i) => {
              const value = maxValue - ((maxValue - minValue) * i / 4);
              return (
                <span key={i} className="transform -translate-y-1/2">
                  {activeChart === 'revenue' ? `${(value / 1000).toFixed(0)}K` : value.toFixed(0)}
                </span>
              );
            })}
          </div>
        </div>

        {/* Chart Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="text-green-600" size={16} />
              <span className="text-sm font-medium text-gray-700">Maior Crescimento</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {Math.max(...mockChartData.map(d => d.growth)).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {mockChartData.find(d => d.growth === Math.max(...mockChartData.map(d => d.growth)))?.month}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-gray-700">Média Mensal</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatValue(chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length)}
            </div>
            <div className="text-xs text-gray-500">6 meses</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="text-purple-600" size={16} />
              <span className="text-sm font-medium text-gray-700">Tendência</span>
            </div>
            <div className={`text-lg font-bold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveGrowth ? 'Crescimento' : 'Declínio'}
            </div>
            <div className="text-xs text-gray-500">
              {Math.abs(currentGrowth).toFixed(1)}% este mês
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getChartGradient()}`}></div>
            <span>{getTitle()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={12} />
            <span>Passe o mouse sobre as barras para detalhes</span>
          </div>
        </div>
      </div>
    </div>
  );
};