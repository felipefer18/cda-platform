export type CDA = {
  id: string;
  nome: string;
  codigo_lc_issqn: string | null;
  descricao: string;
  tipo: 'corporativo' | 'promoção';
  categoria_lc: string;
  retem_inss: boolean;
  verba_dimac: string | null;
  verba_internalizada: string | null;
  verba_endomarketing: string | null;
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
};

export type CDAInput = Omit<CDA, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
