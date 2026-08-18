'use client';

import { useState } from 'react';
import { CDA, CDAInput } from '@/lib/types';

interface EditModalProps {
  cda: CDA | null;
  onSave: (data: CDAInput) => Promise<void>;
  onClose: () => void;
}

const emptyForm: CDAInput = {
  nome: '',
  codigo_lc_issqn: '',
  descricao: '',
  tipo: 'corporativo',
  categoria_lc: '',
  retem_inss: false,
  verba_dimac: '',
  verba_internalizada: '',
  verba_endomarketing: '',
};

export function EditModal({ cda, onSave, onClose }: EditModalProps) {
  const [form, setForm] = useState<CDAInput>(
    cda
      ? {
          nome: cda.nome,
          codigo_lc_issqn: cda.codigo_lc_issqn ?? '',
          descricao: cda.descricao,
          tipo: cda.tipo,
          categoria_lc: cda.categoria_lc,
          retem_inss: cda.retem_inss,
          verba_dimac: cda.verba_dimac ?? '',
          verba_internalizada: cda.verba_internalizada ?? '',
          verba_endomarketing: cda.verba_endomarketing ?? '',
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hasCode =
      form.codigo_lc_issqn?.trim() ||
      form.verba_dimac?.trim() ||
      form.verba_internalizada?.trim() ||
      form.verba_endomarketing?.trim();

    if (!form.nome.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!hasCode) {
      setError('Informe pelo menos um código (LC/ISSQN ou uma das verbas)');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await onSave({
        ...form,
        codigo_lc_issqn: form.codigo_lc_issqn?.trim() || null,
        verba_dimac: form.verba_dimac?.trim() || null,
        verba_internalizada: form.verba_internalizada?.trim() || null,
        verba_endomarketing: form.verba_endomarketing?.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-v3a-light rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-v3a-dark mb-4">
          {cda ? 'Editar CDA' : 'Adicionar CDA'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-v3a-dark mb-1">Nome *</label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-v3a-dark focus:outline-none focus:ring-2 focus:ring-v3a-gold"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-v3a-dark mb-1">
              Código LC / ISSQN
            </label>
            <input
              type="text"
              value={form.codigo_lc_issqn ?? ''}
              onChange={(e) => setForm({ ...form, codigo_lc_issqn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-v3a-dark focus:outline-none focus:ring-2 focus:ring-v3a-gold"
              placeholder="Usado pelos CDAs corporativos (Dipes)"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-v3a-dark mb-1">
                Verba DIMAC
              </label>
              <input
                type="text"
                value={form.verba_dimac ?? ''}
                onChange={(e) => setForm({ ...form, verba_dimac: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-v3a-dark text-sm focus:outline-none focus:ring-2 focus:ring-v3a-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-v3a-dark mb-1">
                Verba Internalizada
              </label>
              <input
                type="text"
                value={form.verba_internalizada ?? ''}
                onChange={(e) => setForm({ ...form, verba_internalizada: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-v3a-dark text-sm focus:outline-none focus:ring-2 focus:ring-v3a-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-v3a-dark mb-1">
                Verba Endomarketing
              </label>
              <input
                type="text"
                value={form.verba_endomarketing ?? ''}
                onChange={(e) => setForm({ ...form, verba_endomarketing: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-v3a-dark text-sm focus:outline-none focus:ring-2 focus:ring-v3a-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-v3a-dark mb-1">Descrição</label>
            <textarea
              value={form.descricao ?? ''}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-v3a-dark focus:outline-none focus:ring-2 focus:ring-v3a-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-v3a-dark mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm({ ...form, tipo: e.target.value as CDAInput['tipo'] })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-v3a-dark focus:outline-none focus:ring-2 focus:ring-v3a-gold"
              >
                <option value="corporativo">Corporativo</option>
                <option value="promoção">Promoção</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-v3a-dark mb-1">
                Categoria LC
              </label>
              <input
                type="text"
                value={form.categoria_lc ?? ''}
                onChange={(e) => setForm({ ...form, categoria_lc: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-v3a-dark focus:outline-none focus:ring-2 focus:ring-v3a-gold"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-v3a-dark">
            <input
              type="checkbox"
              checked={form.retem_inss}
              onChange={(e) => setForm({ ...form, retem_inss: e.target.checked })}
              className="h-4 w-4"
            />
            Retém INSS
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-v3a-dark bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-v3a-gold text-v3a-dark hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
