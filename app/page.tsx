'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { CDACardGrid } from '@/components/CDACardGrid';
import { SearchBar } from '@/components/SearchBar';
import { NomeCombobox } from '@/components/NomeCombobox';
import { FilterChips, FilterValue } from '@/components/FilterChips';
import { CDAsResponse } from '@/lib/types';

const PAGE_SIZE = 21;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterValue>('todos');
  const [page, setPage] = useState(1);

  const params = new URLSearchParams({
    q: query,
    tipo: filterType,
    limit: String(PAGE_SIZE * page),
    offset: '0',
  });

  const { data, isLoading } = useSWR<CDAsResponse>(`/api/search?${params}`, fetcher, {
    keepPreviousData: true,
  });

  const cdas = data?.data ?? [];
  const count = data?.count ?? 0;
  const hasMore = cdas.length < count;

  function handleSearch(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleFilterChange(value: FilterValue) {
    setFilterType(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-v3a-dark">
      <div className="bg-gradient-to-b from-v3a-dark to-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-v3a-text mb-2">Consulta de CDA</h1>
          <p className="text-v3a-gold text-lg">
            V3A - Plataforma de Códigos de Descrição de Atividades
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-6">
          <NomeCombobox onSelect={handleSearch} />
          <SearchBar value={query} onSearch={handleSearch} />
        </div>
        <FilterChips activeFilter={filterType} onFilterChange={handleFilterChange} />
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        {isLoading && cdas.length === 0 ? (
          <p className="text-center text-v3a-text-secondary">Carregando...</p>
        ) : cdas.length > 0 ? (
          <>
            <div className="mb-8">
              <CDACardGrid cdas={cdas} />
            </div>
            <p className="text-center text-v3a-text-secondary text-sm mb-4">
              Mostrando {cdas.length} de {count} resultados
            </p>
            {hasMore && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  className="px-6 py-2 rounded-lg text-sm font-semibold bg-v3a-gold text-v3a-dark hover:opacity-90"
                >
                  Carregar mais
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-v3a-text-secondary">Nenhum CDA encontrado</p>
        )}
      </div>
    </main>
  );
}
