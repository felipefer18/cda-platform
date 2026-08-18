'use client';

import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ExcelCDA } from '@/lib/types';

interface ExcelUploadProps {
  onUpload: (cdas: ExcelCDA[]) => Promise<void>;
}

type ExcelRow = Record<string, unknown>;

function normalizeTipo(value: unknown): ExcelCDA['tipo'] {
  const s = String(value ?? '').trim().toLowerCase();
  if (s.startsWith('promo')) return 'promoção';
  return 'corporativo';
}

function isSim(value: unknown): boolean {
  if (value === true) return true;
  return String(value ?? '').trim().toUpperCase().startsWith('SIM');
}

function parseRows(rows: ExcelRow[]): ExcelCDA[] {
  return rows
    .map((row) => {
      const codigo = String(
        row['CDA M &P'] ?? row['Código'] ?? row['codigo_lc_issqn'] ?? row['Codigo'] ?? ''
      ).trim();
      return {
        nome: String(row['NOME DO CDA'] ?? row['Nome'] ?? row['nome'] ?? '').trim(),
        codigo_lc_issqn: codigo || null,
        descricao: String(
          row['DESCRITIVO ATUALIZADO'] ?? row['Descrição'] ?? row['descricao'] ?? ''
        ).trim(),
        tipo: normalizeTipo(row['Tipo'] ?? row['tipo']),
        categoria_lc: String(row['CÓDIGO LC 116'] ?? row['categoria_lc'] ?? '').trim(),
        retem_inss: isSim(row['RETÉM INSS?'] ?? row['retem_inss']),
        verba_dimac: row['Verba DIMAC'] ? String(row['Verba DIMAC']).trim() || null : null,
        verba_internalizada: row['Verba Internalizada']
          ? String(row['Verba Internalizada']).trim() || null
          : null,
        verba_endomarketing: row['Verba Endomarketing']
          ? String(row['Verba Endomarketing']).trim() || null
          : null,
      };
    })
    .filter(
      (cda) =>
        cda.nome &&
        (cda.codigo_lc_issqn || cda.verba_dimac || cda.verba_internalizada || cda.verba_endomarketing)
    );
}

export function ExcelUpload({ onUpload }: ExcelUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<ExcelCDA[] | null>(null);

  async function processFile(file: File) {
    setLoading(true);
    setMessage('');
    setIsError(false);
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);
      const cdas = parseRows(rows);

      if (cdas.length === 0) {
        setIsError(true);
        setMessage('Nenhuma linha válida encontrada. Verifique os cabeçalhos da planilha.');
        setPreview(null);
        return;
      }

      setPreview(cdas);
    } catch (error) {
      setIsError(true);
      setMessage(`Erro ao processar: ${error instanceof Error ? error.message : 'Desconhecido'}`);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmImport() {
    if (!preview) return;
    setLoading(true);
    try {
      await onUpload(preview);
      setIsError(false);
      setMessage(`${preview.length} CDAs importados com sucesso!`);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setIsError(true);
      setMessage(`Erro ao importar: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragging ? 'bg-gray-100 border-v3a-gold' : 'border-v3a-gold hover:bg-v3a-light'
        }`}
      >
        <p className="text-v3a-gold font-semibold mb-2">📄 Importar Excel</p>
        <p className="text-sm text-v3a-text-secondary">
          Clique ou arraste um arquivo .xlsx aqui
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Esperado: Nome | Código | Descrição | Categoria LC | Retém INSS
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        className="hidden"
      />

      {loading && <p className="mt-4 text-sm text-v3a-dark">Processando...</p>}

      {message && (
        <p className={`mt-4 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      {preview && (
        <div className="mt-4 border border-gray-300 rounded-lg p-4">
          <p className="text-sm font-semibold text-v3a-dark mb-2">
            Pré-visualização: {preview.length} CDAs prontos para importar
          </p>
          <div className="max-h-48 overflow-y-auto text-xs text-v3a-dark">
            {preview.slice(0, 10).map((cda, i) => (
              <div key={i} className="py-1 border-b border-gray-100">
                {cda.nome} — {cda.codigo_lc_issqn}
              </div>
            ))}
            {preview.length > 10 && (
              <p className="pt-1 text-v3a-text-secondary">
                ...e mais {preview.length - 10}
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-v3a-gold text-v3a-dark hover:opacity-90 disabled:opacity-50"
            >
              Confirmar importação
            </button>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="px-4 py-2 rounded-lg text-sm bg-gray-200 text-v3a-dark hover:bg-gray-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
