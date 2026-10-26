import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type StatusAgendamento =
    | 'Agendado'
    | 'Confirmado'
    | 'Concluído'
    | 'Cancelado';

export interface Agendamento extends RegistroTabela {
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
            cliente: 'João Silva',
            aparelho: 'Notebook Dell',
            tecnico: 'Carlos Martins',
            servico: 'Diagnóstico',
            data: '2026-10-27',
            horario: '09:00',
            status: 'Agendado'
        },
        {
            id: 2,
            cliente: 'Maria Oliveira',
            aparelho: 'Galaxy A54',
            tecnico: 'Ana Souza',
            servico: 'Troca de tela',
            data: '2026-10-27',
            horario: '10:30',
            status: 'Confirmado'
        },
        {
            id: 3,
            cliente: 'Ana Costa',
            aparelho: 'iPhone 13',
            tecnico: 'Ana Souza',
            servico: 'Troca de bateria',
            data: '2026-10-28',
            horario: '14:00',
            status: 'Agendado'
        },
        {
            id: 4,
            cliente: 'Pedro Santos',
            aparelho: 'Computador Gamer',
            tecnico: 'Bruno Lima',
            servico: 'Limpeza interna',
            data: '2026-10-24',
            horario: '15:00',
            status: 'Concluído'
        },
        {
            id: 5,
            cliente: 'Carlos Lima',
            aparelho: 'Galaxy Tab S9',
            tecnico: 'Carlos Martins',
            servico: 'Diagnóstico',
            data: '2026-10-23',
            horario: '11:00',
            status: 'Cancelado'
        }
    ]);

    listar() {
        return this.agendamentos.asReadonly();
    }

    remover(id: number): void {
        this.agendamentos.update(agendamentos =>
            agendamentos.filter(a => a.id !== id)
        );
    }
}