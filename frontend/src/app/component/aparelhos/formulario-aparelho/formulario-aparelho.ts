
import { Component, effect, input, output } from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import { Aparelho,DadosAparelho,StatusAparelho } from '../aparelhos-service';
@Component({
    selector: 'app-formulario-aparelho',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-aparelho.html',
    styleUrl: './formulario-aparelho.scss'
})
export class FormularioAparelho {

    aparelho = input<Aparelho | null>(null);

    salvar = output<DadosAparelho>();
    cancelar = output<void>();

    readonly formulario = new FormGroup({
        cliente: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        tipo: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        marca: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        modelo: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),
        numeroSerie: new FormControl('', {
            nonNullable: true
        }),
        status: new FormControl<StatusAparelho>('Recebido', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    constructor() {
        effect(() => {
            const aparelho = this.aparelho();

            this.formulario.reset({
                cliente: aparelho?.cliente ?? '',
                tipo: aparelho?.tipo ?? '',
                marca: aparelho?.marca ?? '',
                modelo: aparelho?.modelo ?? '',
                numeroSerie: aparelho?.numeroSerie ?? '',
                status: aparelho?.status ?? 'Recebido'
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
