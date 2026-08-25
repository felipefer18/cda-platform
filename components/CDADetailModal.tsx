'use client';

import { useEffect } from 'react';
import { CDA } from '@/lib/types';

interface CDADetailModalProps {
  cda: CDA;
  onClose: () => void;
}

function pct(value: number | null) {
  if (value === null || value === undefined) return null;
  return `${value}%`;
}

export function CDADetailModal({ cda, onClose }: CDADetailModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const codigos = [
    { label: 'Código', value: cda.codigo_lc_issqn },
    { label: 'DIMAC', value: cda.verba_dimac },
    { label: 'Internalizada', value: cda.verba_internalizada },
    { label: 'Endomarketing', value: cda.verba_endomarketing },
    { label: 'Portaria 808', value: cda.verba_portaria808 },
  ].filter((c) => c.value);

  const impostos = [
    { label: 'IRPJ', value: pct(cda.irpj) },
    { label: 'COFINS', value: pct(cda.cofins) },
    { label: 'CSLL', value: pct(cda.csll) },
    { label: 'PIS/PASEP', value: pct(cda.pis_pasep) },
  ].filter((i) => i.value);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-v3a-light rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-3 mb-4">
          <h2 className="text-xl font-bold text-v3a-dark leading-snug">{cda.nome}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="shrink-0 text-v3a-text-secondary hover:text-v3a-dark text-xl leading-none"
          >
            ×
          </button>
        </div>

        <span className="inline-block text-[11px] font-medium bg-v3a-gold text-v3a-dark px-2 py-0.5 rounded mb-4">
          {cda.tipo === 'corporativo' ? 'Corporativo' : 'Promoção'}
        </span>

        {codigos.length > 0 && (
          <div className="flex flex-col gap-1 mb-4 pb-4 border-b border-gray-200">
            {codigos.map((c) => (
              <div key={c.label} className="flex items-baseline gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wide text-v3a-text-secondary w-28 shrink-0">
                  {c.label}
                </span>
                <span className="font-mono text-base font-semibold text-v3a-dark">{c.value}</span>
              </div>
            ))}
          </div>
        )}

        {cda.categoria_lc && (
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-v3a-text-secondary mb-1">
              Código LC 116 / ISSQN
            </p>
            <p className="text-sm text-v3a-dark leading-relaxed">{cda.categoria_lc}</p>
          </div>
        )}

        {cda.descricao && (
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-v3a-text-secondary mb-1">
              Descrição
            </p>
            <p className="text-sm text-v3a-dark leading-relaxed whitespace-pre-line">
              {cda.descricao}
            </p>
          </div>
        )}

        {cda.encaminhamentos && (
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-v3a-text-secondary mb-1">
              Encaminhamentos para absorção do serviço
            </p>
            <p className="text-sm text-v3a-dark leading-relaxed whitespace-pre-line">
              {cda.encaminhamentos}
            </p>
          </div>
        )}

        {impostos.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-v3a-text-secondary mb-2">
              Retenção na fonte
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {impostos.map((i) => (
                <div key={i.label} className="bg-gray-100 rounded-lg px-3 py-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-v3a-text-secondary">
                    {i.label}
                  </p>
                  <p className="font-mono text-base font-semibold text-v3a-dark">{i.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 text-sm">
          {cda.retem_inss && <span className="text-red-600">⚠ Retém INSS</span>}
          {cda.retem_iss && <span className="text-red-600">⚠ Retém ISS</span>}
        </div>
      </div>
    </div>
  );
}
