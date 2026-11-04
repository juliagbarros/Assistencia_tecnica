
import {
    Component,
    effect,
    inject,
    input,
    output,
    signal
} from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    Agendamento,
    DadosAgendamento
} from '../agendamento-service';

import { ClienteService } from '../../clientes/cliente-service';
import { TecnicoService } from '../../tecnicos/tecnico-service';
import { SituacaoAgendamento } from '../agendamento-service';

@Component({
    selector: 'app-formulario-agendamento',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-agendamento.html',
    styleUrl: './formulario-agendamento.scss'
})
export class FormularioAgendamento {

    private readonly clienteService = inject(ClienteService);
    private readonly tecnicoService = inject(TecnicoService);

    readonly clientes = this.clienteService.listar();
    readonly tecnicos = this.tecnicoService.listar();

    readonly enumAgendamento = Object.values(SituacaoAgendamento);

    agendamento = input<Agendamento | null>(null);

    salvar = output<DadosAgendamento>();
    cancelar = output<void>();

    readonly erroIntervalo = signal('');

    readonly formulario = new FormGroup({
        clienteId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),
        tecnicoId: new FormControl<number | null>(null, {
            validators: [Validators.required]
        }),
        inicio: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        fim: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        motivo: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        situacao: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    constructor() {
        this.tecnicoService.carregar();

        effect(() => {
            const agendamento = this.agendamento();

            this.formulario.reset({
                clienteId: agendamento?.clienteId ?? null,
                tecnicoId: agendamento?.tecnicoId ?? null,
                inicio: agendamento?.inicio?.slice(0, 16) ?? '',
                fim: agendamento?.fim?.slice(0, 16) ?? '',
                motivo: agendamento?.motivo ?? '',
                situacao: agendamento?.status ?? ''
            });

            this.erroIntervalo.set('');
        });
    }

    private formatarData(valor: string): string {
        return valor.length === 16 ? `${valor}:00` : valor;
    }

    enviar(): void {
        this.erroIntervalo.set('');

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        const dados = this.formulario.getRawValue();

        if (dados.clienteId === null || dados.tecnicoId === null) {
            return;
        }

        if (new Date(dados.fim) <= new Date(dados.inicio)) {
            this.erroIntervalo.set(
                'A data de término deve ser posterior à data de início.'
            );
            return;
        }

        this.salvar.emit({
            clienteId:  dados.clienteId ,
            tecnicoId:  dados.tecnicoId ,
            inicio: this.formatarData(dados.inicio),
            fim: this.formatarData(dados.fim),
            motivo: dados.motivo,
            situacao: dados.situacao.trim()
        });
    }
}
