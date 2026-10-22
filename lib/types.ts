export type CDA = {
  id: string;
  nome: string;
  codigo_lc_issqn: string | null;
  descricao: string;
  tipo: 'corporativo' | 'promoção';
  categoria_lc: string;
  retem_inss: boolean | null;
  excecao_inss: string | null;
  observacoes: string | null;
  outras_observacoes: string | null;
  verba_dimac: string | null;
  verba_internalizada: string | null;
  verba_endomarketing: string | null;
  verba_portaria808: string | null;
  irpj: number | null;
  cofins: number | null;
  csll: number | null;
  pis_pasep: number | null;
  retem_iss: boolean;
  encaminhamentos: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CDAsResponse = {
  data: CDA[];
  count: number;
};

export type ExcelCDA = {
  nome: string;
  codigo_lc_issqn?: string | null;
  descricao?: string;
  tipo?: 'corporativo' | 'promoção';
  categoria_lc?: string;
  retem_inss?: boolean;
  verba_dimac?: string | null;
  verba_internalizada?: string | null;
  verba_endomarketing?: string | null;
  verba_portaria808?: string | null;
  irpj?: number | null;
  cofins?: number | null;
  csll?: number | null;
  pis_pasep?: number | null;
  retem_iss?: boolean;
  encaminhamentos?: string | null;
};

export type CDAInput = Omit<CDA, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
