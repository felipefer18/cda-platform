'use client';

import { useEffect, useMemo, useState } from 'react';
import { ExcelUpload } from '@/components/ExcelUpload';
import { AdminTable } from '@/components/AdminTable';
import { EditModal } from '@/components/EditModal';
import { CDA, CDAInput, ExcelCDA } from '@/lib/types';

export default function AdminDashboard() {
  const [cdas, setCdas] = useState<CDA[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState('');
  const [modalCda, setModalCda] = useState<CDA | null | undefined>(undefined);

  useEffect(() => {
    fetchCdas();
  }, []);

  async function fetchCdas() {
    setLoadingList(true);
    try {
      const response = await fetch('/api/cdas');
      const data = await response.json();
      setCdas(data.data ?? []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoadingList(false);
    }
  }

  function flash(text: string, error = false) {
    setMessage(text);
    setIsError(error);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleImport(newCdas: ExcelCDA[]) {
    const response = await fetch('/api/cdas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cdas: newCdas }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? 'Erro ao importar');
    flash(result.message);
    fetchCdas();
  }

  async function handleSave(data: CDAInput) {
    const isEdit = Boolean(modalCda);
    const url = isEdit ? `/api/cdas/${modalCda!.id}` : '/api/cdas';
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? 'Erro ao salvar');

    flash(isEdit ? 'CDA atualizado com sucesso' : 'CDA criado com sucesso');
    fetchCdas();
  }

  async function handleDelete(cda: CDA) {
    if (!confirm(`Excluir "${cda.nome}"?`)) return;
    try {
      const response = await fetch(`/api/cdas/${cda.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Erro ao excluir');
      flash('CDA excluído');
      fetchCdas();
    } catch (error) {
      flash(error instanceof Error ? error.message : 'Erro ao excluir', true);
    }
  }

  const filteredCdas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cdas;
    return cdas.filter(
      (cda) =>
        cda.nome.toLowerCase().includes(q) ||
        cda.codigo_lc_issqn?.toLowerCase().includes(q) ||
        cda.verba_dimac?.toLowerCase().includes(q) ||
        cda.verba_internalizada?.toLowerCase().includes(q) ||
        cda.verba_endomarketing?.toLowerCase().includes(q)
    );
  }, [cdas, search]);

  const corpCount = cdas.filter((c) => c.tipo === 'corporativo').length;
  const promoCount = cdas.filter((c) => c.tipo === 'promoção').length;

  return (
    <main className="min-h-screen bg-v3a-dark">
      <div className="bg-gradient-to-b from-v3a-dark to-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-v3a-text mb-2">Admin Dashboard</h1>
          <p className="text-v3a-gold">Gerenciar Códigos CDA</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-v3a-light p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total de CDAs</p>
            <p className="text-3xl font-bold text-v3a-gold">{cdas.length}</p>
          </div>
          <div className="bg-v3a-light p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Corporativo</p>
            <p className="text-3xl font-bold text-v3a-gold">{corpCount}</p>
          </div>
          <div className="bg-v3a-light p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Promoção</p>
            <p className="text-3xl font-bold text-v3a-gold">{promoCount}</p>
          </div>
        </div>

        <div className="bg-v3a-light p-6 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-v3a-dark">Importar Códigos</h2>
            <button
              type="button"
              onClick={() => setModalCda(null)}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-v3a-gold text-v3a-dark hover:opacity-90"
            >
              + Adicionar Manual
            </button>
          </div>
          <ExcelUpload onUpload={handleImport} />
          {message && (
            <p className={`mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
        </div>

        <div className="bg-v3a-light p-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-v3a-dark">Códigos Cadastrados</h2>
            <input
              type="text"
              placeholder="Buscar por nome ou código..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-v3a-dark focus:outline-none focus:ring-2 focus:ring-v3a-gold sm:w-64"
            />
          </div>
          {loadingList ? (
            <p className="text-v3a-dark text-sm py-8 text-center">Carregando...</p>
          ) : (
            <AdminTable
              cdas={filteredCdas}
              onEdit={(cda) => setModalCda(cda)}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {modalCda !== undefined && (
        <EditModal cda={modalCda} onSave={handleSave} onClose={() => setModalCda(undefined)} />
      )}
    </main>
  );
}
