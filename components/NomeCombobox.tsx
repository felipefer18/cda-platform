'use client';

import { useEffect, useRef, useState } from 'react';
import { PROMOCAO_NOMES } from '@/lib/promocaoNomes';

interface NomeComboboxProps {
  onSelect: (nome: string) => void;
}

export function NomeCombobox({ onSelect }: NomeComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = PROMOCAO_NOMES.filter((nome) =>
    nome.toLowerCase().includes(query.toLowerCase())
  );

  function handleSelect(nome: string) {
    onSelect(nome);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full sm:w-64 shrink-0">
      <input
        type="text"
        placeholder="Escolher CDA de promoção..."
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        className="w-full px-4 py-3 border border-v3a-gold sm:border-r-0 rounded-lg sm:rounded-r-none sm:rounded-l-lg focus:outline-none focus:ring-2 focus:ring-v3a-gold bg-v3a-light text-v3a-dark placeholder:text-v3a-text-secondary"
      />

      {open && (
        <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-y-auto bg-v3a-light border border-gray-300 rounded-lg shadow-lg">
          {filtered.length === 0 ? (
            <li className="px-4 py-2 text-sm text-v3a-text-secondary">Nenhum nome encontrado</li>
          ) : (
            filtered.map((nome) => (
              <li key={nome}>
                <button
                  type="button"
                  onClick={() => handleSelect(nome)}
                  className="w-full text-left px-4 py-2 text-sm text-v3a-dark hover:bg-v3a-gold/20"
                >
                  {nome}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
