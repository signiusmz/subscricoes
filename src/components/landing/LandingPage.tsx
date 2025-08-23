import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Bell, 
  Shield, 
  Zap, 
  CreditCard,
  Star,
  ChevronDown,
  ChevronUp,
  MapPin,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  Calendar,
  Play,
  ChevronLeft,
  ChevronRight,
  Building,
  Heart,
  Wifi,
  Car,
  Dumbbell,
  Calculator,
  BarChart3,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { TawkToChat } from '../common/TawkToChat';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const heroSlides = [
    {
      id: 1,
      icon: Building,
      title: 'Empresas de Manutenção',
      subtitle: 'Contratos de manutenção predial e equipamentos',
      description: 'Gerencie contratos de manutenção preventiva e corretiva com renovações automáticas. Nunca mais perca um contrato por falta de acompanhamento.',
      color: 'from-blue-600 to-blue-800'
    },
    {
      id: 2,
      icon: Heart,
      title: 'Clínicas e Centros de Saúde',
      subtitle: 'Planos de saúde e consultas recorrentes',
      description: 'Automatize o acompanhamento de planos de saúde, consultas de rotina e tratamentos contínuos. Mantenha seus pacientes sempre informados.',
      color: 'from-green-600 to-green-800'
    },
    {
      id: 3,
      icon: Wifi,
      title: 'Empresas de Telecomunicações',
      subtitle: 'Pacotes de internet e telefonia',
      description: 'Controle assinaturas de internet, telefonia e TV. Gerencie upgrades, downgrades e renovações de forma automatizada.',
      color: 'from-purple-600 to-purple-800'
    },
    {
      id: 4,
      icon: Shield,
      title: 'Seguradoras',
      subtitle: 'Apólices e renovações automáticas',
      description: 'Mantenha todas as apólices de seguro organizadas com lembretes automáticos de renovação. Reduza a inadimplência e aumente a retenção.',
      color: 'from-orange-600 to-orange-800'
    },
    {
      id: 5,
      icon: Dumbbell,
      title: 'Academias e Centros Fitness',
      subtitle: 'Mensalidades e planos fitness',
      description: 'Gerencie mensalidades, planos especiais e personal trainers. Automatize cobranças e mantenha seus alunos sempre ativos.',
      color: 'from-red-600 to-red-800'
    },
    {
      id: 6,
      icon: Calculator,
      title: 'Escritórios de Contabilidade',
      subtitle: 'Serviços contábeis mensais',
      description: 'Organize todos os clientes contábeis com serviços recorrentes. Automatize lembretes de entrega de documentos e renovações de contratos.',
      color: 'from-indigo-600 to-indigo-800'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-advance slides
  React.useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const empresas = [
    { nome: 'Manutenção', descricao: 'Contratos de manutenção predial e equipamentos' },
    { nome: 'Clínicas', descricao: 'Planos de saúde e consultas recorrentes' },
    { nome: 'Telecom', descricao: 'Pacotes de internet e telefonia' },
    { nome: 'Seguros', descricao: 'Apólices e renovações automáticas' },
    { nome: 'Academias', descricao: 'Mensalidades e planos fitness' },
    { nome: 'SaaS', descricao: 'Software como serviço' },
    { nome: 'Contabilidade', descricao: 'Serviços contábeis mensais' },
    { nome: 'Estética', descricao: 'Tratamentos e procedimentos' },
    { nome: 'Frotas', descricao: 'Gestão de veículos empresariais' }
  ];

  const funcionalidades = [
    {
      icon: Users,
      titulo: 'Gestão Inteligente de Subscrições',
      descricao: 'Controle completo de contratos com renovações automáticas e análise preditiva de churn'
    },
    {
      icon: Users,
      titulo: 'Gestão de Clientes',
      descricao: 'CRM avançado com segmentação automática, análise de LTV e portal exclusivo para clientes'
    },
    {
      icon: Bell,
      titulo: 'Comunicação Multi-Canal',
      descricao: 'Fluxos personalizados de comunicação via Email, WhatsApp e SMS com templates dinâmicos'
    },
    {
      icon: Shield,
      titulo: 'Segurança Empresarial',
      descricao: 'Sistema multi-tenant com controle granular de permissões e auditoria completa'
    },
    {
      icon: Zap,
      titulo: 'Automação Avançada',
      descricao: 'Gatilhos inteligentes, fluxos personalizados e automação completa de processos'
    },
    {
      icon: CreditCard,
      titulo: 'Facturação Inteligente',
      descricao: 'Geração automática de facturas, recibos em PDF e integração completa com M-Pesa'
    },
    {
      icon: BarChart3,
      titulo: 'Analytics & Relatórios',
      descricao: 'Dashboards em tempo real, análise de performance e relatórios automáticos agendados'
    },
    {
      icon: MessageSquare,
      titulo: 'Portal do Cliente',
      descricao: 'Portal exclusivo para clientes acompanharem contratos, faturas e comunicarem diretamente'
    }
  ];

  const beneficios = [
    'Automação completa: Nunca mais perca renovações ou pagamentos',
    'CRM Avançado: Segmentação automática e análise de valor vitalício (LTV)',
    'Comunicação Inteligente: Fluxos personalizados multi-canal com WhatsApp',
    'Facturação Digital: PDFs automáticos com QR codes e integração M-Pesa',
    'Analytics em Tempo Real: Dashboards interativos e relatórios agendados',
    'Portal do Cliente: Experiência self-service completa',
    'Segurança Empresarial: Sistema multi-tenant com auditoria completa',
    'Escalabilidade Total: Planos que crescem com seu negócio'
  ];

  const planos = [
    {
      nome: 'Start',
      preco: '750',
      descricao: 'Perfeito para pequenas empresas iniciantes',
      trial: 'Teste gratuito 3 dias',
      recursos: [
        'Até 100 clientes',
        'CRM básico com segmentação',
        'Comunicação por email',
        'Facturação automática em PDF',
        'Dashboard com métricas essenciais',
        '1 utilizador',
        'Suporte por email',
        'Portal básico do cliente'
      ],
      destaque: false
    },
    {
      nome: 'Pro',
      preco: '1.500',
      descricao: 'Ideal para empresas em expansão',
      trial: 'Teste gratuito 3 dias',
      recursos: [
        'Até 500 clientes',
        'CRM avançado com análise de LTV',
        'Comunicação multi-canal (Email + WhatsApp)',
        'Facturação inteligente com QR codes',
        'Analytics completos e relatórios',
        'Fluxos de automação personalizados',
        '5 utilizadores',
        'Suporte prioritário',
        'Portal completo do cliente',
        'Integração M-Pesa básica'
      ],
      destaque: true
    },
    {
      nome: 'Premium',
      preco: '3.500',
      descricao: 'Solução completa para grandes empresas',
      trial: 'Teste gratuito 3 dias',
      recursos: [
        'Clientes ilimitados',
        'CRM empresarial com IA preditiva',
        'Comunicação omnichannel completa',
        'Facturação avançada multi-empresa',
        'Analytics empresariais em tempo real',
        'Automação completa de processos',
        'API personalizada e integrações',
        'Suporte 24/7',
        'Portal white-label do cliente',
        'Integração M-Pesa empresarial',
        'Gestor de conta dedicado'
      ],
      destaque: false
    }
  ];

  const testemunhos = [
    {
      nome: 'Maria Santos',
      empresa: 'Clínica Vida Saudável',
      texto: 'O SIGNIUS revolucionou nossa gestão de pacientes. Com a automação de lembretes via WhatsApp, nossa taxa de renovação aumentou 40% e a satisfação dos pacientes melhorou significativamente.',
      cargo: 'Diretora Administrativa',
      rating: 5,
      metrics: 'Aumento de 40% nas renovações'
    },
    {
      nome: 'João Macamo',
      empresa: 'TechSolutions Lda',
      texto: 'Com o portal do cliente e a facturação automática, reduzimos 70% do trabalho administrativo. O sistema de analytics nos ajuda a tomar decisões estratégicas baseadas em dados reais.',
      cargo: 'CEO',
      rating: 5,
      metrics: 'Redução de 70% no trabalho administrativo'
    },
    {
      nome: 'Carlos Mendes',
      empresa: 'Construções Maputo SA',
      texto: 'A análise preditiva de churn nos permitiu identificar clientes em risco e agir proativamente. Conseguimos reduzir a perda de clientes em 60% no último trimestre.',
      cargo: 'Diretor Comercial',
      rating: 5,
      metrics: 'Redução de 60% na perda de clientes'
    },
    {
      nome: 'Ana Costa',
      empresa: 'Farmácia Central',
      texto: 'O sistema multi-tenant nos permite gerir todas as nossas filiais numa única plataforma. A integração com M-Pesa facilitou muito os pagamentos dos nossos clientes.',
      cargo: 'Gestora de Operações',
      rating: 5,
      metrics: 'Gestão centralizada de 8 filiais'
    }
  ];

  const faqs = [
    {
      pergunta: 'Como funciona o teste gratuito de 3 dias?',
      resposta: 'Acesso completo a todas as funcionalidades premium, incluindo CRM avançado, automação, analytics e portal do cliente. Sem cartão de crédito, sem compromisso.'
    },
    {
      pergunta: 'O que é a análise preditiva de churn?',
      resposta: 'Nossa IA analisa o comportamento dos clientes e identifica aqueles com maior probabilidade de cancelar, permitindo ação proativa para retenção.'
    },
    {
      pergunta: 'Como funciona o portal do cliente?',
      resposta: 'Cada cliente tem acesso a um portal personalizado onde pode ver contratos, faturas, fazer pagamentos e comunicar diretamente com sua empresa.'
    },
    {
      pergunta: 'A integração M-Pesa é automática?',
      resposta: 'Sim! Integração completa com M-Pesa para pagamentos automáticos, notificações de confirmação e reconciliação automática de faturas.'
    },
    {
      pergunta: 'Posso personalizar os fluxos de comunicação?',
      resposta: 'Totalmente! Crie fluxos personalizados com gatilhos específicos, templates dinâmicos e comunicação multi-canal (Email, WhatsApp, SMS).'
    },
    {
      pergunta: 'Como funciona a segmentação automática de clientes?',
      resposta: 'O sistema analisa automaticamente o comportamento, valor e histórico dos clientes, segmentando-os em Premium, Gold, Silver e Bronze para estratégias direcionadas.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Menu */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                alt="Signius Logo" 
                className="w-40 h-16 object-contain"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('funcionalidades')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => scrollToSection('contactos')}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Contactos
              </button>
              <div className="flex items-center space-x-3 ml-8">
                <button 
                  onClick={onLogin}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Entrar
                </button>
                <button 
                  onClick={onRegister}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Criar Conta
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => scrollToSection('inicio')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-left"
                >
                  Início
                </button>
                <button
                  onClick={() => scrollToSection('funcionalidades')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-left"
                >
                  Funcionalidades
                </button>
                <button
                  onClick={() => scrollToSection('contactos')}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors text-left"
                >
                  Contactos
                </button>
                <hr className="border-gray-200" />
                <button 
                  onClick={onLogin}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-left"
                >
                  Entrar
                </button>
                <button 
                  onClick={onRegister}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-fit"
                >
                  Criar Conta
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Header */}
      <header id="inicio" className="relative overflow-hidden pt-16">
        {/* Hero Slider */}
        <div className="relative h-[600px]">
          {heroSlides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className={`bg-gradient-to-r ${slide.color} text-white h-full flex items-center`}>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Content */}
                      <div className="text-center lg:text-left">
                        <div className="mb-6">
                          <Icon size={64} className="mx-auto lg:mx-0 mb-4 opacity-90" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                          {slide.title}
                        </h1>
                        <p className="text-xl md:text-2xl mb-6 text-blue-100 opacity-90">
                          {slide.subtitle}
                        </p>
                        <p className="text-lg mb-8 text-blue-50 opacity-80 max-w-2xl mx-auto lg:mx-0">
                          {slide.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                          <button 
                            onClick={onRegister}
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                          >
                            <Play size={20} />
                            Teste Gratuito 3 Dias
                          </button>
                        </div>
                      </div>
                      
                      {/* Visual Element */}
                      <div className="hidden lg:flex justify-center items-center">
                        <div className="relative">
                          <div className="w-80 h-80 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Icon size={160} className="text-white opacity-20" />
                          </div>
                          <div className="absolute inset-0 w-80 h-80 border-2 border-white border-opacity-20 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
          
          {/* Slide Counter */}
          <div className="absolute top-8 right-8 bg-black bg-opacity-30 text-white px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-sm font-medium">
              {currentSlide + 1} / {heroSlides.length}
            </span>
          </div>
        </div>
        
        {/* Logo Section */}
        <div className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6">
              <img 
                src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                alt="Signius Logo" 
                className="w-32 h-24 object-contain filter brightness-0 invert"
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sistema Integrado de Gestão de Subscrições
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              A solução completa para automatizar seu negócio e nunca mais perder uma renovação
            </p>
          </div>
        </div>
      </header>

      {/* Sobre */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              A Plataforma Mais Avançada para Gestão de Subscrições
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Desenvolvido especificamente para o mercado moçambicano, o SIGNIUS combina inteligência artificial, 
              automação avançada e analytics em tempo real para revolucionar a gestão do seu negócio de subscrições.
            </p>
          </div>
          
          {/* Key differentiators */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🇲🇿</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Moçambicano</h3>
              <p className="text-gray-600">Desenvolvido em Moçambique, para empresas moçambicanas, com suporte local especializado</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">IA Integrada</h3>
              <p className="text-gray-600">Análise preditiva, segmentação automática e insights inteligentes para decisões estratégicas</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Implementação Rápida</h3>
              <p className="text-gray-600">Configure em minutos, não em semanas. Migração de dados automática e treinamento incluído</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Empresas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ideal para diversos tipos de negócio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {empresas.map((empresa, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{empresa.nome}</h3>
                <p className="text-gray-600">{empresa.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Tecnologia Avançada que Transforma Negócios
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Plataforma completa com IA, automação e analytics para revolucionar a gestão do seu negócio
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {funcionalidades.map((func, index) => {
              const Icon = func.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg hover:scale-105 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{func.titulo}</h3>
                  <p className="text-gray-600 leading-relaxed">{func.descricao}</p>
                </div>
              );
            })}
          </div>
          
          {/* Technology Highlights */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">Tecnologias de Ponta</h3>
              <p className="text-blue-100 text-lg">Desenvolvido com as mais modernas tecnologias para máxima performance</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl mb-2">🤖</div>
                <p className="font-semibold">IA Preditiva</p>
                <p className="text-sm text-blue-100">Análise de churn</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl mb-2">📱</div>
                <p className="font-semibold">Multi-Canal</p>
                <p className="text-sm text-blue-100">WhatsApp + Email</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl mb-2">📊</div>
                <p className="font-semibold">Real-Time</p>
                <p className="text-sm text-blue-100">Analytics ao vivo</p>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl mb-2">🔒</div>
                <p className="font-semibold">Multi-Tenant</p>
                <p className="text-sm text-blue-100">Segurança total</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Resultados Comprovados que Transformam Negócios
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Mais de 1000 empresas já automatizaram seus processos e aumentaram sua eficiência
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-2">{beneficio.split(':')[0]}</p>
                  <p className="text-gray-600">{beneficio.split(':')[1]}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Success Metrics */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resultados dos Nossos Clientes</h3>
              <p className="text-gray-600">Métricas reais de empresas que usam o Signius</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <p className="text-sm text-gray-600">Redução em renovações perdidas</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">3x</div>
                <p className="text-sm text-gray-600">Aumento na eficiência operacional</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
                <p className="text-sm text-gray-600">Melhoria na satisfação do cliente</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">60%</div>
                <p className="text-sm text-gray-600">Redução no tempo administrativo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Planos Inteligentes que Evoluem com Você
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Escolha o plano ideal e desbloqueie funcionalidades avançadas conforme sua empresa cresce
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planos.map((plano, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-sm border-2 p-8 transition-all hover:shadow-lg hover:scale-105 ${
                plano.destaque ? 'border-blue-500 relative shadow-lg scale-105' : 'border-gray-200'
              }`}>
                {plano.destaque && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      🔥 MAIS POPULAR
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    plano.destaque ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-100'
                  }`}>
                    <span className={`text-2xl ${plano.destaque ? 'text-white' : 'text-gray-600'}`}>
                      {plano.nome === 'Start' ? '🚀' : plano.nome === 'Pro' ? '⭐' : '👑'}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano {plano.nome}</h3>
                  <p className="text-gray-600 mb-4">{plano.descricao}</p>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {plano.preco} MT<span className="text-lg text-gray-500">/mês</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium mb-4 bg-green-50 rounded-full px-4 py-2">
                    🎁 {plano.trial}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plano.recursos.map((recurso, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="text-green-600" size={12} />
                      </div>
                      <span className="text-gray-700">{recurso}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 px-6 rounded-lg font-semibold transition-all hover:scale-105 ${
                  plano.destaque 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' 
                    : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={onRegister}
                >
                  {plano.destaque ? '🚀 Começar Agora' : 'Escolher Plano'}
                </button>
              </div>
            ))}
          </div>
          
          {/* Plan comparison note */}
          <div className="mt-12 text-center">
            <div className="bg-gray-50 rounded-xl p-6 max-w-4xl mx-auto">
              <h4 className="font-semibold text-gray-900 mb-3">💡 Não tem certeza qual plano escolher?</h4>
              <p className="text-gray-600 mb-4">
                Comece com qualquer plano e faça upgrade a qualquer momento. Todos os dados são preservados e a migração é instantânea.
              </p>
              <button 
                onClick={() => alert('Consultor especializado entrará em contacto: suporte@signius.co.mz')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Falar com Consultor Gratuito
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testemunhos */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Histórias de Sucesso Reais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empresas de todos os tamanhos já transformaram seus negócios com o Signius
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testemunhos.map((testemunho, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testemunho.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testemunho.texto}"</p>
                
                {/* Metrics highlight */}
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={16} />
                    <span className="text-sm font-semibold text-blue-900">Resultado:</span>
                  </div>
                  <p className="text-sm text-blue-800 mt-1">{testemunho.metrics}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testemunho.nome.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testemunho.nome}</p>
                    <p className="text-sm text-gray-600">{testemunho.cargo}</p>
                    <p className="text-sm text-blue-600 font-medium">{testemunho.empresa}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.pergunta}</span>
                  {openFaq === index ? (
                    <ChevronUp className="text-gray-500" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700">{faq.resposta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Revolucione Seu Negócio com Tecnologia de Ponta
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a mais de 1000 empresas que já automatizaram seus processos
          </p>
          
          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl mb-2">🚀</div>
              <p className="text-white font-semibold">Setup em 5 minutos</p>
              <p className="text-blue-100 text-sm">Implementação imediata</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-white font-semibold">ROI em 30 dias</p>
              <p className="text-blue-100 text-sm">Retorno garantido</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-white font-semibold">Suporte 24/7</p>
              <p className="text-blue-100 text-sm">Equipe especializada</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onRegister}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              🚀 Começar Teste Gratuito
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => alert('Entre em contacto connosco: suporte@signius.co.mz')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all hover:scale-105"
            >
              💬 Falar com Especialista
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-blue-100 text-sm">
              ✅ Sem cartão de crédito • ✅ Sem compromisso • ✅ Suporte incluído
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contactos" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <img 
                  src="https://cdn.signius.pl/wp-content/uploads/2022/09/signius_logo_rgb.svg" 
                  alt="Signius Logo" 
                  className="w-48 h-32 object-contain filter brightness-0 invert"
                />
              </div>
              <p className="text-gray-400 mb-6">
                Sistema Integrado de Gestão de Subscrições - A solução completa para automatizar 
                seu negócio e nunca mais perder uma renovação.
              </p>
              <div className="flex space-x-4">
                <Facebook className="text-gray-400 hover:text-white cursor-pointer" size={24} />
                <Twitter className="text-gray-400 hover:text-white cursor-pointer" size={24} />
                <Linkedin className="text-gray-400 hover:text-white cursor-pointer" size={24} />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-gray-400">Av. de Moçambique Nº 1843 Sobre/Loja, Bairro do Jardim, Edifício EDM, Maputo</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-400">suporte@signius.co.mz</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle size={16} className="text-gray-400" />
                  <span className="text-gray-400">Tel. (+258) 21 610 040 | Cel. 84 2828 600</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Funcionalidades</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Preços</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Suporte</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Política de Privacidade</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 SIGNIUS. Todos os direitos reservados. Desenvolvido pela: <a href="https://www.easyhost.co.mz" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Easyhost Moçambique, SA</a>
            </p>
          </div>
        </div>
      </footer>
      
      {/* Tawk.to Chat Widget for Landing Page */}
      <TawkToChat showOnLanding={true} />
    </div>
  );
};

export default LandingPage;