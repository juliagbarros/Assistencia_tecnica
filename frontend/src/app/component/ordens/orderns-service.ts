
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';


export type SituacaoOrdem =
    'Aberta' |
    'Em_execucao' |
    'Concluida' |
    'Cancelada';


export interface AparelhoOrdem {
    id: number;
    tipo?: string;
    marca?: string;
    modelo?: string;
    cliente?: {
        id: number;
        nome?: string;
    };
}

export interface TecnicoOrdem {
    id: number;
    nome?: string;
}

export interface OrdemServico {
    id: number;
    aparelhoId:number;
    aparelho: string;
    tecnicoId:number
    tecnicoNome: string;
    clienteId:number;
    clienteNome:string
    defeitoRelatado: string;
    diagnostico: string | null;
    status: string;
    dataAbertura: string;
    dataConclusao: string | null;
    dataEntrega: string | null;
}
export interface DadosOrdem {
    aparelhoId: number;
    tecnicoId: number;
    defeitoRelatado: string;
    diagnostico: string | null;
    dataConclusao: string | null;
    dataEntrega: string | null;
}

@Injectable({
    providedIn: 'root'
})
export class OrdemService {

    private readonly http = inject(HttpClient);

    readonly URL = 'http://localhost:8080/api/ordens';

    private readonly ordens = signal<OrdemServico[]>([]);

    listar() {
        return this.ordens.asReadonly();
    }

    carregar(): void {
        this.http.get<OrdemServico[]>(this.URL).subscribe({
            next: (dados) => {
                this.ordens.set(dados);
            },
            error: (erro) => {
                console.error('Erro ao buscar ordens:', erro);
            }
        });
    }

    criar(dados: DadosOrdem) {
        return this.http.post<OrdemServico>(this.URL, dados);
    }

  atualizar( id: number, dados: DadosOrdem & { status?: SituacaoOrdem }) 
  {  return this.http.put<void>(  `${this.URL}/${id}`, dados );
}
    remover(id: number) {
        return this.http.delete<void>(`${this.URL}/${id}`);
    }

    
alterarStatus(id: number, status: SituacaoOrdem) {
    return this.http.patch<void>(
        `${this.URL}/${id}/status`,
        { status }
    );
}

}
