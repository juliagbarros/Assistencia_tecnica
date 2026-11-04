
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ClienteAgendamento {
    id: number;
    nome?: string;
}

export interface TecnicoAgendamento {
    id: number;
    nome?: string;
}

export interface Agendamento {
    id: number;
    cliente: ClienteAgendamento;
    tecnico: TecnicoAgendamento;
    inicio: string;
    fim: string;
    motivo: string;
    situacao: string;
}

export interface DadosAgendamento {
    cliente: { id: number };
    tecnico: { id: number };
    inicio: string;
    fim: string;
    motivo: string;
    situacao: string;
}

@Injectable({
    providedIn: 'root'
})
export class AgendamentoService {

    private readonly http = inject(HttpClient);

    readonly URL = 'http://localhost:8080/api/agendamentos';

    private readonly agendamentos = signal<Agendamento[]>([]);

    listar() {
        return this.agendamentos.asReadonly();
    }

    carregar(): void {
        this.http.get<Agendamento[]>(this.URL).subscribe({
            next: (dados) => {
                this.agendamentos.set(dados);
            },
            error: (erro) => {
                console.error('Erro ao buscar agendamentos:', erro);
            }
        });
    }

    criar(dados: DadosAgendamento) {
        return this.http.post<Agendamento>(this.URL, dados);
    }

    atualizar(id: number, dados: DadosAgendamento) {
        return this.http.put<void>(`${this.URL}/${id}`, dados);
    }

    remover(id: number) {
        return this.http.delete<void>(`${this.URL}/${id}`);
    }
}
