
import { Component, effect, input, output } from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    Agendamento,
    DadosAgendamento,
    StatusAgendamento
} from '../agendamento-service';

@Component({
    selector: 'app-formulario-agendamento',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-agendamento.html',
    styleUrl: './formulario-agendamento.scss'
})
export class FormularioAgendamento {

    agendamento = input<Agendamento | null>(null);

    salvar = output<DadosAgendamento>();
    cancelar = output<void>();

    readonly formulario = new FormGroup({
        cliente: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        aparelho: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        tecnico: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        servico: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        data: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        horario: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        status: new FormControl<StatusAgendamento>('Agendado', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    constructor() {
        effect(() => {
            const agendamento = this.agendamento();

            this.formulario.reset({
                cliente: agendamento?.cliente ?? '',
                aparelho: agendamento?.aparelho ?? '',
                tecnico: agendamento?.tecnico ?? '',
                servico: agendamento?.servico ?? '',
                data: agendamento?.data ?? '',
                horario: agendamento?.horario ?? '',
                status: agendamento?.status ?? 'Agendado'
            });
        });
    }

    enviar(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        this.salvar.emit(this.formulario.getRawValue());
    }
}
