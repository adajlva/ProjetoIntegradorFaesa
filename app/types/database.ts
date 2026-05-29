export interface ClienteRow {
  id: string
  cpf: string
  nome: string
  cep: string | null
  logradouro: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  uf: string | null
  numero_endereco: string | null
  created_at: string
  updated_at: string
}

export interface PreAtendimentoRow {
  id: string
  cliente_id: string | null
  nome_cliente: string
  cpf_cliente: string
  titular_diferente: boolean
  nome_titular_laudo: string | null
  cpf_titular_laudo: string | null
  condutor_mesmo_cliente: boolean
  nome_condutor: string | null
  cpf_condutor: string | null
  cep: string
  logradouro: string
  complemento: string | null
  bairro: string
  cidade: string
  uf: string
  numero_endereco: string
  placa: string
  renavam: string
  observacoes_documento: string | null
  mensagem_whatsapp: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: ClienteRow
        Insert: Omit<ClienteRow, 'id' | 'created_at' | 'updated_at'> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<ClienteRow>
      }
      pre_atendimentos: {
        Row: PreAtendimentoRow
        Insert: Omit<PreAtendimentoRow, 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<PreAtendimentoRow>
      }
    }
  }
}
