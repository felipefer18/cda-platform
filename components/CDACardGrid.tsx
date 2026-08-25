'use client';

import { useState } from 'react';
import { CDA } from '@/lib/types';
import { CDACard } from './CDACard';
import { CDADetailModal } from './CDADetailModal';

interface CDACardGridProps {
  cdas: CDA[];
}

export function CDACardGrid({ cdas }: CDACardGridProps) {
  const [selected, setSelected] = useState<CDA | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cdas.map((cda) => (
          <CDACard key={cda.id} cda={cda} onClick={() => setSelected(cda)} />
        ))}
      </div>
      {selected && <CDADetailModal cda={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
