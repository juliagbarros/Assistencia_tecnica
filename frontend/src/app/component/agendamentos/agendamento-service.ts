
import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type StatusAgendamento =
    'Agendado' |
    'Confirmado' |
    'Concluído' |
    'Cancelado';

export interface Agendamento extends RegistroTabela {
    cliente: string;
    aparelho: string;
    tecnico: string;
    servico: string;
    data: string;
    horario: string;
    status: StatusAgendamento;
}

export interface DadosAgendamento {
    cliente: string;
    aparelho: string;
    tecnico: string;
    servico: string;
    data: string;
    horario: string;
    status: StatusAgendamento;
}

@Injectable({
    providedIn: 'root'
})
export class AgendamentoService {

    private readonly agendamentos = signal<Agendamento[]>([
        {
            id: 1,
            cliente: 'Heitor Santana',
            aparelho: 'Galaxy S24',
            tecnico: 'Carlos Martins',
            servico: 'Troca de tela',
            data: '2026-10-28',
            horario: '09:00',
            status: 'Agendado'
        },
        {
            id: 2,
            cliente: 'João Paulo Menezes',
            aparelho: 'Inspiron 15',
            tecnico: 'Ana Souza',
            servico: 'Limpeza interna',
            data: '2026-10-29',
            horario: '14:00',
            status: 'Confirmado'
        },
        {
            id: 3,
            cliente: 'Júlia Gabrielle Barros',
            aparelho: 'iPad Air',
            tecnico: 'Bruno Lima',
            servico: 'Formatação',
            data: '2026-10-27',
            horario: '10:30',
            status: 'Concluído'
        }
    ]);

    listar() {
        return this.agendamentos.asReadonly();
    }

    criar(dados: DadosAgendamento): void {
        const novoId = Math.max(
            0,
            ...this.agendamentos().map(agendamento => agendamento.id)
        ) + 1;

        const novoAgendamento: Agendamento = {
            id: novoId,
            ...dados
        };

        this.agendamentos.update(agendamentos => [
            ...agendamentos,
            novoAgendamento
        ]);
    }

    atualizar(id: number, dados: DadosAgendamento): boolean {
        const existe = this.agendamentos().some(
            agendamento => agendamento.id === id
        );

        if (!existe) {
            return false;
        }

        this.agendamentos.update(agendamentos =>
            agendamentos.map(agendamento =>
                agendamento.id === id
                    ? { ...agendamento, ...dados }
                    : agendamento
            )
        );

        return true;
    }

    remover(id: number): void {
        this.agendamentos.update(agendamentos =>
            agendamentos.filter(agendamento => agendamento.id !== id)
        );
    }
}
