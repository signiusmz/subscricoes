import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Wind, Eye, MapPin, Thermometer, Droplets, Gauge } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  humidity: number;
  windSpeed: number;
  description: string;
}

const motivationalQuotes = [
  "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "A persistência é o caminho do êxito.",
  "Grandes realizações requerem grandes ambições.",
  "O futuro pertence àqueles que acreditam na beleza dos seus sonhos.",
  "A única forma de fazer um excelente trabalho é amar o que você faz.",
  "Não espere por oportunidades, crie-as.",
  "O progresso é impossível sem mudança.",
  "A disciplina é a ponte entre objetivos e conquistas.",
  "Cada dia é uma nova oportunidade para crescer.",
  "A excelência não é um ato, mas um hábito.",
  "O conhecimento é poder, mas a aplicação é sabedoria.",
  "Transforme obstáculos em oportunidades.",
  "A inovação distingue líderes de seguidores.",
  "O trabalho em equipe faz o sonho funcionar.",
  "A qualidade nunca é um acidente, é sempre resultado de esforço inteligente.",
  "Seja a mudança que você quer ver no mundo.",
  "O tempo é o recurso mais valioso que temos.",
  "A satisfação do cliente é a nossa maior prioridade.",
  "Crescer juntos é o nosso compromisso.",
  "A tecnologia a serviço do seu negócio.",
  "Automatizar para prosperar.",
  "Cada cliente é uma oportunidade de excelência.",
  "A eficiência é fazer as coisas certas da forma certa.",
  "Dados transformam decisões em resultados."
];

export const DashboardHeader: React.FC = () => {
  const { user, company } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    location: 'Maputo, Moçambique',
    temperature: 28,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    description: 'Ensolarado'
  });
  const [currentQuote, setCurrentQuote] = useState('');

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Update quote every hour
  useEffect(() => {
    const updateQuote = () => {
      const hour = new Date().getHours();
      const quoteIndex = hour % motivationalQuotes.length;
      setCurrentQuote(motivationalQuotes[quoteIndex]);
    };

    updateQuote();
    
    // Update quote every hour
    const quoteTimer = setInterval(updateQuote, 3600000);
    
    return () => clearInterval(quoteTimer);
  }, []);

  // Simulate weather updates
  useEffect(() => {
    const updateWeather = () => {
      const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'windy'];
      const descriptions = {
        sunny: 'Ensolarado',
        cloudy: 'Nublado',
        rainy: 'Chuvoso',
        windy: 'Ventoso'
      };
      
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      const baseTemp = 25;
      const tempVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
      
      setWeather({
        location: 'Maputo, Moçambique',
        temperature: baseTemp + tempVariation,
        condition: randomCondition,
        humidity: 60 + Math.floor(Math.random() * 30), // 60-90%
        windSpeed: 8 + Math.floor(Math.random() * 15), // 8-23 km/h
        description: descriptions[randomCondition]
      });
    };

    // Update weather every 30 minutes
    const weatherTimer = setInterval(updateWeather, 1800000);
    
    return () => clearInterval(weatherTimer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="text-yellow-500" size={24} />;
      case 'cloudy':
        return <Cloud className="text-gray-500" size={24} />;
      case 'rainy':
        return <CloudRain className="text-blue-500" size={24} />;
      case 'windy':
        return <Wind className="text-gray-600" size={24} />;
      default:
        return <Sun className="text-yellow-500" size={24} />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white rounded-xl p-8 mb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full translate-x-24 translate-y-24"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full opacity-50"></div>
      </div>

      <div className="relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          {/* Greeting Section */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {getGreeting()}, {user?.name?.split(' ')[0] || 'Utilizador'}! 👋
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                Bem-vindo ao painel de gestão da {company?.name || 'sua empresa'}
              </p>
              <div className="flex items-center gap-4 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{formatTime(currentTime)}</span>
                </div>
                <div className="hidden sm:block">•</div>
                <div className="hidden sm:block">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-yellow-900 font-bold text-sm">💡</span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm mb-1">Frase do Momento</p>
                  <p className="text-blue-100 italic leading-relaxed">
                    "{currentQuote}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weather Section */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin size={16} className="text-blue-200" />
                  <span className="text-blue-100 text-sm">{weather.location}</span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-3">
                  {getWeatherIcon(weather.condition)}
                  <span className="text-3xl font-bold text-white">{weather.temperature}°C</span>
                </div>
                <p className="text-blue-100 text-sm font-medium">{weather.description}</p>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2 text-blue-100">
                  <Droplets size={14} />
                  <span>Humidade: {weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Wind size={14} />
                  <span>Vento: {weather.windSpeed} km/h</span>
                </div>
              </div>

              {/* Weather Tip */}
              <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                <p className="text-blue-100 text-xs text-center">
                  {weather.condition === 'sunny' && '☀️ Ótimo dia para novos negócios!'}
                  {weather.condition === 'cloudy' && '☁️ Dia perfeito para planeamento!'}
                  {weather.condition === 'rainy' && '🌧️ Tempo ideal para trabalho interno!'}
                  {weather.condition === 'windy' && '💨 Energia renovada para o dia!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="mt-6 pt-6 border-t border-white border-opacity-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center cursor-pointer">
            <div>
              <p className="text-2xl font-bold text-white">45</p>
              <p className="text-blue-200 text-sm">Clientes Ativos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">78</p>
              <p className="text-blue-200 text-sm">Serviços</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-blue-200 text-sm">A Expirar</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">8.4</p>
              <p className="text-blue-200 text-sm">Satisfação Média</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};