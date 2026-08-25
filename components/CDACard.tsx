import { CDA } from '@/lib/types';

interface CDACardProps {
  cda: CDA;
  onClick: () => void;
}

function issqnCode(categoriaLc: string) {
  const trimmed = categoriaLc.trim();
  const numeric = trimmed.match(/^\d+(\.\d+)*/);
  if (numeric) return numeric[0];
  return trimmed.split(/[–-]/)[0].trim();
}

export function CDACard({ cda, onClick }: CDACardProps) {
  const descricao = cda.descricao ?? '';

  const verbas = [
    { label: 'DIMAC', value: cda.verba_dimac },
    { label: 'Internalizada', value: cda.verba_internalizada },
    { label: 'Endomarketing', value: cda.verba_endomarketing },
    { label: 'Portaria 808', value: cda.verba_portaria808 },
  ].filter((v) => v.value);

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full bg-v3a-light border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-v3a-gold transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start gap-2 mb-3">
        <h3 className="font-semibold text-v3a-dark text-sm leading-snug min-h-[2.5rem] flex items-start">
          {cda.nome}
        </h3>
        <span className="shrink-0 text-[11px] font-medium bg-v3a-gold text-v3a-dark px-2 py-0.5 rounded">
          {cda.tipo === 'corporativo' ? 'Corp' : 'Promo'}
        </span>
      </div>

      {(cda.codigo_lc_issqn || cda.categoria_lc) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 pb-3 border-b border-gray-200">
          {cda.codigo_lc_issqn && (
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-v3a-text-secondary">
                Código
              </span>
              <span className="font-mono text-base font-semibold text-v3a-dark">
                {cda.codigo_lc_issqn}
              </span>
            </div>
          )}
          {cda.categoria_lc && (
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wide text-v3a-text-secondary">
                ISSQN
              </span>
              <span className="font-mono text-base font-semibold text-v3a-dark">
                {issqnCode(cda.categoria_lc)}
              </span>
            </div>
          )}
        </div>
      )}

      {verbas.length > 0 && (
        <div className="flex flex-col gap-0.5 mb-3 text-xs">
          {verbas.map((v) => (
            <span key={v.label} className="text-v3a-text-secondary">
              <span className="font-bold">{v.label}</span>{' '}
              <span className="font-mono font-medium text-v3a-dark">{v.value}</span>
            </span>
          ))}
        </div>
      )}

      {descricao && (
        <p className="text-[11px] text-v3a-dark leading-relaxed mb-3">{descricao}</p>
      )}

      {(cda.retem_inss || cda.retem_iss) && (
        <div className="flex gap-3">
          {cda.retem_inss && <span className="text-xs text-red-600">⚠ Retém INSS</span>}
          {cda.retem_iss && <span className="text-xs text-red-600">⚠ Retém ISS</span>}
        </div>
      )}
    </button>
  );
}
