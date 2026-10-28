
import { Component, effect, input, output } from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    OrdemServico,
    DadosOrdem,
    StatusOrdem
} from '../orderns-service';

@Component({
    selector: 'app-formulario-ordem',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-ordem.html',
    styleUrl: './formulario-ordem.scss'
})
export class FormularioOrdem {

    ordem = input<OrdemServico | null>(null);

    salvar = output<DadosOrdem>();
    cancelar = output<void>();

    readonly formulario = new FormGroup({
        numero: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

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

        abertura: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        status: new FormControl<StatusOrdem>('Aberta', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    constructor() {
        effect(() => {
            const ordem = this.ordem();

            this.formulario.reset({
                numero: ordem?.numero ?? '',
                cliente: ordem?.cliente ?? '',
                aparelho: ordem?.aparelho ?? '',
                tecnico: ordem?.tecnico ?? '',
                abertura: ordem?.abertura ?? '',
                status: ordem?.status ?? 'Aberta'
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
