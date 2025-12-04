import React, { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, CheckCircle, Clock, RefreshCw, Shield } from 'lucide-react';
import { MPGSService, subscriptionPaymentUtils } from '../../utils/mpgsService';
import { supabase } from '../../lib/supabase';

interface MPGSPaymentProps {
  companyId: string;
  companyName: string;
  planType: 'basic' | 'professional' | 'enterprise';
  amount: number;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

export const MPGSPayment: React.FC<MPGSPaymentProps> = ({
  companyId,
  companyName,
  planType,
  amount,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [mpgsConfig, setMpgsConfig] = useState<any>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  useEffect(() => {
    loadMPGSConfig();
  }, []);

  const loadMPGSConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .eq('provider', 'mpgs')
        .maybeSingle();

      if (error) throw error;

      if (data && data.is_active) {
        setMpgsConfig({
          merchantId: data.merchant_id,
          apiUsername: data.api_username,
          apiPassword: data.api_password,
          gatewayUrl: data.gateway_url,
          environment: data.environment
        });
      } else {
        setErrorMessage('Configuração de pagamento não encontrada. Entre em contato com o suporte.');
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error('Error loading MPGS config:', error);
      setErrorMessage('Erro ao carregar configurações de pagamento');
      setPaymentStatus('error');
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const initializePayment = async () => {
    if (!mpgsConfig) {
      setErrorMessage('Configuração de pagamento não disponível');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const mpgsService = new MPGSService(mpgsConfig);

      const sessionResponse = await subscriptionPaymentUtils.processSubscriptionPayment(
        mpgsService,
        companyId,
        companyName,
        planType,
        `${companyId}@signius.mz`
      );

      setSessionId(sessionResponse.session.id);

      const checkoutScript = document.createElement('script');
      checkoutScript.src = `${mpgsConfig.environment === 'production'
        ? 'https://gateway.mastercard.com'
        : 'https://test-gateway.mastercard.com'}/checkout/version/73/checkout.js`;
      checkoutScript.setAttribute('data-error', 'errorCallback');
      checkoutScript.setAttribute('data-cancel', 'cancelCallback');
      checkoutScript.setAttribute('data-complete', 'completeCallback');

      document.head.appendChild(checkoutScript);

      checkoutScript.onload = () => {
        if (window.Checkout) {
          window.Checkout.configure({
            merchant: mpgsConfig.merchantId,
            order: {
              id: sessionResponse.session.id,
              amount: amount.toString(),
              currency: 'MZN',
              description: `Subscrição ${planType} - ${companyName}`
            },
            interaction: {
              merchant: {
                name: 'Signius',
                address: {
                  line1: 'Mozambique'
                }
              }
            }
          });

          window.Checkout.showLightbox();
        }
      };

      (window as any).errorCallback = (error: any) => {
        console.error('Payment error:', error);
        setPaymentStatus('error');
        setErrorMessage(error?.message || 'Erro no processamento do pagamento');
        onPaymentError(error?.message || 'Erro desconhecido');
        setIsProcessing(false);
      };

      (window as any).cancelCallback = () => {
        setPaymentStatus('idle');
        setIsProcessing(false);
        onCancel();
      };

      (window as any).completeCallback = async (resultIndicator: string, sessionVersion: string) => {
        try {
          const verificationResult = await mpgsService.verifyPayment(sessionResponse.session.id);

          if (verificationResult.result === 'SUCCESS') {
            setPaymentStatus('success');
            setTimeout(() => {
              onPaymentSuccess(verificationResult.transactionId);
            }, 2000);
          } else {
            throw new Error('Pagamento não foi concluído com sucesso');
          }
        } catch (error) {
          setPaymentStatus('error');
          const errorMsg = error instanceof Error ? error.message : 'Erro na verificação do pagamento';
          setErrorMessage(errorMsg);
          onPaymentError(errorMsg);
        } finally {
          setIsProcessing(false);
        }
      };
    } catch (error) {
      setPaymentStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrorMessage(errorMsg);
      onPaymentError(errorMsg);
      setIsProcessing(false);
    }
  };

  if (isLoadingConfig) {
    return (
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="text-center py-8">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
          <p className="text-gray-600">A carregar configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 max-w-md w-full">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="text-blue-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Pagamento Seguro</h3>
        <p className="text-gray-600">Pague com Visa ou Mastercard</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Empresa:</span>
          <span className="text-sm font-medium text-gray-900">{companyName}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Plano:</span>
          <span className="text-sm font-medium text-gray-900 capitalize">{planType}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Valor:</span>
          <span className="text-lg font-bold text-blue-600">{amount.toLocaleString()} MT</span>
        </div>
      </div>

      {paymentStatus === 'idle' && (
        <>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-500" size={16} />
              <span className="text-sm text-red-700">{errorMessage}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={initializePayment}
              disabled={isProcessing || !mpgsConfig}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  Pagar Agora
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield size={16} />
            <span>Pagamento seguro processado por MasterCard</span>
          </div>
        </>
      )}

      {paymentStatus === 'processing' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="text-yellow-600 animate-pulse" size={32} />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Processando Pagamento</h4>
          <p className="text-gray-600 mb-4">
            Complete o pagamento na janela que foi aberta
          </p>
        </div>
      )}

      {paymentStatus === 'success' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Pagamento Realizado!</h4>
          <p className="text-gray-600 mb-4">
            O seu pagamento foi processado com sucesso
          </p>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Erro no Pagamento</h4>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setPaymentStatus('idle');
                setErrorMessage('');
              }}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">Pagamento Recorrente</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Subscrição mensal automática</li>
          <li>• Renovação até cancelamento</li>
          <li>• Cancele a qualquer momento nas configurações</li>
          <li>• Cartão protegido com criptografia</li>
        </ul>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    Checkout: any;
  }
}
