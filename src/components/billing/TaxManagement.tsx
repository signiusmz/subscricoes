import React, { useState } from 'react';
import {
  Calculator,
  Save,
  Plus,
  Edit,
  Trash2,
  Percent,
  CheckCircle
} from 'lucide-react';

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  type: 'iva' | 'custom';
  description: string;
  isActive: boolean;
  validFrom: string;
}

const mockTaxRates: TaxRate[] = [
  {
    id: '1',
    name: 'IVA Padrão',
    rate: 16,
    type: 'iva',
    description: 'Imposto sobre Valor Acrescentado - Taxa padrão',
    isActive: true,
    validFrom: '2024-01-01'
  },
  {
    id: '2',
    name: 'IVA Reduzido',
    rate: 10,
    type: 'iva',
    description: 'IVA com taxa reduzida para serviços específicos',
    isActive: true,
    validFrom: '2024-01-01'
  }
];

export const TaxManagement: React.FC = () => {
  const [taxRates, setTaxRates] = useState<TaxRate[]>(mockTaxRates);
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [editingRate, setEditingRate] = useState<TaxRate | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
  };

  const getTaxTypeBadge = (type: string) => {
    const typeConfig = {
      iva: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'IVA' },
      custom: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Personalizado' }
    };
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.custom;
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleSaveTaxRate = (rateData: Partial<TaxRate>) => {
    if (editingRate) {
      setTaxRates(taxRates.map(tr =>
        tr.id === editingRate.id
          ? { ...tr, ...rateData }
          : tr
      ));
      alert(`Taxa de imposto "${rateData.name}" atualizada com sucesso!`);
    } else {
      const newRate: TaxRate = {
        id: Date.now().toString(),
        name: rateData.name || '',
        rate: rateData.rate || 0,
        type: rateData.type || 'custom',
        description: rateData.description || '',
        isActive: true,
        validFrom: rateData.validFrom || new Date().toISOString().split('T')[0]
      };
      setTaxRates([...taxRates, newRate]);
      alert(`Nova taxa de imposto "${newRate.name}" criada com sucesso!`);
    }
    setShowAddRateModal(false);
    setEditingRate(null);
  };

  const handleDeleteTaxRate = (rateId: string) => {
    if (confirm('Tem certeza que deseja eliminar esta taxa de imposto?')) {
      setTaxRates(taxRates.filter(tr => tr.id !== rateId));
      alert('Taxa de imposto eliminada com sucesso!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Taxas de Imposto</h3>
          <p className="text-gray-600">Gerir taxas de impostos aplicáveis às subscrições</p>
        </div>
        <button
          onClick={() => setShowAddRateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Nova Taxa
        </button>
      </div>

      {/* Tax Rates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Válido Desde</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {taxRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rate.name}</div>
                      <div className="text-sm text-gray-500">{rate.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getTaxTypeBadge(rate.type)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Percent size={12} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{rate.rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(rate.validFrom)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      rate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {rate.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingRate(rate);
                          setShowAddRateModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTaxRate(rate.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Tax Rate Modal */}
      {showAddRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingRate ? 'Editar Taxa de Imposto' : 'Nova Taxa de Imposto'}
            </h3>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);

              const rateData = {
                name: formData.get('name') as string,
                rate: Number(formData.get('rate')),
                type: formData.get('type') as 'iva' | 'custom',
                description: formData.get('description') as string,
                validFrom: formData.get('validFrom') as string,
                isActive: formData.get('isActive') === 'on'
              };
              handleSaveTaxRate(rateData);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Taxa</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingRate?.name || ''}
                    placeholder="Ex: IVA Padrão"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taxa (%)</label>
                  <input
                    type="number"
                    name="rate"
                    defaultValue={editingRate?.rate || ''}
                    placeholder="Ex: 16"
                    min="0"
                    max="100"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Imposto</label>
                  <select
                    name="type"
                    defaultValue={editingRate?.type || 'iva'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="iva">IVA</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Válido Desde</label>
                  <input
                    type="date"
                    name="validFrom"
                    defaultValue={editingRate?.validFrom || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <textarea
                    name="description"
                    defaultValue={editingRate?.description || ''}
                    placeholder="Descrição da taxa de imposto..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  defaultChecked={editingRate?.isActive !== false}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Taxa ativa (será aplicada automaticamente)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddRateModal(false);
                    setEditingRate(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingRate ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
