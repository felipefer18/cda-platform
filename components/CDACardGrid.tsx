import { CDA } from '@/lib/types';
import { CDACard } from './CDACard';

interface CDACardGridProps {
  cdas: CDA[];
}

export function CDACardGrid({ cdas }: CDACardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cdas.map((cda) => (
        <CDACard key={cda.id} cda={cda} />
      ))}
    </div>
  );
}
