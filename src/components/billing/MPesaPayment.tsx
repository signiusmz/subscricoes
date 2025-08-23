import React, { useState } from 'react';
import { Smartphone, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { MPesaService, subscriptionPaymentUtils } from '../../utils/mpesaService';

interface MPesaPaymentProps {
  companyId: string;
  companyName: string;
  planType: 'basic' | 'professional' | 'enterprise';
  amount: number;
  onPaymentSuccess: (transactionId: string) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

export const MPesaPayment: React.FC<MPesaPaymentProps> = ({
  companyId,
  companyName,
  planType,
  amount,
  onPaymentSuccess,
  onPaymentError,
  onCancel
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Mock M-Pesa config - in production, this would come from secure storage
  const mockMPesaConfig = {
    apiKey: 'your-api-key',
    publicKey: 'your-public-key',
    serviceProviderCode: '171717',
    initiatorIdentifier: 'testapi',
    securityCredential: 'your-security-credential',
    environment: 'sandbox' as const
  };

  const handlePayment = async () => {
    if (!phoneNumber) {
      setErrorMessage('Por favor, insira o número de telefone');
      return;
    }

    if (!MPesaService.validateMozambiquePhone(phoneNumber)) {
      setErrorMessage('Número de telefone inválido. Use o formato: 84 123 4567 ou +258 84 123 4567');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Initialize M-Pesa service
      const mpesaService = new MPesaService(mockMPesaConfig);

      // Process payment
      const result = await subscriptionPaymentUtils.processSubscriptionPayment(
        mpesaService,
        companyId,
        companyName,
        planType,
        phoneNumber
      );

      if (result.output_ResponseCode === 'INS-0') {
        setPaymentStatus('success');
        setTransactionId(result.output_TransactionID);
        onPaymentSuccess(result.output_TransactionID);
      } else {
        throw new Error(result.output_ResponseDesc || 'Erro no pagamento');
      }
    } catch (error) {
      setPaymentStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrorMessage(errorMsg);
      onPaymentError(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as: XX XXX XXXX
    if (value.length >= 2) {
      value = value.substring(0, 2) + ' ' + value.substring(2);
    }
    if (value.length >= 6) {
      value = value.substring(0, 6) + ' ' + value.substring(6, 10);
    }
    
    setPhoneNumber(value);
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md w-full">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="text-green-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Pagamento M-Pesa</h3>
        <p className="text-gray-600">Pague a sua subscrição usando M-Pesa</p>
      </div>

      {/* Payment Details */}
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
          <span className="text-lg font-bold text-green-600">{amount.toLocaleString()} MT</span>
        </div>
      </div>

      {paymentStatus === 'idle' && (
        <>
          {/* Phone Number Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Telefone M-Pesa
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">+258</span>
              </div>
              <input
                type="text"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="84 123 4567"
                maxLength={11}
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Insira o número associado à sua conta M-Pesa
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="text-red-500" size={16} />
              <span className="text-sm text-red-700">{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || !phoneNumber}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Processando...
                </>
              ) : (
                'Pagar Agora'
              )}
            </button>
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
            Verifique o seu telefone para confirmar o pagamento M-Pesa
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Instruções:</strong><br />
              1. Receberá uma notificação no seu telefone<br />
              2. Digite o seu PIN M-Pesa<br />
              3. Confirme o pagamento
            </p>
          </div>
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
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>ID da Transação:</strong><br />
              {transactionId}
            </p>
          </div>
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

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">Como funciona:</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Insira o número da sua conta M-Pesa</li>
          <li>• Clique em "Pagar Agora"</li>
          <li>• Confirme o pagamento no seu telefone</li>
          <li>• A subscrição será ativada automaticamente</li>
        </ul>
      </div>
    </div>
  );
};