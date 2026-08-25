'use client';

export type FilterValue =
  | 'todos'
  | 'dipes'
  | 'dimac'
  | 'internalizada'
  | 'endomarketing'
  | 'portaria808';

interface FilterChipsProps {
  onFilterChange: (tipo: FilterValue) => void;
  activeFilter: FilterValue;
}

const FILTERS: { label: string; value: FilterValue }[] = [
  { label: 'Todos', value: 'todos' },
  { label: 'Verba DIPES', value: 'dipes' },
  { label: 'Verba DIMAC', value: 'dimac' },
  { label: 'Verba Internalizada', value: 'internalizada' },
  { label: 'Verba Endomarketing', value: 'endomarketing' },
  { label: 'Verba Portaria 808', value: 'portaria808' },
];

export function FilterChips({ onFilterChange, activeFilter }: FilterChipsProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            activeFilter === filter.value
              ? 'bg-v3a-gold text-v3a-dark font-semibold'
              : 'bg-gray-700 text-v3a-text hover:bg-gray-600'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
