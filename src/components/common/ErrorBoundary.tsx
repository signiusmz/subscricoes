import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Atualiza o state para mostrar a UI de erro
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log do erro no console para debugging
    console.error('ErrorBoundary capturou um erro:', error);
    console.error('Informações do erro:', errorInfo);
    
    // Log detalhado para desenvolvimento
    console.group('🚨 Error Boundary - Detalhes do Erro');
    console.error('Erro:', error.name);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Atualiza o state com informações do erro
    this.setState({
      error,
      errorInfo
    });

    // Chama callback personalizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Em produção, você poderia enviar o erro para um serviço de monitoramento
    // como Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Exemplo: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    // Reset do estado para tentar renderizar novamente
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined 
    });
  };

  render() {
    if (this.state.hasError) {
      // Se um fallback customizado foi fornecido, use-o
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // UI de erro padrão mais elaborada
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Oops! Algo deu errado
            </h3>
            
            <p className="text-gray-600 mb-6">
              Ocorreu um erro inesperado neste componente. Nossa equipe foi notificada 
              e está trabalhando para resolver o problema.
            </p>

            {/* Detalhes do erro (apenas em desenvolvimento) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                <h4 className="text-sm font-semibold text-red-900 mb-2">
                  Detalhes do Erro (Desenvolvimento):
                </h4>
                <p className="text-xs text-red-800 font-mono break-all">
                  {this.state.error.name}: {this.state.error.message}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-700 cursor-pointer hover:text-red-900">
                      Ver stack trace
                    </summary>
                    <pre className="text-xs text-red-700 mt-2 whitespace-pre-wrap overflow-auto max-h-32">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Tentar Novamente
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} />
                Recarregar Página
              </button>
            </div>

            {/* Informações de suporte */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Se o problema persistir, contacte o suporte técnico em{' '}
                <a 
                  href="mailto:suporte@signius.co.mz" 
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  suporte@signius.co.mz
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Se não há erro, renderiza os children normalmente
    return this.props.children;
  }
}

// Hook para usar ErrorBoundary de forma mais simples
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Componente de erro simples para casos específicos
export const SimpleErrorFallback: React.FC<{ message?: string }> = ({ 
  message = "Erro ao carregar este componente." 
}) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center gap-3">
      <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
      <div>
        <p className="text-red-800 font-medium">{message}</p>
        <p className="text-red-600 text-sm mt-1">
          Tente recarregar a página ou contacte o suporte se o problema persistir.
        </p>
      </div>
    </div>
  </div>
);