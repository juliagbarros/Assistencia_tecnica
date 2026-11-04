
import { Component, effect, input, output } from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    Servico,
    DadosServico,
    StatusServico
} from '../servico-service';

@Component({
    selector: 'app-formulario-servico',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-servico.html',
    styleUrl: './formulario-servico.scss'
})
export class FormularioServico {

    servico = input<Servico | null>(null);

    salvar = output<DadosServico>();
    cancelar = output<void>();

    readonly formulario = new FormGroup({
        nome: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),


        descricao: new FormControl('', {
            nonNullable: true
        }),

        precoPadrao: new FormControl(0, {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.min(0)
            ]
        }),

        status: new FormControl<StatusServico>('Ativo', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    constructor() {
        effect(() => {
            const servico = this.servico();

            this.formulario.reset({
                nome: servico?.nome ?? '',
                descricao: servico?.descricao ?? '',
                precoPadrao: servico?.precoPadrao ?? 0,
                status: servico?.status ?? 'Ativo'
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
