'use client';

import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearch(newValue);
    }, 300);
  }

  return (
    <div className="w-full mb-6">
      <input
        type="text"
        placeholder="Buscar por nome, código ou descrição..."
        value={value}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-v3a-gold rounded-lg focus:outline-none focus:ring-2 focus:ring-v3a-gold bg-v3a-light text-v3a-dark placeholder:text-v3a-text-secondary"
      />
    </div>
  );
}
