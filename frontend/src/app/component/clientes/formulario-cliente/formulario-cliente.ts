
import {
    Component,
    effect,
    input,
    output
} from '@angular/core';

import {
    ReactiveFormsModule,
    FormGroup,
    FormControl,
    Validators
} from '@angular/forms';

import {
    Cliente,
    DadosCliente
} from '../cliente-service';

@Component({
    selector: 'app-formulario-cliente',
    imports: [ReactiveFormsModule],
    templateUrl: './formulario-cliente.html',
    styleUrl: './formulario-cliente.scss'
})
export class FormularioCliente {

    cliente = input<Cliente | null>(null);

    salvar = output<DadosCliente>();
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

        status: new FormControl<'Ativo' | 'Inativo'>(
            'Ativo',
            {
                nonNullable: true,
                validators: [Validators.required]
            }
        )
    });

    constructor() {
        effect(() => {
            const cliente = this.cliente();

            this.formulario.reset({
                nome: cliente?.nome ?? '',
                telefone: cliente?.telefone ?? '',
                email: cliente?.email ?? '',
                status: cliente?.status ?? 'Ativo'
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
