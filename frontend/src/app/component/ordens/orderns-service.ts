
import { Injectable, signal } from '@angular/core';
import { RegistroTabela } from '../../shared/tabela/tabela';

export type StatusOrdem =
    'Aberta' |
    'Em atendimento' |
    'Concluída' |
    'Entregue';

export interface OrdemServico extends RegistroTabela {
    numero: string;
    cliente: string;
    aparelho: string;
    tecnico: string;
    abertura: string;
    status: StatusOrdem;
}

export interface DadosOrdem {
    numero: string;
    cliente: string;
    aparelho: string;
    tecnico: string;
    abertura: string;
    status: StatusOrdem;
}

@Injectable({
    providedIn: 'root'
})
export class OrdemService {

    private readonly ordens = signal<OrdemServico[]>([
        {
            id: 1,
            numero: 'OS-0001',
            cliente: 'Heitor Santana',
            aparelho: 'Galaxy S24',
            tecnico: 'Carlos Martins',
            abertura: '2026-10-27',
            status: 'Aberta'
        },
        {
            id: 2,
            numero: 'OS-0002',
            cliente: 'João Paulo Menezes',
            aparelho: 'Inspiron 15',
            tecnico: 'Ana Souza',
            abertura: '2026-10-26',
            status: 'Em atendimento'
        },
        {
            id: 3,
            numero: 'OS-0003',
            cliente: 'Júlia Gabrielle Barros',
            aparelho: 'iPad Air',
            tecnico: 'Bruno Lima',
            abertura: '2026-10-25',
            status: 'Concluída'
        }
    ]);

    listar() {
        return this.ordens.asReadonly();
    }

    criar(dados: DadosOrdem): void {
        const novoId = Math.max(
            0,
            ...this.ordens().map(ordem => ordem.id)
        ) + 1;

        const novaOrdem: OrdemServico = {
            id: novoId,
            ...dados
        };

        this.ordens.update(ordens => [
            ...ordens,
            novaOrdem
        ]);
    }

    atualizar(id: number, dados: DadosOrdem): boolean {
        const existe = this.ordens().some(
            ordem => ordem.id === id
        );

        if (!existe) {
            return false;
        }

        this.ordens.update(ordens =>
            ordens.map(ordem =>
                ordem.id === id
                    ? { ...ordem, ...dados }
                    : ordem
            )
        );

        return true;
    }

    remover(id: number): void {
        this.ordens.update(ordens =>
            ordens.filter(ordem => ordem.id !== id)
        );
    }
}
