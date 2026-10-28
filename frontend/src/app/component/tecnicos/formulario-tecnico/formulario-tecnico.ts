
import { Component, effect, input, output } from '@angular/core';

import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';

import {
    Tecnico,
    DadosTecnico,
    StatusTecnico
} from '../tecnico-service';

@Component({
    selector: 'app-formulario-tecnico',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-tecnico.html',
    styleUrl: './formulario-tecnico.scss'
})
export class FormularioTecnico {

    tecnico = input<Tecnico | null>(null);

    salvar = output<DadosTecnico>();
    cancelar = output<void>();

    readonly formulario = new FormGroup({
        nome: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(3)
            ]
        }),

        telefone: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.pattern(
                    /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
                )
            ]
        }),

        email: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.email
            ]
        }),

        especialidade: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required]
        }),

        status: new FormControl<StatusTecnico>('Ativo', {
            nonNullable: true,
            validators: [Validators.required]
        })
    });

    constructor() {
        effect(() => {
            const tecnico = this.tecnico();

            this.formulario.reset({
                nome: tecnico?.nome ?? '',
                telefone: tecnico?.telefone ?? '',
                email: tecnico?.email ?? '',
                especialidade: tecnico?.especialidade ?? '',
                status: tecnico?.status ?? 'Ativo'
            });
        });
    }

    enviar(): void {
        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }

        this.salvar.emit(
            this.formulario.getRawValue()
        );
    }
}
