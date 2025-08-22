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
  Calculator
} from 'lucide-react';

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
      titulo: 'Gestão de Subscrições',
      descricao: 'Controle completo de todos os contratos e renovações automáticas'
    },
    {
      icon: Users,
      titulo: 'Gestão de Clientes',
      descricao: 'Base de dados centralizada com histórico completo de cada cliente'
    },
    {
      icon: Bell,
      titulo: 'Notificações Inteligentes',
      descricao: 'Lembretes automáticos por email, SMS e WhatsApp'
    },
    {
      icon: Shield,
      titulo: 'Perfis e Segurança',
      descricao: 'Controle de acesso por utilizador com diferentes níveis de permissão'
    },
    {
      icon: Zap,
      titulo: 'Fluxos Personalizados',
      descricao: 'Automatize processos específicos do seu negócio'
    },
    {
      icon: CreditCard,
      titulo: 'Pagamentos M-Pesa',
      descricao: 'Integração nativa com M-Pesa para pagamentos automáticos'
    }
  ];

  const beneficios = [
    'Nunca mais perca uma renovação importante',
    'Gestão centralizada de todos os clientes',
    'Comunicação automática e personalizada',
    'Segurança de dados de nível empresarial',
    'Planos flexíveis que crescem com seu negócio'
  ];

  const planos = [
    {
      nome: 'Start',
      preco: '750',
      descricao: 'Ideal para pequenas empresas',
      trial: 'Teste gratuito 3 dias',
      recursos: [
        'Até 100 clientes',
        'Notificações básicas',
        '1 utilizador',
        'Suporte por email'
      ],
      destaque: false
    },
    {
      nome: 'Pro',
      preco: '1.500',
      descricao: 'Para empresas em crescimento',
      trial: 'Teste gratuito 3 dias',
      recursos: [
        'Até 500 clientes',
        'Notificações avançadas',
        '5 utilizadores',
        'Suporte prioritário',
        'Relatórios detalhados'
      ],
      destaque: true
    },
    {
      nome: 'Premium',
      preco: '3.500',
      descricao: 'Para grandes empresas',
      trial: 'Teste gratuito 3 dias',
      recursos: [
        'Clientes ilimitados',
        'Todas as funcionalidades',
        'Utilizadores ilimitados',
        'Suporte 24/7',
        'API personalizada'
      ],
      destaque: false
    }
  ];

  const testemunhos = [
    {
      nome: 'Maria Santos',
      empresa: 'Clínica Vida Saudável',
      texto: 'O SIGNIUS revolucionou nossa gestão de pacientes. Nunca mais perdemos uma renovação de plano!'
    },
    {
      nome: 'João Macamo',
      empresa: 'TechSolutions Lda',
      texto: 'Automatizamos 90% dos nossos processos. Nossa produtividade aumentou significativamente.'
    }
  ];

  const faqs = [
    {
      pergunta: 'Posso testar o sistema gratuitamente?',
      resposta: 'Sim! Oferecemos 3 dias de teste gratuito com acesso completo a todas as funcionalidades, sem necessidade de cartão de crédito.'
    },
    {
      pergunta: 'Como funcionam os fluxos personalizados?',
      resposta: 'Você pode criar automações específicas para seu negócio, como envio de lembretes, renovações automáticas e relatórios personalizados.'
    },
    {
      pergunta: 'O sistema suporta múltiplas empresas?',
      resposta: 'Sim, nossa arquitetura multi-tenant permite que você gerencie várias empresas em uma única conta.'
    },
    {
      pergunta: 'Quais métodos de pagamento são aceites?',
      resposta: 'Aceitamos M-Pesa, transferências bancárias e cartões de crédito. Integração nativa com principais operadores.'
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
              Para empresas que oferecem serviços recorrentes
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              O SIGNIUS é a plataforma completa para gestão de subscrições, clientes e contratos. 
              Automatize notificações, controle pagamentos e mantenha seus clientes sempre satisfeitos 
              com uma solução 100% moçambicana.
            </p>
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
              Funcionalidades que fazem a diferença
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {funcionalidades.map((func, index) => {
              const Icon = func.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{func.titulo}</h3>
                  <p className="text-gray-600">{func.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Benefícios que transformam seu negócio
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="flex items-center gap-4 mb-6">
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                <p className="text-lg text-gray-700">{beneficio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planos */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Planos que crescem com seu negócio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {planos.map((plano, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-sm border-2 p-8 ${
                plano.destaque ? 'border-blue-500 relative' : 'border-gray-200'
              }`}>
                {plano.destaque && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plano.nome}</h3>
                  <p className="text-gray-600 mb-4">{plano.descricao}</p>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {plano.preco} MT<span className="text-lg text-gray-500">/mês</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium mb-4">
                    {plano.trial}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plano.recursos.map((recurso, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
                      <span className="text-gray-700">{recurso}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plano.destaque 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'border border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={onRegister}
                >
                  Começar Agora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testemunhos */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              O que nossos clientes dizem
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testemunhos.map((testemunho, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testemunho.texto}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testemunho.nome}</p>
                  <p className="text-gray-600">{testemunho.empresa}</p>
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
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Experimente gratuitamente por 3 dias - sem compromisso, sem cartão de crédito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onRegister}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              Teste Gratuito 3 Dias
              <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => alert('Entre em contacto connosco: suporte@signius.co.mz')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Falar com Especialista
            </button>
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
    </div>
  );
};

export default LandingPage;