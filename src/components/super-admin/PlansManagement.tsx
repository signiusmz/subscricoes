import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Package
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  billing_period: 'monthly' | 'yearly';
  features: string[];
  is_visible: boolean;
  is_popular: boolean;
  sort_order: number;
  max_clients: number | null;
  max_users: number | null;
  max_invoices_per_month: number | null;
  has_automation: boolean;
  has_analytics: boolean;
  has_api_access: boolean;
  has_whatsapp: boolean;
  has_custom_domain: boolean;
  created_at: string;
  updated_at: string;
}

export const PlansManagement: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    billing_period: 'monthly' as 'monthly' | 'yearly',
    features: [] as string[],
    is_visible: true,
    is_popular: false,
    sort_order: 0,
    max_clients: null as number | null,
    max_users: null as number | null,
    max_invoices_per_month: null as number | null,
    has_automation: false,
    has_analytics: false,
    has_api_access: false,
    has_whatsapp: false,
    has_custom_domain: false,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching plans:', error);
      alert('Erro ao carregar planos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (plan?: SubscriptionPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        slug: plan.slug,
        description: plan.description || '',
        price: plan.price,
        billing_period: plan.billing_period,
        features: plan.features || [],
        is_visible: plan.is_visible,
        is_popular: plan.is_popular,
        sort_order: plan.sort_order,
        max_clients: plan.max_clients,
        max_users: plan.max_users,
        max_invoices_per_month: plan.max_invoices_per_month,
        has_automation: plan.has_automation,
        has_analytics: plan.has_analytics,
        has_api_access: plan.has_api_access,
        has_whatsapp: plan.has_whatsapp,
        has_custom_domain: plan.has_custom_domain,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: 0,
        billing_period: 'monthly',
        features: [],
        is_visible: true,
        is_popular: false,
        sort_order: plans.length + 1,
        max_clients: null,
        max_users: null,
        max_invoices_per_month: null,
        has_automation: false,
        has_analytics: false,
        has_api_access: false,
        has_whatsapp: false,
        has_custom_domain: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFeatureInput('');
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('subscription_plans')
          .update(formData)
          .eq('id', editingPlan.id);

        if (error) throw error;
        alert('Plano atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('subscription_plans')
          .insert([formData]);

        if (error) throw error;
        alert('Plano criado com sucesso!');
      }

      handleCloseModal();
      fetchPlans();
    } catch (error: any) {
      console.error('Error saving plan:', error);
      alert('Erro ao salvar plano: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisibility = async (plan: SubscriptionPlan) => {
    try {
      const { error } = await supabase
        .from('subscription_plans')
        .update({ is_visible: !plan.is_visible })
        .eq('id', plan.id);

      if (error) throw error;
      fetchPlans();
    } catch (error: any) {
      console.error('Error toggling visibility:', error);
      alert('Erro ao alterar visibilidade: ' + error.message);
    }
  };

  const handleDelete = async (plan: SubscriptionPlan) => {
    if (!confirm(`Tem certeza que deseja excluir o plano "${plan.name}"?`)) return;

    try {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', plan.id);

      if (error) throw error;
      alert('Plano excluído com sucesso!');
      fetchPlans();
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      alert('Erro ao excluir plano: ' + error.message);
    }
  };

  if (loading && plans.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando planos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gestão de Planos</h3>
          <p className="text-sm text-gray-600 mt-1">Gerir planos de subscrição exibidos na landing page</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
              plan.is_popular ? 'border-blue-600' : 'border-gray-200'
            } ${!plan.is_visible ? 'opacity-60' : ''}`}
          >
            {plan.is_popular && (
              <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                Mais Popular
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900">{plan.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleToggleVisibility(plan)}
                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title={plan.is_visible ? 'Ocultar na landing page' : 'Mostrar na landing page'}
                >
                  {plan.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="p-1 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price.toLocaleString()}</span>
              <span className="text-gray-600 ml-2">MT/mês</span>
            </div>

            <div className="space-y-2 mb-4">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={16} />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                {plan.max_clients && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {plan.max_clients} clientes
                  </span>
                )}
                {plan.max_users && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {plan.max_users} usuários
                  </span>
                )}
                {plan.has_automation && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Automação
                  </span>
                )}
                {plan.has_analytics && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    Análises
                  </span>
                )}
                {plan.has_whatsapp && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    WhatsApp
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Ordem: {plan.sort_order} | {plan.is_visible ? 'Visível' : 'Oculto'}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingPlan ? 'Editar Plano' : 'Novo Plano'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Plano *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug (identificador único) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (MT) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordem de Exibição
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Clientes
                  </label>
                  <input
                    type="number"
                    value={formData.max_clients || ''}
                    onChange={(e) => setFormData({ ...formData, max_clients: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Ilimitado"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de Utilizadores
                  </label>
                  <input
                    type="number"
                    value={formData.max_users || ''}
                    onChange={(e) => setFormData({ ...formData, max_users: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Ilimitado"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Funcionalidades
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    placeholder="Digite uma funcionalidade e pressione Enter"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Visível na Landing Page</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Marcar como Popular</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_automation}
                      onChange={(e) => setFormData({ ...formData, has_automation: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Automação</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_analytics}
                      onChange={(e) => setFormData({ ...formData, has_analytics: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Análises</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_whatsapp}
                      onChange={(e) => setFormData({ ...formData, has_whatsapp: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">WhatsApp</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_api_access}
                      onChange={(e) => setFormData({ ...formData, has_api_access: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Acesso API</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.has_custom_domain}
                      onChange={(e) => setFormData({ ...formData, has_custom_domain: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Domínio Personalizado</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {loading ? 'Salvando...' : 'Salvar Plano'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
