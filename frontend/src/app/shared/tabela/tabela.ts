import { Component, computed, input, output, signal } from '@angular/core';
import { LucideSearch, LucidePlus, LucideSquarePen,  LucideTrash2, LucideChevronLeft,   LucideChevronRight
} from '@lucide/angular';

export interface ColunaTabela {
    chave: string;
    titulo: string;
    tipo?: 'texto' | 'status';
}

export interface RegistroTabela {
    id: number;
    [chave: string]: string | number;
}

@Component({
  selector: 'app-tabela',
  imports: [ LucideSearch,
        LucidePlus,
        LucideSquarePen,
        LucideTrash2,
        LucideChevronLeft,
        LucideChevronRight],
  templateUrl: './tabela.html',
  styleUrl: './tabela.scss',
})


export class Tabela {
titulo = input.required<string>();
    descricao = input.required<string>();

    colunas = input.required<ColunaTabela[]>();
    registros = input.required<RegistroTabela[]>();

    placeholderBusca = input('Digite para pesquisar...');
    textoAdicionar = input('Adicionar');

    // Eventos enviados para a página
    adicionar = output<void>();
    editar = output<number>();
    remover = output<number>();

    // Estados internos da tabela
    busca = signal('');
    statusSelecionado = signal('Todos');

    itensPorPagina = signal(10);
    paginaAtual = signal(1);

    selecionados = signal<number[]>([]);

    // Opções de status obtidas dos registros
    opcoesStatus = computed(() => {
        const status = this.registros()
            .map(registro => String(registro['status'] ?? ''))
            .filter(valor => valor !== '');

        return [...new Set(status)];
    });

    // Aplica pesquisa e filtro de status
    registrosFiltrados = computed(() => {
        const texto = this.busca().trim().toLocaleLowerCase('pt-BR');
        const status = this.statusSelecionado();

        return this.registros().filter(registro => {
            const correspondeBusca = Object.values(registro).some(
                valor => String(valor)
                    .toLocaleLowerCase('pt-BR')
                    .includes(texto)
            );

            const correspondeStatus =
                status === 'Todos' ||
                registro['status'] === status;

            return correspondeBusca && correspondeStatus;
        });
    });

    // Quantidade total de páginas
    totalPaginas = computed(() => {
        return Math.max(
            1,
            Math.ceil(
                this.registrosFiltrados().length /
                this.itensPorPagina()
            )
        );
    });

    // Evita exibir um número de página inexistente
    paginaVisivel = computed(() => {
        return Math.min(
            this.paginaAtual(),
            this.totalPaginas()
        );
    });

    // Registros apresentados na página atual
    registrosPaginados = computed(() => {
        const inicio =
            (this.paginaVisivel() - 1) *
            this.itensPorPagina();

        const fim = inicio + this.itensPorPagina();

        return this.registrosFiltrados().slice(inicio, fim);
    });

    alterarBusca(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.busca.set(input.value);
        this.reiniciarPaginacao();
    }

    alterarStatus(event: Event): void {
        const select = event.target as HTMLSelectElement;

        this.statusSelecionado.set(select.value);
        this.reiniciarPaginacao();
    }

    alterarItensPorPagina(event: Event): void {
        const select = event.target as HTMLSelectElement;

        this.itensPorPagina.set(Number(select.value));
        this.reiniciarPaginacao();
    }

    reiniciarPaginacao(): void {
        this.paginaAtual.set(1);
        this.selecionados.set([]);
    }

    selecionarRegistro(id: number, event: Event): void {
        const checkbox = event.target as HTMLInputElement;

        if (checkbox.checked) {
            this.selecionados.update(ids => [...ids, id]);
        } else {
            this.selecionados.update(ids =>
                ids.filter(item => item !== id)
            );
        }
    }

    paginaAnterior(): void {
        if (this.paginaVisivel() > 1) {
            this.paginaAtual.set(this.paginaVisivel() - 1);
        }
    }

    proximaPagina(): void {
        if (this.paginaVisivel() < this.totalPaginas()) {
            this.paginaAtual.set(this.paginaVisivel() + 1);
        }
      }
  
}
