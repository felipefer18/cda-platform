'use client';

import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  value: string;
  onSearch: (query: string) => void;
}

export function SearchBar({ value, onSearch }: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (value !== syncedValue) {
    setSyncedValue(value);
    setLocal(value);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setLocal(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearch(newValue);
    }, 300);
  }

  return (
    <input
      type="text"
      placeholder="Buscar por nome, código ou descrição..."
      value={local}
      onChange={handleChange}
      className="flex-1 w-full px-4 py-3 border border-v3a-gold rounded-lg sm:rounded-l-none sm:rounded-r-lg focus:outline-none focus:ring-2 focus:ring-v3a-gold bg-v3a-light text-v3a-dark placeholder:text-v3a-text-secondary"
    />
  );
}
