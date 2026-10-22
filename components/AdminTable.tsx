'use client';

import { useMemo, useState } from 'react';
import { CDA } from '@/lib/types';

interface AdminTableProps {
  cdas: CDA[];
  onEdit: (cda: CDA) => void;
  onDelete: (cda: CDA) => void;
}

type SortKey = 'nome' | 'codigo';

function displayCodigo(cda: CDA) {
  return (
    cda.codigo_lc_issqn ||
    cda.verba_dimac ||
    cda.verba_internalizada ||
    cda.verba_endomarketing ||
    cda.verba_portaria808 ||
    '—'
  );
}

export function AdminTable({ cdas, onEdit, onDelete }: AdminTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('nome');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    const copy = [...cdas];
    copy.sort((a, b) => {
      const av = sortKey === 'nome' ? a.nome : displayCodigo(a);
      const bv = sortKey === 'nome' ? b.nome : displayCodigo(b);
      const cmp = av.localeCompare(bv);
      return sortAsc ? cmp : -cmp;
    });
    return copy;
  }, [cdas, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  if (cdas.length === 0) {
    return <p className="text-v3a-dark text-sm py-8 text-center">Nenhum CDA cadastrado.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-300">
            <th
              className="py-2 pr-4 cursor-pointer select-none text-v3a-dark"
              onClick={() => toggleSort('nome')}
            >
              Nome {sortKey === 'nome' && (sortAsc ? '↑' : '↓')}
            </th>
            <th
              className="py-2 pr-4 cursor-pointer select-none text-v3a-dark"
              onClick={() => toggleSort('codigo')}
            >
              Código {sortKey === 'codigo' && (sortAsc ? '↑' : '↓')}
            </th>
            <th className="py-2 pr-4 text-v3a-dark">Tipo</th>
            <th className="py-2 pr-4 text-v3a-dark">Retém INSS</th>
            <th className="py-2 pr-4 text-v3a-dark">Ações</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((cda) => (
            <tr key={cda.id} className="border-b border-gray-200">
              <td className="py-2 pr-4 text-v3a-dark">{cda.nome}</td>
              <td className="py-2 pr-4 text-v3a-dark">{displayCodigo(cda)}</td>
              <td className="py-2 pr-4 text-v3a-dark capitalize">{cda.tipo}</td>
              <td className="py-2 pr-4 text-v3a-dark">{cda.retem_inss === null ? '—' : cda.retem_inss ? 'Sim' : 'Não'}</td>
              <td className="py-2 pr-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(cda)}
                    className="text-xs px-2 py-1 rounded bg-v3a-gold text-v3a-dark hover:opacity-90"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(cda)}
                    className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:opacity-90"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
